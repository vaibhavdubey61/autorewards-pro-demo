# AutoRewards Pro — Client Preview & Executive Brief

**AutoRewards Pro** — *Drive More, Earn More*  
**Live URL:** [https://YOUR_GITHUB_USERNAME.github.io/autorewards-pro-demo/](https://YOUR_GITHUB_USERNAME.github.io/autorewards-pro-demo/)  
**Technology:** React 18, TypeScript, Tailwind CSS, Zustand, Vite, Progressive Web App (PWA)

---

## 🏎️ Executive Summary

AutoRewards Pro is an enterprise B2B loyalty & warranty verification platform designed specifically for automotive aftermarket manufacturers, dealer distributors, and professional installers/fitters.

Traditional coupon and scratch programs suffer from massive leakages, unverified installations, lack of customer warranty capture, and slow manual redemption. AutoRewards Pro solves this with an encrypted **dual-scan lifecycle**:
1. **Dealer Scan:** The retail accessory shop scans the QR code at point-of-sale, registering vehicle/customer details and activating an official Digital Warranty Card.
2. **Fitter Scan:** The installer technician completes the fitment, uploads optional photographic proof, and claims instant installation points.

---

## 🔑 Pre-Seeded Demo Credentials

Demo accounts are pre-configured with active balances, scan histories, and badges.  
*All accounts use Demo OTP:* **`123456`**

| Persona | Mobile Number | Role & Capabilities |
|---------|---------------|----------------------|
| **Demo Dealer** | `9876543210` | Arun Sharma (*Sharma Auto World*, Mumbai) — 3,450 pts, Gold Tier, issues warranties |
| **Demo Fitter** | `9876543211` | Raju Mistry (*Raju Speed Fitment Hub*, Mumbai) — 2,150 pts, Gold Tier, logs installations |
| **Super Admin** | `9999999999` | Program Administrator — Batch QR Generation, Payout Approvals, Real-time KPIs |

> **Pro Tip:** You can also use the one-tap login shortcuts directly on the `/login` or `/demo` page.

---

## ⚡ Key Business Features

1. **Dual-Stage QR Verification Workflow**
   - Strictly enforces workflow order: Step 1 (Dealer Warranty Registration) must precede Step 2 (Fitter Installation).
   - Prevents duplicate claims, fraudulent scans, or unauthorized out-of-order scans.
2. **Instant Digital Warranty Certificate**
   - Automatically generates a branded PDF certificate with QR code, customer name, vehicle registration number, and expiry date.
3. **Multi-Category Rewards Catalogue**
   - Instant Amazon & Flipkart e-gift vouchers
   - Instant direct UPI transfers
   - Mobile recharges (Jio / Airtel / Vi)
   - Professional automotive technician toolsets (Bosch, Stanley)
4. **Gamification & Engagement Drivers**
   - Daily **Spin-the-Wheel** mini-game (up to 500 bonus points)
   - Surprise **Lucky Scratch Cards** unlocked with scan milestones
   - **Performance Leaderboards** with podium rankings, daily streak counters, and tier badges (Silver, Gold, Platinum)
5. **Central Admin Headquarters**
   - High-volume serialized QR batch generator with printable sticker sheet PDF export.
   - Dynamic SKU point configuration to boost slow-moving products.
   - Live nationwide scan event feed and instant redemption payout approval queue.

---

## 🧪 3-Minute Dual-Scan Testing Guide

1. Log in with **Demo Dealer** (`9876543210`, OTP `123456`).
2. Navigate to **Scan QR**, tap **"Simulate Valid Step 1 QR Scan"**, fill in the customer vehicle details, and submit.
   - *Result:* AutoPoints credited with confetti celebration and instant downloadable Digital Warranty PDF.
3. Log out and sign in with **Demo Fitter** (`9876543211`, OTP `123456`).
4. Tap **Scan QR** and scan the same QR code to register the fitment.
   - *Result:* Fitter AutoPoints credited to Raju's wallet.
5. Go to **Wallet**, tap **Redeem Points**, and request a reward to test the administrative queue.

---

## ⚠️ Prototype Scope & Known Limitations

- **Mock Backend:** Local persistence via Zustand `localStorage` ensures zero-latency offline testing. A production backend (Node.js/PostgreSQL) is documented in `docs/ROADMAP.md`.
- **Demo OTP:** OTP verification is fixed to `123456`. SMS gateways (MSG91/Twilio) integrate in Phase 1.
- **Simulated UPI:** Instant UPI payouts are simulated within the prototype. Real RazorpayX/Cashfree payouts integrate in Phase 2.
- **Camera Fallback:** On devices without camera access or permissions, the 1-tap simulation button instantly exercises the scan state machine.

