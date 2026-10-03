import { ImageStudio } from "@/components/image-studio";
import { currentUser } from "@/lib/session";
import { usageCount } from "@/lib/rate-limit";
import { imageLimit } from "@/lib/config";
export const metadata = { title: "Image studio" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ prompt?: string }>;
}) {
  const user = await currentUser();
  const { prompt } = await searchParams;
  return (
    <ImageStudio
      enabled={process.env.ENABLE_IMAGE_GENERATION === "true"}
      initialPrompt={(prompt || "").slice(0, 2000)}
      used={await usageCount(user.id, true)}
      limit={imageLimit()}
    />
  );
}
