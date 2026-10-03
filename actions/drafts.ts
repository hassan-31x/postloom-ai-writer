"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { draftSchema, safeSourceUrl } from "@/lib/validation";
export async function saveDraft(values: z.infer<typeof draftSchema>) {
  try {
    const user = await currentUser();
    const { id, ...data } = draftSchema.parse(values);
    if (id) {
      const result = await db.draft.updateMany({ where: { id, userId: user.id }, data });
      if (!result.count) return { error: "Draft not found." };
      revalidatePath("/dashboard/drafts");
      return { id, success: "Draft saved." };
    }
    if ((await db.draft.count({ where: { userId: user.id } })) >= 500)
      return { error: "Your library is full. Remove a draft before saving another." };
    const draft = await db.draft.create({ data: { ...data, userId: user.id } });
    revalidatePath("/dashboard/drafts");
    return { id: draft.id, success: "Draft saved." };
  } catch {
    return { error: "We could not save this draft. Check the fields and try again." };
  }
}
export async function deleteDraft(id: string) {
  try {
    const user = await currentUser();
    z.string()
      .regex(/^[a-f0-9]{24}$/)
      .parse(id);
    await db.draft.deleteMany({ where: { id, userId: user.id } });
    revalidatePath("/dashboard/drafts");
    return { success: "Draft removed." };
  } catch {
    return { error: "We could not remove this draft." };
  }
}
export async function addSource(values: { name: string; url: string; notes: string }) {
  try {
    const user = await currentUser();
    const data = z
      .object({
        name: z.string().trim().min(1).max(100),
        url: z.string().url().max(2000),
        notes: z.string().max(5000),
      })
      .parse(values);
    data.url = safeSourceUrl(data.url);
    if ((await db.source.count({ where: { userId: user.id } })) >= 30)
      return { error: "You can save up to 30 sources." };
    await db.source.create({ data: { ...data, userId: user.id } });
    revalidatePath("/dashboard/sources");
    return { success: "Reference saved." };
  } catch {
    return { error: "Check the source name and URL, then try again." };
  }
}
export async function deleteSource(id: string) {
  try {
    const user = await currentUser();
    z.string()
      .regex(/^[a-f0-9]{24}$/)
      .parse(id);
    await db.source.deleteMany({ where: { id, userId: user.id } });
    revalidatePath("/dashboard/sources");
    return { success: "Reference removed." };
  } catch {
    return { error: "We could not remove this reference." };
  }
}
