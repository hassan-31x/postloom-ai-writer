"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="standalone">
      <span className="eyebrow">A SMALL INTERRUPTION</span>
      <h1>We couldn’t load this page.</h1>
      <p>Please try again. Your saved drafts remain in your workspace.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
      <Link href="/">Back to home</Link>
    </main>
  );
}
