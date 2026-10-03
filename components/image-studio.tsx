"use client";
import Image from "next/image";
import { useState, useTransition } from "react";
import { ImageIcon, DownloadSimpleIcon } from "@phosphor-icons/react";
import { generateImage } from "@/actions/generate";
import { useRouter } from "next/navigation";
export function ImageStudio({
  enabled,
  initialPrompt,
  used,
  limit,
}: {
  enabled: boolean;
  initialPrompt: string;
  used: number;
  limit: number;
}) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [ratio, setRatio] = useState("1:1");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <>
      <header className="app-page-header">
        <div>
          <span className="breadcrumb">Workspace / Visuals</span>
          <h1>Give your words a visual.</h1>
          <p>Create a companion image for your next post.</p>
        </div>
        <span className="badge">
          {Math.min(used, limit)} / {limit} images today
        </span>
      </header>
      {!enabled && (
        <p className="notice">
          The image studio is currently disabled. You can prepare a prompt here or create one with
          the writing assistant.
        </p>
      )}
      <div className="settings-grid">
        <section className="form-panel">
          <h2>Describe the image</h2>
          <p>Be specific about the subject, composition, and mood.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setError("");
              start(async () => {
                try {
                  const res = await generateImage({ prompt, ratio });
                  if (res.error) setError(res.error);
                  if (res.image) setImage(res.image);
                  router.refresh();
                } catch {
                  setError("We could not generate the image.");
                }
              });
            }}
          >
            <label>
              Your prompt
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                minLength={10}
                maxLength={2000}
                rows={9}
                placeholder="An overhead photograph of a notebook with pencil sketches, next to a cup of coffee. Natural morning light, muted colors, clean composition. No text."
              />
            </label>
            <label>
              Aspect ratio
              <select value={ratio} onChange={(e) => setRatio(e.target.value)}>
                <option value="1:1">Square · 1:1</option>
                <option value="16:9">Landscape · 16:9</option>
                <option value="9:16">Portrait · 9:16</option>
              </select>
            </label>
            <button disabled={!enabled || pending || used >= limit} className="button">
              <ImageIcon size={18} />
              {pending ? "Creating your image…" : "Generate image"}
            </button>
          </form>
          {error && (
            <p className="notice error" role="alert">
              {error}
            </p>
          )}
          <p className="privacy-note">
            Images have a separate allowance. Generated images are temporary; download any image you
            want to keep before leaving this page.
          </p>
        </section>
        <section className="image-result">
          {pending ? (
            <div className="image-skeleton" aria-busy="true" aria-label="Generating image" />
          ) : image ? (
            <>
              <Image
                unoptimized
                width={1024}
                height={1024}
                src={image}
                alt={`AI generated image: ${prompt.slice(0, 180)}`}
              />
              <a className="button secondary" href={image} download="postloom-image.png">
                <DownloadSimpleIcon size={18} /> Download image
              </a>
            </>
          ) : (
            <div className="empty-state">
              <ImageIcon size={44} />
              <h2>A little room for imagination.</h2>
              <p>Your generated image will appear here.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
