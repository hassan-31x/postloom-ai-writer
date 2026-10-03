import Link from "next/link";
import {
  ArrowRightIcon,
  CheckIcon,
  FeatherIcon,
  ChatsCircleIcon,
  ExportIcon,
  LinkedinLogoIcon,
  XLogoIcon,
  InstagramLogoIcon,
  FacebookLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Brand } from "@/components/brand";
import { MarketingPreview } from "@/components/marketing-preview";
import { Footer } from "@/components/footer";
import { Tagline } from "@/components/reveal";
import { dailyLimit } from "@/lib/config";
const faqs = [
  [
    "What can I create with Postloom?",
    "Draft posts for LinkedIn, X, Instagram, and Facebook. Generate a first draft, explore hooks, shorten a post, suggest hashtags, or ask for a specific edit.",
  ],
  [
    "Will it sound like me?",
    "Set your brand voice in your workspace and choose a tone for each post. You can edit every suggestion before saving or sharing it.",
  ],
  [
    "Is Postloom free?",
    "The free workspace includes saved drafts, reference sources, and a daily allowance of AI requests. Your workspace shows the current allowance. No credit card is required.",
  ],
  [
    "Does it publish directly to social networks?",
    "You can preview, copy, or export your posts, then publish them on your preferred platform. Direct publishing and automatic scheduling are not included.",
  ],
  [
    "How do reference sources work?",
    "Save a link and paste the notes you want the assistant to use. Postloom uses your notes as context; it does not scrape the linked website.",
  ],
  [
    "What happens to my content?",
    "Your drafts are private to your account. When you request AI help, the draft, your brand voice, and selected reference notes are sent to OpenRouter and its model provider. Read our privacy notice for details.",
  ],
  [
    "Can I generate images?",
    "The image studio is available when enabled by the operator and has a separate daily allowance. You can always use the writing assistant to create an image prompt.",
  ],
];
export default function Home() {
  return (
    <>
      <header className="marketing-header">
        <Brand />
        <nav aria-label="Main navigation">
          <a href="#workflow">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">Questions</a>
        </nav>
        <div className="header-actions">
          <Link href="/auth/login" className="quiet-link">
            Sign in
          </Link>
          <Link href="/auth/register" className="button small">
            Start writing <ArrowRightIcon size={15} />
          </Link>
        </div>
      </header>
      <main id="main">
        <section className="hero">
          <div className="announcement">
            <span className="status-dot" /> A calmer way to create content{" "}
            <ArrowRightIcon size={14} />
          </div>
          <h1>
            Good ideas deserve
            <br />
            <span>better posts.</span>
          </h1>
          <p className="hero-sub">
            Meet your new writing space. Turn the thoughts in your head into social posts that sound
            like you.
          </p>
          <Link className="button hero-cta" href="/auth/register">
            Start writing for free <ArrowRightIcon size={18} />
          </Link>
          <p className="hero-footnote">No credit card. Just your next good idea.</p>
          <MarketingPreview />
          <div className="channel-row">
            <span>One workspace. Wherever you share.</span>
            <div>
              <LinkedinLogoIcon weight="fill" /> LinkedIn
            </div>
            <div>
              <XLogoIcon /> X
            </div>
            <div>
              <InstagramLogoIcon /> Instagram
            </div>
            <div>
              <FacebookLogoIcon weight="fill" /> Facebook
            </div>
          </div>
        </section>
        <section className="benefits section" id="workflow">
          <div className="section-intro">
            <span className="eyebrow">FROM THOUGHT TO POST</span>
            <h2>
              A little structure.
              <br />A lot more you.
            </h2>
            <p>
              You bring the perspective. Postloom helps you find the words, without taking over the
              story.
            </p>
          </div>
          <div className="benefit-list">
            <article>
              <div className="benefit-icon">
                <FeatherIcon size={23} />
              </div>
              <div>
                <span className="step-number">01 / GET IT DOWN</span>
                <h3>Start with the unfinished idea</h3>
                <p>
                  A note, a lesson, a question. Give it a direction and turn it into a first draft
                  worth working with.
                </p>
              </div>
            </article>
            <article>
              <div className="benefit-icon">
                <ChatsCircleIcon size={23} />
              </div>
              <div>
                <span className="step-number">02 / MAKE IT YOURS</span>
                <h3>An editor, not a replacement</h3>
                <p>
                  Try a stronger hook. Cut the extra words. Keep your voice. Every suggestion is
                  yours to accept, change, or leave.
                </p>
              </div>
            </article>
            <article>
              <div className="benefit-icon">
                <ExportIcon size={23} />
              </div>
              <div>
                <span className="step-number">03 / PUT IT OUT THERE</span>
                <h3>Ready for the way you share</h3>
                <p>
                  Check the channel preview, save your draft, then copy or export it when you are
                  ready to publish.
                </p>
              </div>
            </article>
          </div>
        </section>
        <section className="tagline-section">
          <Tagline />
          <p>A focused workspace for the part of creating that should feel good.</p>
        </section>
        <section className="pricing section" id="pricing">
          <div className="section-intro">
            <span className="eyebrow">ROOM TO GET STARTED</span>
            <h2>
              Your next post
              <br />
              starts here.
            </h2>
            <p>
              A useful free workspace, with a clear daily allowance. No trial countdown and no
              payment details.
            </p>
          </div>
          <article className="pricing-panel">
            <div className="pricing-top">
              <h3>Creator workspace</h3>
              <span className="badge">Free</span>
            </div>
            <div className="price">
              $0 <span>to get started</span>
            </div>
            <ul>
              {[
                `${dailyLimit()} AI requests per day`,
                "Drafts saved in your private workspace",
                "Four social channels and live previews",
                "Your own brand voice and reference notes",
                "Copy and export whenever you are ready",
              ].map((item) => (
                <li key={item}>
                  <CheckIcon size={17} />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/auth/register" className="button full">
              Start writing for free <ArrowRightIcon size={18} />
            </Link>
            <small>
              Daily limits reset at midnight UTC. Shared capacity limits apply. Images have a
              separate allowance when enabled.
            </small>
          </article>
        </section>
        <section className="faq section" id="faq">
          <div>
            <span className="eyebrow">A FEW GOOD QUESTIONS</span>
            <h2>
              Before you
              <br />
              start writing.
            </h2>
          </div>
          <div className="faq-list">
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span>+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="closing">
          <span className="assistant-symbol">✳</span>
          <h2>
            Something on your mind?
            <br />
            Make it your next post.
          </h2>
          <Link className="button" href="/auth/register">
            Start writing for free <ArrowRightIcon size={18} />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
