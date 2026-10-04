"use server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { signIn, signOut } from "@/auth";
import { emailSchema, passwordSchema } from "@/lib/validation";
import { authLimit, LimitError } from "@/lib/rate-limit";
import { sendAccountEmail, tokenHash } from "@/lib/mail";
import { currentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { AccountEmailError, reportAccountError } from "@/lib/account-errors";
const message = (e: unknown) =>
  e instanceof LimitError ? e.message : "We could not complete that request. Please try again.";
export async function accountAction(
  mode: string,
  values: { email?: string; password?: string; name?: string; token?: string },
) {
  try {
    if (mode === "login") {
      const data = z
        .object({ email: emailSchema, password: z.string().min(1).max(72) })
        .parse(values);
      await signIn("credentials", { ...data, redirect: false });
      return { success: "Welcome back.", redirect: "/dashboard" };
    }
    if (mode === "register") {
      const data = z
        .object({
          email: emailSchema,
          password: passwordSchema,
          name: z.string().trim().min(2).max(80),
        })
        .parse(values);
      await authLimit("signup", data.email, 5);
      if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM)
        return { error: "Email signup is not configured yet. Please contact support." };
      const existing = await db.user.findUnique({
        where: { email: data.email },
        select: { emailVerified: true },
      });
      if (!existing)
        await db.user.create({
          data: { ...data, password: await bcrypt.hash(data.password, 12) },
          select: { id: true },
        });
      if (!existing?.emailVerified) await sendAccountEmail(data.email, "verify");
      return {
        success:
          "Check your inbox for a confirmation link. If you already have an account, sign in.",
      };
    }
    if (mode === "reset-password" || mode === "resend") {
      const email = emailSchema.parse(values.email);
      await authLimit(mode, email, 5);
      const user = await db.user.findUnique({ where: { email }, select: { emailVerified: true } });
      if (user && (mode !== "resend" || !user.emailVerified))
        await sendAccountEmail(email, mode === "resend" ? "verify" : "reset");
      return {
        success:
          "If that email has an eligible account, a link is on its way. Check your spam folder too.",
      };
    }
    if (mode === "new-password" || mode === "verify-email") {
      const tokenResult = z
        .string()
        .regex(/^[a-f0-9]{64}$/)
        .safeParse(values.token);
      if (!tokenResult.success)
        return { error: "This link is invalid or expired. Request a new one." };
      const token = tokenResult.data;
      const record = await db.token.findUnique({ where: { hash: tokenHash(token) } });
      const purpose = mode === "new-password" ? "reset" : "verify";
      if (!record || record.purpose !== purpose || record.expires < new Date())
        return { error: "This link is invalid or expired. Request a new one." };
      const data =
        purpose === "reset"
          ? {
              password: await bcrypt.hash(passwordSchema.parse(values.password), 12),
              sessionVersion: { increment: 1 },
            }
          : { emailVerified: new Date() };
      await db.$transaction(async (tx) => {
        await tx.token.delete({ where: { id: record.id } });
        await tx.user.update({ where: { email: record.email }, data, select: { id: true } });
        await tx.token.deleteMany({ where: { email: record.email, purpose } });
      });
      return {
        success:
          purpose === "reset"
            ? "Password updated. Sign in with your new password."
            : "Email confirmed. Your workspace is ready.",
      };
    }
    return { error: "Invalid request." };
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0]?.message || "Check your details." };
    if (e instanceof AuthError) {
      if (e.type === "CredentialsSignin")
        return { error: "Email or password is incorrect, or your email has not been confirmed." };
      const cause = e.cause?.err;
      if (cause instanceof LimitError) return { error: cause.message };
      reportAccountError(mode, cause || e);
      return { error: "Sign in is temporarily unavailable. Please try again shortly." };
    }
    if (!(e instanceof LimitError)) reportAccountError(mode, e);
    if (e instanceof AccountEmailError) return { error: e.message };
    return { error: message(e) };
  }
}
export async function logout() {
  await signOut({ redirectTo: "/" });
}
export async function updateProfile(values: {
  name: string;
  voice: string;
  currentPassword?: string;
  newPassword?: string;
}) {
  try {
    const user = await currentUser();
    const data = z
      .object({ name: z.string().trim().min(2).max(80), voice: z.string().max(2000) })
      .parse(values);
    if (values.newPassword) {
      const password = passwordSchema.parse(values.newPassword);
      if (!values.currentPassword || !(await bcrypt.compare(values.currentPassword, user.password)))
        return { error: "Your current password is incorrect." };
      await db.user.update({
        where: { id: user.id },
        data: {
          ...data,
          password: await bcrypt.hash(password, 12),
          sessionVersion: { increment: 1 },
        },
      });
      return { success: "Password changed. Please sign in again.", redirect: "/auth/login" };
    }
    await db.user.update({ where: { id: user.id }, data });
    revalidatePath("/dashboard");
    return { success: "Your preferences are saved." };
  } catch {
    return { error: "We could not save your preferences. Please try again." };
  }
}
