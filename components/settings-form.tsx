"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/actions/account";
export function SettingsForm({
  name,
  email,
  voice,
}: {
  name: string;
  email: string;
  voice: string;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();
  return (
    <>
      <header className="app-page-header">
        <div>
          <span className="breadcrumb">Workspace / Preferences</span>
          <h1>Make this space yours.</h1>
          <p>A familiar voice. A few preferences. Less setup next time.</p>
        </div>
      </header>
      <div className="settings-grid">
        <section className="form-panel">
          <h2>Your voice & profile</h2>
          <p>Your voice notes guide every AI suggestion.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              setError("");
              setStatus("");
              start(async () => {
                try {
                  const res = await updateProfile({
                    name: String(f.get("name")),
                    voice: String(f.get("voice")),
                    currentPassword: String(f.get("currentPassword") || ""),
                    newPassword: String(f.get("newPassword") || ""),
                  });
                  if (res.error) setError(res.error);
                  if (res.success) setStatus(res.success);
                  if (res.redirect) router.push(res.redirect);
                  router.refresh();
                } catch {
                  setError("Could not save your preferences.");
                }
              });
            }}
          >
            <label>
              Your name
              <input
                name="name"
                defaultValue={name}
                required
                minLength={2}
                maxLength={80}
                autoComplete="name"
              />
            </label>
            <label>
              Email address
              <input value={email} readOnly type="email" />
              <small>Your verified sign in address.</small>
            </label>
            <label>
              Brand voice
              <textarea
                name="voice"
                defaultValue={voice}
                maxLength={2000}
                rows={7}
                placeholder="I write about building products. Keep it direct and conversational. Use short paragraphs. Avoid hype, emojis, and corporate jargon."
              />
              <small>Describe your audience, style, subjects, and words to avoid.</small>
            </label>
            <details className="password-settings">
              <summary>Change your password</summary>
              <label>
                Current password
                <input
                  name="currentPassword"
                  type="password"
                  maxLength={72}
                  autoComplete="current-password"
                />
              </label>
              <label>
                New password
                <input
                  name="newPassword"
                  type="password"
                  minLength={10}
                  maxLength={72}
                  autoComplete="new-password"
                />
              </label>
              <p className="muted">Changing your password signs out all existing sessions.</p>
            </details>
            {error && (
              <p role="alert" className="notice error">
                {error}
              </p>
            )}
            {status && (
              <p role="status" className="notice success">
                {status}
              </p>
            )}
            <button className="button" disabled={pending}>
              {pending ? "Saving…" : "Save preferences"}
            </button>
          </form>
        </section>
        <aside className="settings-note">
          <span className="assistant-symbol">✳</span>
          <h2>
            Sound like yourself,
            <br />
            on a good writing day.
          </h2>
          <p>
            The best voice notes are specific. Tell the assistant what you write about, who you
            write for, and what feels natural to you.
          </p>
          <div className="voice-example">
            <span className="eyebrow">A USEFUL STARTING POINT</span>
            <p>
              “I share practical lessons for first time founders. Friendly, direct, and honest. A
              strong first sentence, short paragraphs, no invented personal stories.”
            </p>
          </div>
          <p className="privacy-note">
            Your voice notes and reference notes are sent with AI requests. Keep sensitive or
            confidential information out of them.
          </p>
        </aside>
      </div>
    </>
  );
}
