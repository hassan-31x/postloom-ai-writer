"use client";
import { useState, useTransition } from "react";
import { FolderSimpleIcon, ArrowUpRightIcon, TrashIcon } from "@phosphor-icons/react";
import { addSource, deleteSource } from "@/actions/drafts";
type Source = { id: string; name: string; url: string; notes: string };
export function SourceLibrary({ sources }: { sources: Source[] }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [confirm, setConfirm] = useState<string>();
  return (
    <>
      <header className="app-page-header">
        <div>
          <span className="breadcrumb">Workspace / Context</span>
          <h1>Give your ideas a little context.</h1>
          <p>Keep useful references and notes in one place.</p>
        </div>
        <span className="badge">{sources.length} / 30 sources</span>
      </header>
      <div className="settings-grid">
        <section className="form-panel">
          <h2>Add a reference</h2>
          <p>
            Paste the facts or examples you want to write from. We use your notes as context,
            without fetching the linked page.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const f = new FormData(form);
              setError("");
              setStatus("");
              start(async () => {
                try {
                  const res = await addSource({
                    name: String(f.get("name")),
                    url: String(f.get("url")),
                    notes: String(f.get("notes")),
                  });
                  if (res.error) setError(res.error);
                  if (res.success) {
                    setStatus(res.success);
                    form.reset();
                  }
                } catch {
                  setError("We could not save your reference.");
                }
              });
            }}
          >
            <label>
              Reference name
              <input name="name" required maxLength={100} placeholder="Our product notes" />
            </label>
            <label>
              Source URL
              <input
                name="url"
                type="url"
                required
                maxLength={2000}
                placeholder="https://example.com/article"
              />
            </label>
            <label>
              Notes for the assistant
              <textarea
                name="notes"
                maxLength={5000}
                rows={6}
                placeholder="Paste a few relevant facts, excerpts you have permission to use, or your own notes."
              />
            </label>
            <button className="button" disabled={pending}>
              {pending ? "Saving…" : "Save reference"}
            </button>
          </form>
          {error && (
            <p className="notice error" role="alert">
              {error}
            </p>
          )}
          {status && (
            <p className="notice success" role="status">
              {status}
            </p>
          )}
        </section>
        <section className="source-list">
          <h2>Your references</h2>
          <p className="muted">The five most recent references help shape AI suggestions.</p>
          {!sources.length ? (
            <div className="empty-state compact">
              <FolderSimpleIcon size={34} />
              <h3>A little background goes a long way.</h3>
              <p>Add product details, brand notes, or a useful article.</p>
            </div>
          ) : (
            sources.map((s) => (
              <article key={s.id} className="source-row">
                <div>
                  <h3>{s.name}</h3>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    Open reference <ArrowUpRightIcon size={14} />
                  </a>
                  <p>{s.notes || "No reference notes added."}</p>
                </div>
                {confirm === s.id ? (
                  <div>
                    <button
                      className="button danger small"
                      disabled={pending}
                      onClick={() =>
                        start(async () => {
                          try {
                            const res = await deleteSource(s.id);
                            if (res.error) setError(res.error);
                            setConfirm(undefined);
                          } catch {
                            setError("Could not remove the reference.");
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
                  </div>
                ) : (
                  <button
                    className="icon-button"
                    onClick={() => setConfirm(s.id)}
                    aria-label={`Remove ${s.name}`}
                  >
                    <TrashIcon size={18} />
                  </button>
                )}
              </article>
            ))
          )}
        </section>
      </div>
    </>
  );
}
