"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpIcon,
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
  DownloadSimpleIcon,
  FeatherIcon,
  FloppyDiskIcon,
  TextAaIcon,
  XIcon,
  LightbulbIcon,
  ChatCircleTextIcon,
  HashIcon,
  MagnifyingGlassIcon,
  ImageIcon,
} from "@phosphor-icons/react";
import { generateText } from "@/actions/generate";
import { saveDraft } from "@/actions/drafts";
import { platforms, type generationSchema } from "@/lib/validation";
import type { z } from "zod";
type Action = z.infer<typeof generationSchema>["action"];
type Platform = (typeof platforms)[number];
type Draft = { id: string; title: string; content: string; platform: string };
export function Editor({ name, initial }: { name: string; initial?: Draft }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [content, setContent] = useState(initial?.content || "");
  const [platform, setPlatform] = useState<Platform>(
    platforms.includes(initial?.platform as Platform)
      ? (initial!.platform as Platform)
      : "LinkedIn",
  );
  const [tone, setTone] = useState<"Natural" | "Professional" | "Conversational" | "Bold">(
    "Natural",
  );
  const [prompt, setPrompt] = useState("");
  const [id, setId] = useState(initial?.id);
  const [result, setResult] = useState("");
  const [resultAction, setResultAction] = useState<Action>("generate");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [pending, start] = useTransition();
  const [dirty, setDirty] = useState(false);
  const [restored, setRestored] = useState(false);
  const router = useRouter();
  const key = `postloom-editor:${initial?.id || "new"}`;
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const cached = sessionStorage.getItem(key);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (typeof parsed.content === "string" && typeof parsed.title === "string") {
            setContent(parsed.content);
            setTitle(parsed.title);
            if (platforms.includes(parsed.platform)) setPlatform(parsed.platform);
            setDirty(true);
            setRestored(true);
          }
        }
      } catch {}
    }, 0);
    return () => clearTimeout(timer);
  }, [key]);
  useEffect(() => {
    if (!dirty) return;
    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem(key, JSON.stringify({ title, content, platform }));
      } catch {}
    }, 400);
    return () => clearTimeout(timer);
  }, [title, content, platform, dirty, key]);
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const limit = { LinkedIn: 3000, X: 280, Instagram: 2200, Facebook: 63206 }[platform];
  function run(action: Action) {
    setError("");
    setStatus("");
    setResult("");
    setResultAction(action);
    start(async () => {
      try {
        const response = await generateText({ action, prompt, content, platform, tone });
        if (response.error) setError(response.error);
        if (response.content) setResult(response.content);
        router.refresh();
      } catch {
        setError("We could not connect to the writing assistant. Please try again.");
      }
    });
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(content);
      setStatus("Copied to clipboard.");
    } catch {
      setError("Clipboard access is unavailable. Select your draft and copy it manually.");
    }
  }
  function exportText() {
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(title || "postloom-draft").replace(/[^a-z0-9]/gi, "_").slice(0, 80)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setStatus("Draft exported.");
  }
  return (
    <>
      <header className="app-page-header">
        <div>
          <span className="breadcrumb">Workspace / Write</span>
          <h1>Make your next post a good one.</h1>
          <p>Start with an idea. Find the words. Keep your voice.</p>
        </div>
        <span className="badge">
          <span className="status-dot" /> Creator workspace
        </span>
      </header>
      <div className="editor-grid">
        <div className="editor-column">
          <section className="editor-panel">
            <div className="panel-heading">
              <span>
                <FeatherIcon size={21} /> Your draft
              </span>
              <span className="muted">
                {dirty ? "Unsaved changes" : id ? "Saved" : "A fresh page"}
              </span>
            </div>
            <div className="editor-selects">
              <label>
                Channel
                <select
                  value={platform}
                  onChange={(e) => {
                    setPlatform(e.target.value as Platform);
                    setDirty(true);
                  }}
                  disabled={pending}
                >
                  {platforms.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
              <label>
                Tone
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as typeof tone)}
                  disabled={pending}
                >
                  {["Natural", "Professional", "Conversational", "Bold"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>
            <input
              aria-label="Draft title"
              className="draft-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setDirty(true);
              }}
              placeholder="Give this idea a title…"
              maxLength={120}
            />
            <textarea
              className="draft-content"
              aria-label="Post content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setDirty(true);
              }}
              maxLength={12000}
              placeholder="What’s something you’ve been thinking about?

A lesson you learned. A small win. A question worth asking.

Start here. The first draft doesn’t have to be perfect."
            />
            <div className="editor-count">
              <span>{words} words</span>
              <span className={content.length > limit ? "text-error" : ""}>
                {content.length.toLocaleString()} / {limit.toLocaleString()} characters
              </span>
            </div>
            <div className="editor-controls">
              <div>
                <button
                  className="icon-button"
                  onClick={copy}
                  disabled={!content}
                  aria-label="Copy draft"
                >
                  <CopyIcon size={20} />
                </button>
                <button
                  className="icon-button"
                  onClick={exportText}
                  disabled={!content}
                  aria-label="Export draft"
                >
                  <DownloadSimpleIcon size={20} />
                </button>
              </div>
              <button
                className="button"
                disabled={pending || !content.trim() || !title.trim()}
                onClick={() => {
                  setError("");
                  setStatus("");
                  start(async () => {
                    try {
                      const response = await saveDraft({ id, title, content, platform });
                      if (response.error) setError(response.error);
                      if (response.id) {
                        setId(response.id);
                        setDirty(false);
                        sessionStorage.removeItem(key);
                        setRestored(false);
                        setStatus("Draft saved to your library.");
                        router.refresh();
                      }
                    } catch {
                      setError("We could not save this draft. Please try again.");
                    }
                  });
                }}
              >
                <FloppyDiskIcon size={17} />
                {pending ? "Working…" : "Save draft"}
              </button>
            </div>
          </section>
          {restored && (
            <p className="notice" role="status">
              Your unsaved writing was restored from this browser tab.
            </p>
          )}
          {content.length > limit && (
            <p className="notice error">
              This draft exceeds {platform}’s character limit. Shorten it before publishing.
            </p>
          )}
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
          <section className="assistant-panel">
            <div className="panel-heading">
              <span>
                <span className="assistant-symbol">✳</span> A little writing help
              </span>
              <span className="badge">AI assistant</span>
            </div>
            <p>Bring an idea, or tell us what you’d like to change.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                run(content.trim() ? "rewrite" : "generate");
              }}
            >
              <label className="sr-only" htmlFor="assistant-prompt">
                Your idea or editing instruction
              </label>
              <textarea
                id="assistant-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                maxLength={3000}
                placeholder="e.g. A LinkedIn post about what I learned from my first product launch"
                disabled={pending}
              />
              <button className="button" disabled={pending || (!prompt.trim() && !content.trim())}>
                {pending
                  ? "Finding the words…"
                  : content.trim()
                    ? "Refine my draft"
                    : "Write a first draft"}
                <ArrowUpIcon size={18} />
              </button>
            </form>
            <div className="assistant-tools">
              {[
                { action: "hooks", label: "Try new hooks", icon: LightbulbIcon },
                { action: "shorten", label: "Make it shorter", icon: TextAaIcon },
                { action: "hashtags", label: "Find hashtags", icon: HashIcon },
                { action: "analyze", label: "Get feedback", icon: MagnifyingGlassIcon },
                { action: "image-prompt", label: "Image prompt", icon: ImageIcon },
              ].map(({ action, label, icon: Icon }) => (
                <button
                  key={action}
                  onClick={() => run(action as Action)}
                  disabled={pending || !content.trim()}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
            {pending && (
              <div className="skeleton-result" aria-label="Generating suggestion" aria-busy="true">
                <i />
                <i />
                <i />
              </div>
            )}
            {result && (
              <div className="ai-result">
                <div>
                  <strong>
                    {resultAction === "analyze"
                      ? "Editorial feedback"
                      : resultAction === "image-prompt"
                        ? "Your image prompt"
                        : "A suggestion for you"}
                  </strong>
                  <button
                    className="icon-button"
                    onClick={() => setResult("")}
                    aria-label="Dismiss suggestion"
                  >
                    <XIcon size={17} />
                  </button>
                </div>
                <p>{result}</p>
                <div className="result-actions">
                  {["generate", "rewrite", "shorten"].includes(resultAction) && (
                    <button
                      className="button small"
                      onClick={() => {
                        setContent(result);
                        setDirty(true);
                        setResult("");
                      }}
                    >
                      <CheckIcon size={16} /> Use this draft
                    </button>
                  )}
                  {resultAction === "hashtags" && (
                    <button
                      className="button small"
                      onClick={() => {
                        setContent((c) => `${c}\n\n${result}`);
                        setDirty(true);
                        setResult("");
                      }}
                    >
                      Add to draft
                    </button>
                  )}
                  {resultAction === "image-prompt" && (
                    <button
                      className="button small"
                      onClick={() =>
                        router.push(`/dashboard/images?prompt=${encodeURIComponent(result)}`)
                      }
                    >
                      Open image studio <ArrowRightIcon size={16} />
                    </button>
                  )}
                  <button
                    className="button secondary small"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(result);
                        setStatus("Suggestion copied.");
                      } catch {
                        setError("Select the suggestion and copy it manually.");
                      }
                    }}
                  >
                    Copy suggestion
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
        <aside className="live-preview">
          <div className="preview-heading">
            <span>Channel preview</span>
            <span className="badge">{platform}</span>
          </div>
          <article className="live-post">
            <div className="sample-user">
              <span className="avatar">{name.slice(0, 1).toUpperCase()}</span>
              <div>
                <strong>{name}</strong>
                <small>Your {platform} post · Preview</small>
              </div>
            </div>
            {content ? (
              <p className="live-post-content">{content}</p>
            ) : (
              <div className="preview-empty">
                <ChatCircleTextIcon size={34} />
                <h3>Your words, in context.</h3>
                <p>Start writing to see how your post comes together.</p>
              </div>
            )}
            <div className="sample-reactions">
              ♡ Like <span>◯ Comment</span>
              <span>↗ Share</span>
            </div>
          </article>
          <p className="preview-disclaimer">
            An approximate text preview. Final formatting may vary on {platform}.
          </p>
          <div className="writing-note">
            <span className="assistant-symbol">✳</span>
            <h3>A thought worth sharing</h3>
            <p>
              Specific is better than impressive. Start with something you noticed, tried, or
              changed your mind about.
            </p>
          </div>
          <p className="privacy-note">
            AI suggestions stay separate until you accept them. Copy or export your finished post to
            publish.
          </p>
        </aside>
      </div>
    </>
  );
}
