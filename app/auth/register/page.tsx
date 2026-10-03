import { AuthForm } from "@/components/auth-form";
export const metadata = { title: "Register" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <AuthForm mode="register" token={token} />;
}
