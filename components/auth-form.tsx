"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { accountAction } from "@/actions/account";
const titles: Record<string, string> = {
  login: "Good to have you back.",
  register: "Your ideas belong out there.",
  "reset-password": "Let’s get you back in.",
  "new-password": "A fresh start.",
  "verify-email": "Confirm your email.",
  resend: "One more link.",
};
export function AuthForm({ mode, token }: { mode: string; token?: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  return (
    <div className="auth-form">
      <span className="eyebrow">YOUR WRITING WORKSPACE</span>
      <h1>{titles[mode]}</h1>
      <p>
        {mode === "register"
          ? "Create a free workspace and make your next post a little more you."
          : mode === "login"
            ? "Pick up where your last good idea left off."
            : mode === "verify-email"
              ? "Confirm this email to open your workspace."
              : "We’ll help you return to your workspace."}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError("");
          setSuccess("");
          const data = new FormData(e.currentTarget);
          start(async () => {
            try {
              const result = await accountAction(mode, {
                email: String(data.get("email") || ""),
                password: String(data.get("password") || ""),
                name: String(data.get("name") || ""),
                token,
              });
              if (result.error) setError(result.error);
              if (result.success) setSuccess(result.success);
              if (result.redirect) {
                router.push(result.redirect);
                router.refresh();
              }
            } catch {
              setError("We could not connect. Please try again.");
            }
          });
        }}
      >
        {mode === "register" && (
          <label>
            Your name
            <input
              name="name"
              required
              minLength={2}
              maxLength={80}
              autoComplete="name"
              placeholder="How should we call you?"
              disabled={pending}
            />
          </label>
        )}
        {!["verify-email", "new-password"].includes(mode) && (
          <label>
            Email address
            <input
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              placeholder="try: hassan@useryze.com"
              disabled={pending}
            />
          </label>
        )}
        {["login", "register", "new-password"].includes(mode) && (
          <div className="password-group">
            <label htmlFor="account-password">
              {mode === "new-password" ? "New password" : "Password"}
            </label>
            <div className="password-field">
              <input
                id="account-password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={mode === "login" ? 1 : 10}
                maxLength={72}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder={mode === "login" ? "try: hassan@useryze.com" : "At least 10 characters"}
                disabled={pending}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        )}
        {mode === "login" && (
          <Link href="/auth/reset-password" className="forgot-link">
            Forgot password?
          </Link>
        )}
        {error && (
          <p className="notice error" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="notice success" role="status">
            {success}
          </p>
        )}
        <button
          className="button full"
          disabled={pending || (mode === "verify-email" && !!success)}
        >
          {pending
            ? "Please wait…"
            : mode === "login"
              ? "Sign in"
              : mode === "register"
                ? "Create your workspace"
                : mode === "verify-email"
                  ? "Confirm email"
                  : mode === "new-password"
                    ? "Save new password"
                    : "Send email link"}
          <ArrowRightIcon size={17} />
        </button>
      </form>
      {mode === "register" && (
        <p className="auth-legal">
          By signing up, you agree to our <Link href="/terms">terms</Link> and{" "}
          <Link href="/privacy">privacy notice</Link>.
        </p>
      )}
      <p className="auth-switch">
        {mode === "login" ? (
          <>
            New to Postloom? <Link href="/auth/register">Create an account</Link>
          </>
        ) : (
          <>
            Already have an account? <Link href="/auth/login">Sign in</Link>
          </>
        )}
      </p>
      {mode === "login" && (
        <Link href="/auth/resend" className="resend-link">
          Resend confirmation email
        </Link>
      )}
    </div>
  );
}
