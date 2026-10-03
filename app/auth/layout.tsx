import { Brand } from "@/components/brand";
import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" className="auth-layout">
      <div className="auth-main">
        <header>
          <Brand />
          <Link href="/">Back to home ↗</Link>
        </header>
        {children}
        <footer>Made for the ideas you haven’t shared yet.</footer>
      </div>
      <aside className="auth-aside">
        <div className="auth-aside-mark">✳</div>
        <h2>
          Find the words.
          <br />
          Keep your voice.
        </h2>
        <p>Your next great post probably starts with a thought you already have.</p>
        <div className="auth-note">
          <span>THE POSTLOOM APPROACH</span>
          <p>
            Start rough. Make it clear.
            <br />
            Share something that matters.
          </p>
        </div>
      </aside>
    </main>
  );
}
