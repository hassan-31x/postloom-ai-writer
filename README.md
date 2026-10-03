# Postloom

A standalone content workspace for solo creators and small marketing teams, prepared for Vercel. The original `content-web` Amplify project is not changed.

## What works

- Premium responsive landing page, custom brand and icons, social card, sitemap, privacy and terms pages.
- Email/password registration, email verification, login, reset, resend confirmation, and logout.
- Writer with LinkedIn, X, Instagram, and Facebook text previews, word/character counts, copy, export, and tab-local recovery of unsaved text.
- OpenRouter drafting, rewriting, shortening, hooks, hashtags, editorial feedback, and image prompts. Suggestions require explicit acceptance.
- Private draft library with search, edits, and deletion; up to 500 drafts per account.
- Brand voice and reference notes; up to 30 sources. The five latest sources provide context. Links are stored, not crawled.
- Optional OpenRouter image generation and download, with separate limits. Images are temporary and not saved to the database.
- Persistent request limits, an app-wide daily cap, input validation, hashed passwords/tokens, and account ownership checks.

Direct social publishing, automatic scheduling, social analytics, scraping and Pinecone similarity search are not part of this version. The original publishing button was not implemented; insecure social OAuth callbacks and dependencies were removed. Social channel previews are illustrative, not exact platform renderers. This copy uses a **new schema and a separate database**, with no migration of office users or content.

## Local setup

Use Node **22.13+ on the 22.x line**, or Node 24.x.

```sh
npm ci
cp .env.example .env.local
# Fill the values in .env.local, using a separate MongoDB Atlas database.
# Generate AUTH_SECRET using: openssl rand -base64 48
npm run check:env
npm run db:push
npm run db:ttl
npm run dev
```

MongoDB Atlas provides the replica set needed by verification/reset transactions. Use a dedicated `postloom` database and a dedicated database user. Configure Atlas connectivity for your Vercel deployment. Prisma 6.19.3 is retained for MongoDB compatibility; do not upgrade Prisma independently without checking MongoDB support.

Verify your sending domain with Resend and set `EMAIL_FROM` to an address on that domain. Resend's sandbox sender cannot support unrestricted public signups. Signup creates a pending account and sends a verification link; login is blocked until confirmation. If delivery fails, use **Resend confirmation email**. Links expire in one hour and are stored only as hashes. Passwords must be 10–72 characters and at most 72 UTF-8 bytes. Password changes and resets revoke existing sessions.

## Vercel deployment

1. Push **this folder** to a new private Git repository. Never copy the office project's `.env` or Git history.
2. Import the repository in Vercel. Select Next.js and Node 22.x (or 24.x). `vercel.json` supplies `npm ci` and `npm run build`.
3. Set the variables from `.env.example` in Vercel. `DATABASE_URL`, `AUTH_SECRET`, `APP_URL`, `RESEND_API_KEY`, `EMAIL_FROM`, `OPENROUTER_API_KEY` and `SUPPORT_EMAIL` are required for launch. Set `APP_URL` to the final **HTTPS origin**, without a path. No secret uses a `NEXT_PUBLIC_` prefix.
4. With the same database configured locally, run `npm run db:push` and `npm run db:ttl` **once before launch**. These create collections, unique keys, and expiration indexes. The build only generates Prisma Client; it never changes the database.
5. Deploy, then register a real account, confirm its email, log in, generate a post, save/edit/remove a draft, reset your password, and check the new password. `/api/health` checks that the app is serving, not database or provider connectivity.
6. Use a separate database and separate provider keys for preview deployments. Set preview `APP_URL` to that preview's domain so email links do not point to production.

Dashboard routes declare a 120-second maximum duration, with text-provider timeout at 45 seconds and image timeout at 90 seconds. Verify the duration allowed by your Vercel plan. Runtime variables are server-only; the public origin is included in metadata, not credentials. Auth.js detects its callback origin and trusts Vercel’s host headers. The app only protects dashboard routes through server-side session checks; all data and AI actions independently validate the account.

## Keep the free plan inexpensive

The default is `google/gemini-2.5-flash-lite` through OpenRouter. At the time of implementation its listed rates were $0.10 per million input tokens and $0.40 per million output tokens: https://openrouter.ai/google/gemini-2.5-flash-lite. With approximately 2,000 input tokens and a 1,000-token output ceiling, a text request is around $0.0006. This is an estimate, not a billing guarantee. Actual input varies with reference notes. Verify current pricing in your OpenRouter account.

Defaults: 20 text requests per verified account per UTC day; 1,000 text requests across the app. Limits are persisted in MongoDB using unique keys and atomic increments, so they work across Vercel instances. Failed requests count once quota is reserved; rejected attempts may increment the counter beyond the limit, while the UI displays the capped count. Set an OpenRouter key budget too; request caps are not a dollar-denominated spending cap. Provider fallbacks are disabled for text generation to avoid unexpected provider fallback behavior.

Images are disabled by default because they are materially more expensive than text. To enable them, set `ENABLE_IMAGE_GENERATION=true` and confirm an available image-output model in `OPENROUTER_IMAGE_MODEL`. The starter setting is `bytedance-seed/seedream-4.5`, using OpenRouter's `/api/v1/images` API (https://openrouter.ai/docs/guides/overview/multimodal/image-generation). Defaults: 2 images per account and 20 globally per UTC day. Check current rates before enabling. The image timeout still counts against the daily quota. Downloads are generated in the browser; no image-storage bucket is required.

Auth requests have per-email and per-network hourly limits. On Vercel the app uses the Vercel-supplied `x-vercel-forwarded-for` header and stores only its hash. Local development shares a `local` network bucket. Abuse controls are a baseline: enable Vercel firewall/bot rules and OpenRouter budget limits for public launch. Essential session cookies are used; no analytics or advertising trackers are included.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm audit --omit=dev
```

`npm run check:env` verifies required values without printing secrets. It does not contact providers. Build and public pages work without live service credentials. Account and AI flows need configured services. See `VERIFICATION.md` for the actual checks performed and remaining service-dependent checks.

## Before launch

Rotate the credentials embedded in the office source, including database, authentication, mail, AI, vector store, and OAuth keys. The copy contains none of these values, and the original project remains unchanged. Do not reuse office keys or data.

Set a real `SUPPORT_EMAIL` and review the included privacy/terms text for your operating entity, jurisdiction, retention and backup practices. Account deletion/export requests currently require operator assistance; self-service deletion/export is not implemented. Authenticate and authorize those requests before handling them. TTL indexes remove expired tokens and rate counters. Add monitoring for mail delivery errors and provider failures.
