import { z } from "zod";
export const emailSchema = z.string().trim().toLowerCase().email().max(254);
export const passwordSchema = z
  .string()
  .min(10, "Use at least 10 characters.")
  .max(72, "Use at most 72 characters.")
  .refine((v) => new TextEncoder().encode(v).length <= 72, "Password must be at most 72 bytes.");
export const platforms = ["LinkedIn", "X", "Instagram", "Facebook"] as const;
export const draftSchema = z.object({
  id: z
    .string()
    .regex(/^[a-f0-9]{24}$/)
    .optional(),
  title: z.string().trim().min(1).max(120),
  content: z.string().trim().min(1).max(12000),
  platform: z.enum(platforms),
});
export const generationSchema = z
  .object({
    action: z.enum([
      "generate",
      "rewrite",
      "shorten",
      "hooks",
      "hashtags",
      "analyze",
      "image-prompt",
    ]),
    prompt: z.string().trim().max(3000).default(""),
    content: z.string().max(12000).default(""),
    platform: z.enum(platforms),
    tone: z.enum(["Natural", "Professional", "Conversational", "Bold"]),
  })
  .refine((v) => !!(v.content.trim() || v.prompt.trim()), "Add an idea or a draft first.");
export function safeSourceUrl(value: string) {
  const url = new URL(value);
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password)
    throw new Error("Enter a public HTTP or HTTPS URL.");
  return url.href;
}
