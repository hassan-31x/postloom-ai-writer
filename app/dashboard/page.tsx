import { Editor } from "@/components/editor";
import { currentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
export const metadata = { title: "Write a post" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ draft?: string }>;
}) {
  const user = await currentUser();
  const { draft } = await searchParams;
  let initial;
  if (draft) {
    if (!/^[a-f0-9]{24}$/.test(draft)) notFound();
    initial = await db.draft.findFirst({
      where: { id: draft, userId: user.id },
      select: { id: true, title: true, content: true, platform: true },
    });
    if (!initial) notFound();
  }
  return <Editor key={draft || "new"} name={user.name} initial={initial || undefined} />;
}
