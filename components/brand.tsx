import Link from "next/link";
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="Postloom home">
      <span className="brand-mark" aria-hidden="true">
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
          <path d="M5 5h9a5 5 0 0 1 0 10h-4v5H5V5Z" stroke="currentColor" strokeWidth="2.5" />
          <path d="M10 5v10M5 10h9" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      </span>
      {!compact && (
        <span>
          postloom<span className="brand-dot">.</span>
        </span>
      )}
    </Link>
  );
}
