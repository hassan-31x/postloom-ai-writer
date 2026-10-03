import { redirect } from "next/navigation";
import { currentUser } from "@/lib/session";
import { usageCount } from "@/lib/rate-limit";
import { dailyLimit } from "@/lib/config";
import { AppNav } from "@/components/app-nav";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Workspace", robots: { index: false, follow: false } };
export const maxDuration = 120;
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser().catch(() => null);
  if (!user) redirect("/auth/login");
  const used = await usageCount(user.id);
  return (
    <div className="app-layout">
      <AppNav name={user.name} used={used} limit={dailyLimit()} />
      <main id="main" className="app-main">
        {children}
      </main>
    </div>
  );
}
