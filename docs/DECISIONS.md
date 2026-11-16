# DECISIONS.md — AutoRewards Pro

All architectural, technical, environmental, and operational decisions are logged here.

---

## Environment & Tooling Decisions

| # | Decision | Reason |
|---|----------|--------|
| 1 | Use `pnpm` exclusively instead of `npm` | `npm` is corrupted on this machine (`abbrev` module missing, no admin rights to fix global node_modules). |
| 2 | Use `HashRouter` instead of `BrowserRouter` | GitHub Pages is a static host without fallback rewrite rules. Hash URLs (`/#/dashboard`) prevent 404 errors on browser page reloads. |
| 3 | Zustand + localStorage persistence | Provides an instant, stateful mock backend that persists across reloads with zero latency, eliminating cold-start API dependencies. |
| 4 | Netlify CLI cancelled | Client explicitly confirmed Netlify is not needed; deployment is handled cleanly via GitHub Pages Actions. |
| 5 | GitHub Actions Pages deployment | Built-in CI/CD that requires no external third-party tokens, supports automated testing, and handles reproducible deployments. |
| 6 | Base path dynamically driven by `VITE_BASE_PATH` | Allows seamless root `/` local development while supporting `/autorewards-pro-demo/` subpath hosting in GitHub Pages. |
| 7 | Direct `package.json` specification & `pnpm approve-builds` | `pnpm create vite` prompt was non-interactive in automated subagent mode; writing explicit `package.json` and approving esbuild build scripts ensures 100% deterministic installs. |

---

## Feature & Architecture Decisions

| # | Decision | Reason |
|---|----------|--------|
| 8 | Demo OTP hardcoded to `123456` | Provides instant passwordless sign-in for evaluators without third-party SMS billing dependencies. |
| 9 | Pre-seeded personas with 1-tap logins | Eliminates evaluation friction. Evaluators can jump straight between Dealer, Fitter, and Admin personas in 1 second. |
| 10 | Client-side QR code generation (`qrcode` + `jspdf`) | Enables offline printable batch sticker sheets and digital warranty certificates without backend rendering microservices. |
| 11 | Local base64 image storage for fitment proof | Evaluators can attach real camera photos on mobile devices without S3/Cloudinary storage buckets. |
| 12 | Simulated UPI and Voucher redemption ledger | Evaluators can observe immediate points deductions, transaction history logging, and admin approval workflows. |
| 13 | Pre-configured Indian geography (6 states, 25+ cities) | Provides realistic localized demo context (Mumbai, Bengaluru, Delhi, Chennai, etc.) without external geo APIs. |
| 14 | Spin-the-Wheel & Scratch Card gamification | Elevates partner retention and daily active usage (DAU) by adding tangible interactive incentives beyond transactional scans. |
| 15 | Strict dual-scan state machine validation | Guarantees business integrity: Step 1 (Dealer Warranty) must precede Step 2 (Fitter Installation). |

---

## Deferred Production Features (Documented in ROADMAP.md)

| # | Item | Why Deferred to Later Phases |
|---|------|------------------------------|
| S1 | Real SMS OTP via MSG91 / Twilio | Requires enterprise telecom registration and DLT entity templates in India. |
| S2 | Government GSTIN / PAN KYC API | Requires corporate access credentials and automated billing per verification request. |
| S3 | Direct RazorpayX / Cashfree UPI Disbursals | Requires live corporate bank accounts and RBI nodal account clearance. |
| S4 | Native iOS / Android Mobile Apps | React PWA achieves 95% of native capabilities with zero installation friction. Native React Native app is Phase 3. |
| S5 | Real-time WebSocket Scan Feed | Polling every 10 seconds is lightweight, robust, and completely sufficient for prototype demonstration. |

---

## Workarounds & Incident Logs

| # | Workaround | Context |
|---|-----------|---------|
| W1 | Terminated stale background Netlify install | Cleaned up residual processes from earlier session. |
| W2 | `pnpm approve-builds --all` executed | Handled pnpm v12 supply-chain safety policy for `esbuild` and `core-js`. |
| W3 | Auto-approved new partner registrations | Set `isApproved: true` by default in prototype so evaluators who register custom accounts can test login immediately. |
