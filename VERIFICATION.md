# Verification record

Rechecked on October 4, 2026 after the authentication fixes:

- Follow-up correction: the original connectivity check selected only account IDs and missed legacy `createdAt: null` values. Those full-record reads failed with Prisma `P2032`. `npm run db:repair-users` backfilled null/missing default fields in four existing accounts; full Prisma reads now pass for all five accounts. Passwords, verification state, and existing non-null values were preserved.
- Authentication/session queries now select the fields they use rather than reading unrelated account timestamps. The diagnostic now checks full account records to catch legacy conversion failures.
- Thirty eight browser checks now pass, including reproducing the exact null-field `P2032`, verifying the migration restores creation time from the ObjectId while preserving password/verification, and confirming the migration is idempotent. The complete signup/verification/login/reset flow still uses mocked email delivery; real delivery to arbitrary recipients remains blocked by Resend's testing-sender restriction.
- Fixed the Node 24 CommonJS import in the environment/database setup scripts. Applied the missing collections and unique indexes to the configured MongoDB database, then installed token/counter expiration settings.
- Read-only checks confirmed MongoDB connectivity, replica-set support, all authentication unique/expiration indexes, and that the configured Resend key can access the domains API. No real account emails were sent and no existing accounts were modified by the checks.
- `npm run build`, `npm run lint`, `npm run typecheck`, and all six validation tests passed.
- Thirty five browser integration checks passed against the current production build and an isolated temporary MongoDB replica set. In addition to the earlier coverage, they checked resend confirmation, malformed links, mail rejection during signup/resend/reset, failed-token cleanup, unknown-account reset responses, reset-token replay, rejection of the old password, and login rate-limit errors.
- Email and AI responses were mocked in the browser checks. The current `EMAIL_FROM` uses Resend's testing domain, which restricts recipients to the Resend account owner's email. `APP_URL` points to localhost. These values were retained at the owner's request. Public email delivery and deployed confirmation/reset links require updating those values later. `npm run check:auth` reports this configuration restriction while confirming the repaired database setup.

Checked on October 3, 2026 with Node 24.21.0.

- `npm run build` passed on Next.js 16.3.8 with Webpack. Webpack is selected in the build script because the current local sandbox prevented Turbopack from binding its worker port. Next.js 16 supports Webpack builds.
- `npm run lint` and `npm run typecheck` passed.
- `npm test` passed six validation tests.
- `npm audit --omit=dev` found zero production dependency advisories. A full audit found five high advisories in development lint tooling through `braces`; no patched `braces` release was available in the registry at the time of testing. These packages do not ship in the production app bundle.
- Twenty seven browser integration checks passed against a production Next.js server and an isolated temporary MongoDB replica set. They covered the landing and legal pages, branded assets, responsive overflow, signup, email verification and token replay, login, protected routes, draft save/search/edit/recovery/delete, AI suggestions and quotas, reference notes, brand voice, private ownership, disabled image state, password reset and session invalidation, logout, and browser JavaScript errors.
- Resend email delivery and OpenRouter responses were mocked in browser tests. Real API keys, domain verification, Atlas connectivity from Vercel, and live AI/image generation still require verification with the deployment owner’s accounts before public launch.

Screenshots from the browser check are in `docs/screenshots/`. No office credentials or data were used for the integration database or mocked provider requests.
