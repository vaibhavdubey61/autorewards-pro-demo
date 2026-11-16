# AutoRewards Pro — Rebranding & White-Label Customization Checklist

AutoRewards Pro was engineered from day one to be 100% white-label ready. Follow this step-by-step checklist to rebrand the entire application for any client in less than 15 minutes.

---

## ⏱️ Step-by-Step Rebranding Guide (~15 Minutes)

### Step 1: Update Brand Identity Configuration (5 Minutes)
Open [`src/config/brand.ts`](file:///c:/Users/lenovo/Downloads/LP/src/config/brand.ts) and customize the brand properties:

```typescript
export const brand = {
  name: 'SpeedCraft Rewards',            // Client Brand Name
  tagline: 'Precision Parts, Premium Points', // Tagline
  shortName: 'SCR',                      // Short Abbreviation
  pointsLabel: 'SpeedPoints',            // Custom Loyalty Points Name
  currency: '₹',                         // Currency Symbol
  primaryColor: '#0052CC',               // Primary Accent (CSS var --color-primary)
  secondaryColor: '#091E42',             // Deep Background (CSS var --color-secondary)
  accentColor: '#FFAB00',                // Highlight Accent (CSS var --color-accent)
  logoEmoji: '⚡',                        // App Icon Emoji
  supportPhone: '1800-SPEED-PRO',        // Toll-free contact
  supportEmail: 'support@speedcraft.in', // Official support email
  website: 'www.speedcraft.in',          // Website URL
  gstIn: '27AABCU9603R1ZX',              // Registered GSTIN
  address: 'SpeedCraft Automotive Ltd, Bandra Kurla Complex, Mumbai',
}
```

---

### Step 2: Replace Favicon and Brand Vector (2 Minutes)
1. Replace [`public/favicon.svg`](file:///c:/Users/lenovo/Downloads/LP/public/favicon.svg) with your client's SVG logo vector.
2. The UI automatically renders the new vector across browser tabs, pinned shortcuts, and mobile bookmark bars.

---

### Step 3: Update Progressive Web App (PWA) Manifest (2 Minutes)
Open [`public/manifest.json`](file:///c:/Users/lenovo/Downloads/LP/public/manifest.json) and update the metadata:

```json
{
  "short_name": "SpeedCraft",
  "name": "SpeedCraft Rewards Pro — Partner Loyalty",
  "theme_color": "#0052CC",
  "background_color": "#091E42"
}
```

---

### Step 4: Verify Build Locally (1 Minute)
Run the build script in PowerShell to ensure TypeScript and CSS variables compile cleanly:

```powershell
$env:PATH += ";C:\Users\lenovo\AppData\Local\pnpm\bin"; pnpm run build
```

Expected result: `✓ built in ~1.2s` with zero errors.

---

### Step 5: Commit and Push (1 Minute)
Commit your rebranded assets to Git and push to the remote repository:

```powershell
git add .
git commit -m "rebrand: SpeedCraft Rewards Pro customization"
git push origin main
```

---

### Step 6: Automated GitHub Actions Redeployment (~3 Minutes)
1. Pushing to `main` automatically triggers the `.github/workflows/deploy.yml` pipeline.
2. The workflow verifies tests, compiles production bundles, and publishes to GitHub Pages.
3. Your client's fully rebranded custom portal will be live at:  
   `https://<username>.github.io/<repository-name>/`
