import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { appUrl } from "@/lib/config";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(appUrl()),
  title: { default: "Postloom | Good ideas deserve better posts", template: "%s | Postloom" },
  description:
    "Turn rough ideas into social posts that sound like you. Write, refine, preview, and save your next post with Postloom.",
  applicationName: "Postloom",
  openGraph: {
    type: "website",
    siteName: "Postloom",
    title: "Good ideas deserve better posts",
    description: "Your ideas. Your voice. A little help with the words.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Postloom", images: ["/opengraph-image"] },
  icons: { icon: "/icon.svg", apple: "/apple-icon" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
