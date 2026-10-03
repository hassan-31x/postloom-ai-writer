import { SourceLibrary } from "@/components/source-library";
import { currentUser } from "@/lib/session";
import { db } from "@/lib/db";
export const metadata = { title: "Reference sources" };
export default async function Page() {
  const user = await currentUser();
  const sources = await db.source.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, url: true, notes: true },
  });
  return <SourceLibrary sources={sources} />;
}
