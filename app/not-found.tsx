import Link from "next/link";
import { Brand } from "@/components/brand";
export default function NotFound() {
  return (
    <main id="main" className="standalone">
      <Brand />
      <span className="eyebrow">404 / A MISSING PAGE</span>
      <h1>
        This page hasn’t
        <br />
        found its words.
      </h1>
      <p>Let’s get you back to somewhere useful.</p>
      <Link className="button" href="/">
        Back to Postloom
      </Link>
    </main>
  );
}
