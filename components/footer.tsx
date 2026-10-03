import Link from "next/link";
import { Brand } from "@/components/brand";
export function Footer() {
  return (
    <footer className="site-footer">
      <Brand />
      <span>Make something worth sharing.</span>
      <nav aria-label="Legal">
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/auth/login">Sign in</Link>
      </nav>
      <small>© {new Date().getFullYear()} Postloom</small>
    </footer>
  );
}
