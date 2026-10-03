# Verification record

Checked on October 3, 2026 with Node 24.21.0.

- `npm run build` passed on Next.js 16.3.8 with Webpack. Webpack is selected in the build script because the current local sandbox prevented Turbopack from binding its worker port. Next.js 16 supports Webpack builds.
- `npm run lint` and `npm run typecheck` passed.
- `npm test` passed six validation tests.
- `npm audit --omit=dev` found zero production dependency advisories. A full audit found five high advisories in development lint tooling through `braces`; no patched `braces` release was available in the registry at the time of testing. These packages do not ship in the production app bundle.
- Twenty seven browser integration checks passed against a production Next.js server and an isolated temporary MongoDB replica set. They covered the landing and legal pages, branded assets, responsive overflow, signup, email verification and token replay, login, protected routes, draft save/search/edit/recovery/delete, AI suggestions and quotas, reference notes, brand voice, private ownership, disabled image state, password reset and session invalidation, logout, and browser JavaScript errors.
- Resend email delivery and OpenRouter responses were mocked in browser tests. Real API keys, domain verification, Atlas connectivity from Vercel, and live AI/image generation still require verification with the deployment owner’s accounts before public launch.

Screenshots from the browser check are in `docs/screenshots/`. No office credentials or data were used for the integration database or mocked provider requests.
