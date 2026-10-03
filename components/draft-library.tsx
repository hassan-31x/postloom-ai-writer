"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import {
  BookmarkSimpleIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  ArrowUpRightIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { deleteDraft } from "@/actions/drafts";
type Draft = { id: string; title: string; content: string; platform: string; updatedAt: string };
export function DraftLibrary({ drafts }: { drafts: Draft[] }) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState<string>();
  const [pending, start] = useTransition();
  const shown = drafts.filter((d) =>
    `${d.title} ${d.content} ${d.platform}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <header className="app-page-header">
        <div>
          <span className="breadcrumb">Workspace / Library</span>
          <h1>A home for your good ideas.</h1>
          <p>
            {drafts.length} saved {drafts.length === 1 ? "draft" : "drafts"}. Ready whenever you
            are.
          </p>
        </div>
        <Link href="/dashboard" className="button">
          <PlusIcon size={18} /> New draft
        </Link>
      </header>
      <div className="library-search">
        <MagnifyingGlassIcon size={19} />
        <input
          aria-label="Search drafts"
          placeholder="Find a title, phrase, or channel…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {error && (
        <p className="notice error" role="alert">
          {error}
        </p>
      )}
      {!shown.length ? (
        <section className="empty-state">
          <BookmarkSimpleIcon size={40} />
          <h2>{query ? "No matching drafts." : "Your library starts with one idea."}</h2>
          <p>
            {query
              ? "Try another title, phrase, or channel."
              : "Write something, give it a title, and save it here for later."}
          </p>
          <Link href="/dashboard" className="button">
            Write a post
          </Link>
        </section>
      ) : (
        <div className="draft-list">
          {shown.map((d) => (
            <article key={d.id} className="draft-row">
              <div>
                <span className="badge">{d.platform}</span>
                <h2>
                  <Link href={`/dashboard?draft=${d.id}`}>{d.title}</Link>
                </h2>
                <p>
                  {d.content.slice(0, 160)}
                  {d.content.length > 160 ? "…" : ""}
                </p>
                <small>
                  Updated{" "}
                  {new Intl.DateTimeFormat("en", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    timeZone: "UTC",
                  }).format(new Date(d.updatedAt))}
                </small>
              </div>
              <div className="draft-actions">
                <Link
                  className="icon-button"
                  href={`/dashboard?draft=${d.id}`}
                  aria-label={`Edit ${d.title}`}
                >
                  <ArrowUpRightIcon size={20} />
                </Link>
                {confirm === d.id ? (
                  <>
                    <button
                      disabled={pending}
                      className="button danger small"
                      onClick={() =>
                        start(async () => {
                          try {
                            const res = await deleteDraft(d.id);
                            if (res.error) setError(res.error);
                            setConfirm(undefined);
                          } catch {
                            setError("Could not remove this draft.");
                          }
                        })
                      }
                    >
                      Remove
                    </button>
                    <button
                      className="button secondary small"
                      onClick={() => setConfirm(undefined)}
                    >
                      Keep
                    </button>
                  </>
                ) : (
                  <button
                    className="icon-button"
                    aria-label={`Remove ${d.title}`}
                    onClick={() => setConfirm(d.id)}
                  >
                    <TrashIcon size={19} />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
