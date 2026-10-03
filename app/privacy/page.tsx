import Link from "next/link";
import { Brand } from "@/components/brand";
export const metadata = { title: "Privacy notice" };
export default function Page() {
  const contact = process.env.SUPPORT_EMAIL;
  return (
    <main id="main" className="legal-page">
      <Brand />
      <h1>Privacy notice</h1>
      <p className="legal-date">Effective October 3, 2026</p>
      <p>
        Postloom stores your name, email address, password hash, saved drafts, reference notes,
        brand voice, and usage counters. These are used to provide your workspace, secure your
        account, and enforce usage allowances.
      </p>
      <h2>Your writing and AI services</h2>
      <p>
        When you ask for AI help, Postloom sends your draft or idea, brand voice, and up to five
        recent reference notes to OpenRouter and its selected model provider. Their processing and
        retention policies apply. Avoid including sensitive personal information, confidential
        client information, or material you cannot share with those providers.
      </p>
      <p>
        Drafts and sources are scoped to your account. Other users cannot access them through the
        app. Unsaved editor text may be stored in your browser tab’s session storage and is removed
        when saved. Generated images are not stored by Postloom; download any image you want to
        keep.
      </p>
      <h2>Service providers</h2>
      <p>
        The app uses Vercel for hosting, MongoDB for account and workspace storage, Resend for
        transactional email, and OpenRouter for AI generation. Operators of these services may
        process data in other countries. We do not sell your content or use advertising trackers.
      </p>
      <h2>Cookies and security</h2>
      <p>
        Essential authentication cookies keep you signed in. Postloom does not use advertising or
        analytics cookies. Passwords are hashed. Verification and reset tokens are stored as hashes
        and expire after one hour. Hashed network identifiers and usage counts are used to limit
        abuse; expired rate counters and tokens are automatically removed when the database TTL
        indexes are installed.
      </p>
      <h2>Your choices</h2>
      <p>
        You can edit your name and voice notes, remove drafts and sources, and change your password
        from the workspace. Contact the operator to request an account export, account deletion, or
        help with privacy questions. Account deletion requests are handled by the operator,
        including removal from active storage; service backups may retain data according to the
        operator’s backup schedule.
      </p>
      <h2>Contact</h2>
      <p>
        {contact ? (
          <a href={`mailto:${contact}`}>{contact}</a>
        ) : (
          "Contact the operator at the support address supplied with your workspace."
        )}
      </p>
      <Link href="/" className="button">
        Back to Postloom
      </Link>
    </main>
  );
}
