import "server-only";
import { auth } from "@/auth";
import { db } from "@/lib/db";
export async function currentUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Please sign in to continue.");
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
      emailVerified: true,
      sessionVersion: true,
      voice: true,
    },
  });
  if (
    !user ||
    !user.emailVerified ||
    user.sessionVersion !== (session.user as unknown as { sessionVersion: number }).sessionVersion
  )
    throw new Error("Your session has expired. Please sign in again.");
  return user;
}
