import {
  FeatherIcon,
  ArrowUpIcon,
  DotsThreeIcon,
  CheckCircleIcon,
  BookmarkSimpleIcon,
  SlidersHorizontalIcon,
  HouseIcon,
} from "@phosphor-icons/react/dist/ssr";
export function MarketingPreview() {
  return (
    <div className="product-preview" aria-label="Example of the Postloom writing workspace">
      <div className="preview-toolbar">
        <div className="window-dots">
          <i />
          <i />
          <i />
        </div>
        <span>postloom / workspace</span>
        <span className="sample-label">Product preview</span>
      </div>
      <div className="preview-body">
        <aside className="preview-nav">
          <div className="preview-mini-brand">p.</div>
          <HouseIcon size={20} />
          <span className="preview-active">
            <FeatherIcon size={20} />
          </span>
          <BookmarkSimpleIcon size={20} />
          <SlidersHorizontalIcon size={20} />
          <div className="preview-avatar">S</div>
        </aside>
        <div className="preview-editor">
          <div className="preview-heading">
            <span>Your next great post</span>
            <span className="saved-dot">
              <CheckCircleIcon size={14} /> Draft
            </span>
          </div>
          <div className="preview-channel">
            LinkedIn <span>↗</span>
            <span className="muted">Natural voice</span>
          </div>
          <h3>A small lesson from building in public</h3>
          <p>I used to wait until an idea felt finished before sharing it.</p>
          <p>
            Now I share the work while it is still taking shape. The rough sketches. The decisions I
            am unsure about. The things that did not work.
          </p>
          <p>The conversations that follow are often more useful than another week of polishing.</p>
          <p>What are you working on that is worth sharing before it is perfect?</p>
          <div className="preview-bottom">
            <span>Example draft · 76 words</span>
            <span className="preview-action">Save draft</span>
          </div>
          <div className="preview-assistant">
            <span className="assistant-symbol">✳</span>
            <span>Make the opening more conversational</span>
            <span className="preview-send">
              <ArrowUpIcon size={16} />
            </span>
          </div>
        </div>
        <div className="preview-post">
          <span className="eyebrow">LIVE PREVIEW</span>
          <div className="sample-post">
            <div className="sample-user">
              <span className="avatar peach">S</span>
              <div>
                <strong>Sam Rivera</strong>
                <small>Designer & independent maker</small>
              </div>
              <DotsThreeIcon size={18} />
            </div>
            <p>I used to wait until an idea felt finished before sharing it.</p>
            <p>
              Now I share the work while it is still taking shape. The rough sketches. The decisions
              I am unsure about. The things that did not work.
            </p>
            <p>
              The conversations that follow are often more useful than another week of polishing.
            </p>
            <span className="muted">…see more</span>
            <div className="sample-reactions">
              ♡ Like <span>◯ Comment</span>
              <span>↗ Repost</span>
            </div>
          </div>
          <div className="preview-note">
            <span>✳</span>
            <div>
              <strong>Your ideas. Your voice.</strong>
              <p>A little help with the words.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
