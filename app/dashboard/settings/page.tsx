import { SettingsForm } from "@/components/settings-form";
import { currentUser } from "@/lib/session";
export const metadata = { title: "Brand & settings" };
export default async function Page() {
  const user = await currentUser();
  return <SettingsForm name={user.name} email={user.email} voice={user.voice} />;
}
