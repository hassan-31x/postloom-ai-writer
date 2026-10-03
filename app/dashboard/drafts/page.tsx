import { DraftLibrary } from "@/components/draft-library";
import { currentUser } from "@/lib/session";
import { db } from "@/lib/db";
export const metadata = { title: "Saved drafts" };
export default async function Page() {
  const user = await currentUser();
  const drafts = await db.draft.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: 500,
  });
  return (
    <DraftLibrary
      drafts={drafts.map((d) => ({
        id: d.id,
        title: d.title,
        content: d.content,
        platform: d.platform,
        updatedAt: d.updatedAt.toISOString(),
      }))}
    />
  );
}
