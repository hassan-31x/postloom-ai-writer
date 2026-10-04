# Postloom

Postloom is a full-stack social content workspace built with **Next.js App Router, React, TypeScript, and MongoDB**. It uses Prisma for persistence, Auth.js for email/password authentication, Resend for account emails, and OpenRouter for AI writing and optional image generation.

The application combines server-rendered pages with interactive client components. Mutations run through Next.js Server Actions, while account sessions use encrypted JWT session cookies and database-backed session revocation. The project is configured for deployment on Vercel.

| Layer          | Technology                              | Role                                                      |
| -------------- | --------------------------------------- | --------------------------------------------------------- |
| Application    | Next.js 16.3.8, React 19.3.0            | App Router, Server Components, Server Actions             |
| Language       | TypeScript 5.9                          | Typed components, actions, and service integrations       |
| Database       | MongoDB, Prisma 6.19.3                  | Accounts, drafts, reference notes, tokens, usage counters |
| Authentication | Auth.js / NextAuth 5 beta, bcryptjs     | Credentials login, JWT sessions, password hashing         |
| Validation     | Zod 4                                   | Server-side input validation and normalization            |
| Email          | Resend HTTP API                         | Verification and password reset links                     |
| AI             | OpenRouter HTTP API                     | Drafting, editing, feedback, optional image generation    |
| Interface      | CSS, Geist, Phosphor Icons              | Responsive editor, dashboard, and public pages            |
| Tooling        | ESLint, Prettier, tsx, Node test runner | Static checks, formatting, scripts, unit tests            |

## Run locally

### 1. Prerequisites

- **Node.js 22.13+ on the 22.x line, or Node.js 24.x**, with npm.
- A dedicated MongoDB database with replica-set support, such as MongoDB Atlas.
- A Resend API key and sender address.
- An OpenRouter API key for AI features.

MongoDB transactions are required for email verification and password reset. A standalone MongoDB instance without a replica set cannot complete those operations.

### 2. Install and configure

From the repository root:

```sh
npm ci
cp .env.example .env.local
openssl rand -base64 48
```

Fill in `.env.local` using the variables below. Use the generated value for `AUTH_SECRET`. If you already have a configured `.env`, you can keep it; avoid conflicting values in `.env.local`, which takes precedence.

```sh
npm run check:env
```

This command validates configuration without contacting external services or printing secrets.

### 3. Initialize the database

```sh
npm run db:push
npm run db:ttl
npm run check:auth
```

| Command      | What it does                                                                           |
| ------------ | -------------------------------------------------------------------------------------- |
| `db:push`    | Synchronizes MongoDB collections and indexes with the Prisma schema                    |
| `db:ttl`     | Enables automatic expiration for tokens and request counters                           |
| `check:auth` | Checks full account reads, replica-set support, auth indexes, and sender configuration |

`check:auth` is read-only and sends no emails. With a Resend testing sender, it reports a recipient restriction even when the database checks pass.

### 4. Start the application

```sh
npm run dev
```

Open **http://localhost:3000**. To run the production build locally:

```sh
npm run build
npm start
```

> **Email testing:** A `resend.dev` sender can only send links to the email associated with your Resend account. Use that recipient for local testing, or configure a verified sending domain. Set `APP_URL=http://localhost:3000` locally so account links return to this app.

## Environment variables

Copy the complete template from [`.env.example`](.env.example). Variables are read on the server; credentials do not use a `NEXT_PUBLIC_` prefix.

### Core services

| Variable             | Purpose                                        | Example or requirement                                      |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| `DATABASE_URL`       | MongoDB connection string                      | Dedicated database with replica-set support                 |
| `AUTH_SECRET`        | Protects JWT authentication sessions           | At least 32 characters; generate with OpenSSL               |
| `APP_URL`            | Origin used in email links and public metadata | `http://localhost:3000` locally; HTTPS origin in production |
| `RESEND_API_KEY`     | Authorizes account emails                      | Resend API key                                              |
| `EMAIL_FROM`         | Sender for verification/reset emails           | `Postloom <hello@your-domain.com>`                          |
| `OPENROUTER_API_KEY` | Authorizes AI requests                         | OpenRouter API key                                          |
| `SUPPORT_EMAIL`      | Contact shown in privacy and terms pages       | Your support address                                        |

`check:env` requires all of these values for launch readiness. Public pages and the build can run without live service credentials; authentication and AI operations need their respective services.

### AI and usage settings

| Variable                   | Default                                 | Purpose                                                    |
| -------------------------- | --------------------------------------- | ---------------------------------------------------------- |
| `OPENROUTER_MODEL`         | `google/gemini-2.5-flash-lite`          | Text-generation model identifier                           |
| `AI_DAILY_LIMIT`           | `20`                                    | Text requests per account per UTC day                      |
| `AI_GLOBAL_DAILY_LIMIT`    | `1000`                                  | Text requests across the app per UTC day                   |
| `ENABLE_IMAGE_GENERATION`  | `false`                                 | Enables the image studio                                   |
| `OPENROUTER_IMAGE_MODEL`   | Template: `bytedance-seed/seedream-4.5` | Image model; confirm provider availability before enabling |
| `IMAGE_DAILY_LIMIT`        | `2`                                     | Image requests per account per UTC day                     |
| `IMAGE_GLOBAL_DAILY_LIMIT` | `20`                                    | Image requests across the app per UTC day                  |

Changing environment values requires restarting the local server or redeploying the application.

## Features

| Area             | Functionality                                                                  |
| ---------------- | ------------------------------------------------------------------------------ |
| Writing          | Social post editor, character/word counts, clipboard copy, text export         |
| Channel previews | LinkedIn, X, Instagram, and Facebook text layouts                              |
| AI assistance    | Generate, rewrite, shorten, hooks, hashtags, editorial feedback, image prompts |
| Draft library    | Save, search, edit, and delete up to 500 drafts per account                    |
| Brand context    | Brand voice settings and up to 30 reference sources with notes                 |
| Recovery         | Unsaved editor content restored from tab-local `sessionStorage`                |
| Accounts         | Registration, email confirmation, login, resend, password reset, logout        |
| Image studio     | Optional image generation and download; generated images are temporary         |

AI suggestions require explicit acceptance before replacing editor content. The five latest reference sources contribute their names and notes to writing requests; stored links are not crawled.

Direct social publishing, scheduling, social analytics, and web scraping are outside the current implementation. Channel previews illustrate text layout rather than reproducing platform rendering exactly.

## Architecture

```text
Client components
      │
      ▼
Next.js Server Actions
      ├── Zod validation + account/ownership checks
      ├── Prisma → MongoDB
      ├── Resend → account emails
      └── OpenRouter → AI suggestions and images
```

Pages and layouts render on the server where possible. Client components handle editing, form state, previews, and downloads. Protected dashboard routes call `currentUser()`, and data/AI actions independently validate the account rather than relying only on route protection.

### Repository layout

```text
app/                 App Router pages, layouts, metadata, and API routes
  auth/              Login, signup, verification, and password recovery
  dashboard/         Editor, drafts, settings, sources, and image studio
  api/auth/          Auth.js route handlers
  api/health/        Application liveness endpoint
components/          Interactive forms, editor, navigation, and UI
actions/            Account, draft, source, and AI Server Actions
lib/                 Database, sessions, validation, mail, quotas, providers
prisma/schema.prisma MongoDB models and indexes
scripts/             Environment checks, database setup, and legacy repair
tests/               Validation unit tests
auth.ts              Auth.js providers and session callbacks
vercel.json          Vercel install/build configuration
```

### Data model

| Collection | Stores                                                                     | Key constraints               |
| ---------- | -------------------------------------------------------------------------- | ----------------------------- |
| `User`     | Account details, password hash, verification, brand voice, session version | Unique email                  |
| `Draft`    | Post title, content, platform, owner, timestamps                           | Owner/update-time index       |
| `Source`   | Reference name, URL, notes, owner                                          | Owner index                   |
| `Token`    | Hashed verification/reset token, purpose, email, expiration                | Unique hash; expiration index |
| `Usage`    | Request counter, bucket key, expiration                                    | Unique key; expiration index  |

MongoDB document IDs use ObjectIds. Drafts and sources belong to a user; actions scope reads and mutations to the authenticated owner. The build generates Prisma Client but does not synchronize the database or install expiration indexes.

## Authentication and security

**Account lifecycle:** Register → receive confirmation email → confirm email → sign in → open workspace.

- Email addresses are trimmed and normalized to lowercase before lookup.
- Passwords use bcrypt with a cost factor of 12 and must contain 10–72 characters, with a maximum of 72 UTF-8 bytes.
- Verification and reset links use random 32-byte tokens. Only SHA-256 hashes are stored, and links expire after one hour.
- Token consumption and account updates run in a MongoDB transaction. Consumed links cannot be reused.
- Login requires email confirmation. A signup email failure retains the pending account so confirmation can be requested again.
- JWT sessions last up to seven days. Password changes and resets increment `sessionVersion`; subsequent account checks reject older sessions.
- Auth requests have hourly email and network limits. Vercel network identifiers and email addresses are hashed before use in counter keys; local development shares a network bucket.

Account error logging records operation, error code, and a sanitized provider reason. Account deletion/export requests currently require operator assistance. Essential session cookies are used; the app includes no analytics or advertising trackers.

## AI request behavior

Text requests use OpenRouter's `chat/completions` endpoint. Prompts combine the selected channel and tone, brand voice, draft/idea, and reference notes.

| Setting                 | Implementation                            |
| ----------------------- | ----------------------------------------- |
| Output limit            | 1,000 tokens per text request             |
| Temperature             | `0.65`                                    |
| Text timeout            | 45 seconds                                |
| Image timeout           | 90 seconds                                |
| Text provider fallbacks | Disabled                                  |
| Daily reset             | Midnight UTC                              |
| Counter storage         | MongoDB unique keys and atomic increments |

Quota is reserved before calling the provider, so failed provider requests consume allowance. Counters persist across app instances. Rejected requests can increment counters beyond the limit; the UI caps the displayed usage.

Images are disabled by default. When enabled, the server calls the OpenRouter `images` endpoint and returns supported base64 image data to the browser for download. Images are not saved in MongoDB or an object-storage bucket.

Actual charges depend on the selected model and token/image usage. Check provider pricing and configure an OpenRouter key budget in addition to application request limits.

## Commands and verification

| Command                   | Purpose                                                        |
| ------------------------- | -------------------------------------------------------------- |
| `npm run dev`             | Start the development server with Webpack                      |
| `npm run build`           | Generate Prisma Client and build production assets             |
| `npm start`               | Serve the production build                                     |
| `npm run lint`            | Run ESLint                                                     |
| `npm run typecheck`       | Run TypeScript without emitting files                          |
| `npm test`                | Run the validation unit tests                                  |
| `npm run format`          | Format configured source paths with Prettier                   |
| `npm run check:env`       | Validate environment values                                    |
| `npm run check:auth`      | Check database/auth service configuration without sending mail |
| `npm run db:repair-users` | Backfill null/missing default fields in legacy accounts        |

For a release check:

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm audit --omit=dev
```

See [VERIFICATION.md](VERIFICATION.md) for recorded browser checks and service-dependent limitations. `npm test` runs the committed validation tests; the recorded browser checks used an isolated database and mocked email/AI responses. They do not establish real email delivery or provider availability.

## Troubleshooting

<details>
<summary><strong>Prisma P2032: createdAt is null</strong></summary>

Existing MongoDB documents can contain explicit null values even when the Prisma schema declares a non-null field with a default. Schema synchronization does not repair those values.

```sh
npm run db:repair-users
npm run check:auth
```

The repair recovers null/missing `createdAt` from the ObjectId timestamp and restores null/missing `sessionVersion` and `voice` defaults. Existing non-null values, passwords, and verification state are preserved. Repeating the repair does not change already repaired records.

</details>

<details>
<summary><strong>Registration, resend, or password reset returns a mail error</strong></summary>

Run `npm run check:auth`. Check the Resend API key, sender verification, and recipient eligibility. A `resend.dev` sender is restricted to the Resend account owner's email. For other recipients, configure an address on a verified domain.

After a failed signup email, use **Resend confirmation email**. Do not assume a pending account can sign in before its email is confirmed.

</details>

<details>
<summary><strong>Login fails or a session expires</strong></summary>

Confirm the email first, use the correct password, and check for rate-limit errors. Password changes and resets invalidate previous sessions; sign in again with the new password. Run `npm run check:auth` to detect database conversion/index problems separately from incorrect credentials.

</details>

<details>
<summary><strong>Database transactions or email links fail</strong></summary>

Use a MongoDB replica set and configure database network access for the machine or deployment connecting to it. Run `npm run db:push` and `npm run db:ttl` before testing account flows.

Set `APP_URL` to the origin where the app is running. A deployed app using a localhost origin will send confirmation/reset links that open localhost. Expired, malformed, or consumed links require a new email request.

</details>

## Deploy to Vercel

1. Import the repository and select Next.js with Node 22.x or 24.x. `vercel.json` configures `npm ci` and `npm run build`.
2. Add the environment variables from `.env.example`. Set `APP_URL` to the final HTTPS origin and use a verified email sender for public signup.
3. With the deployment database configured locally, run `npm run db:push`, `npm run db:ttl`, and `npm run check:auth`.
4. Deploy, then test registration, confirmation, login, AI generation, draft operations, password reset, and login with the new password against real services.
5. Use separate database/provider credentials for previews, and set preview `APP_URL` to the corresponding preview origin.

Dashboard routes declare a maximum duration of 120 seconds. Confirm your deployment supports the configured provider timeouts. `/api/health` checks application liveness only; it does not check MongoDB, Resend, or OpenRouter.

Before public launch, review the privacy/terms pages, set `SUPPORT_EMAIL`, configure provider budgets, and monitor delivery/provider failures. Keep credentials out of Git and use dedicated project databases and service keys.

## GitHub repository description

> AI-powered social content workspace built with Next.js, TypeScript, and MongoDB, featuring draft management, brand voice, email authentication, and OpenRouter writing tools.

**Suggested topics:**

```text
nextjs react typescript mongodb prisma authjs openrouter resend
ai-writing social-media content-creation draft-management saas vercel
```
