# 🏎️ AutoRewards Pro — Enterprise B2B Automotive Loyalty Platform

[![CI](https://github.com/YOUR_GITHUB_USERNAME/autorewards-pro-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_GITHUB_USERNAME/autorewards-pro-demo/actions)
[![Deploy to GitHub Pages](https://github.com/YOUR_GITHUB_USERNAME/autorewards-pro-demo/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_GITHUB_USERNAME/autorewards-pro-demo/actions)

> **"Drive More, Earn More"**  
> A dual-scan B2B loyalty & digital warranty engine connecting automotive accessory manufacturers, retail dealers, and professional fitters across India.

---

## 📖 Table of Contents
- [Executive Overview](#-executive-overview)
- [Dual-Scan Workflow](#-dual-scan-workflow)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [Demo Credentials](#-demo-credentials)
- [Documentation Sitemap](#-documentation-sitemap)
- [Testing & Quality Assurance](#-testing--quality-assurance)

---

## 🎯 Executive Overview

In the Indian automotive aftermarket, manufacturers lose millions to counterfeit parts, unverified installations, and untracked warranty claims. Traditional paper scratch cards leak value and fail to capture valuable end-customer and vehicle data.

**AutoRewards Pro** solves this through a closed-loop digital ecosystem:
- **Dealers** earn points when registering genuine parts and issuing tamper-proof **Digital Warranty Certificates** to car owners.
- **Fitters & Technicians** earn installation incentives upon completing professional fitments with optional photo verification.
- **Manufacturers** gain real-time visibility into regional sales velocity, product performance, and direct communication channels with grassroots mechanics.

---

## 🔄 Dual-Scan Workflow

```
[ Factory QR Sticker ]
         │
         ▼
[ Step 1: Dealer Point-of-Sale Scan ] ───▶ Generates Digital Warranty PDF
         │                                  + Credits Dealer AutoPoints
         ▼
[ Step 2: Fitter Installation Scan ]  ───▶ Captures Vehicle & Fitment Photo
                                            + Credits Installer AutoPoints
```

---

## ✨ Key Features

- **📱 Mobile-First PWA:** Clean, responsive UI with dark/light theme toggle, installable on mobile devices.
- **🛡️ Digital Warranty Generator:** Instant PDF certificates with embedded QR codes, vehicle details, and expiry tracking via `jsPDF`.
- **🎁 Flexible Rewards Catalogue:** Amazon/Flipkart shopping vouchers, instant UPI cash transfers, mobile recharges, and professional technician tools.
- **🎡 Gamification Engine:**
  - Daily **Spin-the-Wheel** mini-game (up to 500 bonus points).
  - Milestone-based **Scratch Cards**.
  - **Podium Leaderboards** with localized city/state filtering and personalized overtake targets.
  - Multi-tier progression (**Silver**, **Gold**, **Platinum**) and achievement badges.
- **🏢 Headquarters Admin Center:**
  - Bulk serialized QR code generation with printable PDF sticker sheets.
  - SKU point economics manager for adjusting margin incentives.
  - Payout approval queues and live nationwide scan activity feed.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | React 18, TypeScript (Strict Mode) |
| **Bundler & Build** | Vite 6, PostCSS, Autoprefixer |
| **Styling** | Tailwind CSS v3, Lucide React Icons |
| **State & Storage** | Zustand with localStorage persistence |
| **Animation & Charts** | Framer Motion, Recharts, Canvas-Confetti |
| **Document & QR Generation** | jsPDF, QRCode |
| **Testing** | Vitest, Testing Library, JSDOM |
| **CI/CD** | GitHub Actions, GitHub Pages |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or 20+
- `pnpm` v10+ (`npm` not recommended on this machine)

### Installation
```powershell
# Clone the repository
git clone https://github.com/YOUR_GITHUB_USERNAME/autorewards-pro-demo.git
cd autorewards-pro-demo

# Install dependencies using pnpm
pnpm install

# Start local development server
pnpm run dev
```

### Build & Test
```powershell
# Run strict TypeScript check and Vite production build
pnpm run build

# Run unit tests
pnpm test --run
```

---

## 🔑 Demo Credentials

All demo accounts use the universal demo OTP: **`123456`**

| Persona | Mobile | Default Role | Points | Tier |
|---|---|---|---|---|
| **Demo Dealer** | `9876543210` | Dealer (Shop Owner) | 3,450 pts | Gold |
| **Demo Fitter** | `9876543211` | Fitter (Technician) | 2,150 pts | Gold |
| **Super Admin** | `9999999999` | HQ Administrator | — | Platinum |

---

## 📚 Documentation Sitemap

Explore detailed documentation in the [`docs/`](file:///c:/Users/lenovo/Downloads/LP/docs) folder:
- 📄 [**Client Preview & Brief**](file:///c:/Users/lenovo/Downloads/LP/docs/CLIENT_PREVIEW.md) — 1-page executive summary for client evaluation.
- 🎬 [**5-Minute Demo Script**](file:///c:/Users/lenovo/Downloads/LP/docs/DEMO_SCRIPT.md) — Step-by-step walkthrough script for presentations.
- 🗺️ [**Product Roadmap**](file:///c:/Users/lenovo/Downloads/LP/docs/ROADMAP.md) — Phase 1 to Phase 4 enterprise transition strategy.
- 🎨 [**Rebranding Checklist**](file:///c:/Users/lenovo/Downloads/LP/docs/REBRAND_CHECKLIST.md) — How to rebrand for a new client in under 15 minutes.
- 📝 [**Decisions Log**](file:///c:/Users/lenovo/Downloads/LP/docs/DECISIONS.md) — Architectural, environmental, and design decisions.

---

## 🧪 Testing & Quality Assurance

Unit test suite covers all core business rules and state machine constraints:
- Tier calculation accuracy across all boundaries (Silver, Gold, Platinum).
- Step 1 Dealer scan validity and warranty activation.
- Step 2 Fitter scan validation and order enforcement (Dealer must scan first).
- Duplicate scan prevention.
- Role-based security validation.

Run tests:
```powershell
pnpm test --run
```

