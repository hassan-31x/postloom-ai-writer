import Link from "next/link";
import { Brand } from "@/components/brand";
export const metadata = { title: "Terms of use" };
export default function Page() {
  const contact = process.env.SUPPORT_EMAIL;
  return (
    <main id="main" className="legal-page">
      <Brand />
      <h1>Terms of use</h1>
      <p className="legal-date">Effective October 3, 2026</p>
      <p>
        Postloom provides a writing workspace with AI assistance. By creating an account, you agree
        to use it lawfully, keep your sign in credentials secure, and provide an email address you
        control. This service is intended for adults.
      </p>
      <h2>Your content</h2>
      <p>
        You retain your rights to the content you create. You must have permission to use any
        content or references you provide. You authorize the app and its service providers to
        process your content as needed to deliver the requested functionality.
      </p>
      <h2>AI suggestions</h2>
      <p>
        AI output may be inaccurate, incomplete, or similar to output provided to other users.
        Review facts, attribution, rights, and suitability before publishing. Postloom does not
        guarantee engagement, reach, or any specific business result.
      </p>
      <h2>Free access and limits</h2>
      <p>
        Free access is subject to daily request allowances and shared capacity limits. Allowances
        reset at midnight UTC. Requests that reach the generation service may count even if the
        provider fails. Image generation is optional and uses a separate allowance. The operator may
        adjust allowances or suspend accounts that abuse the service.
      </p>
      <h2>Sharing and publishing</h2>
      <p>
        Postloom helps you draft, preview, copy, and export content. It does not automatically
        publish to social accounts or schedule posts. You are responsible for publishing on your
        chosen platform and following that platform’s policies.
      </p>
      <h2>Acceptable use</h2>
      <p>
        Do not attempt to bypass usage limits, access another person’s data, exploit the service,
        distribute malware, or generate unlawful, deceptive, or abusive content.
      </p>
      <h2>Availability</h2>
      <p>
        The service is provided as available, subject to applicable law. Availability depends on
        hosting, database, email, and AI providers. The operator may change or discontinue
        functionality. These terms do not limit rights that cannot legally be excluded in your
        jurisdiction.
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
