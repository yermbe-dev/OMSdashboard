# South Region Daily Summary

Live shared dashboard for the Ooredoo Maldives South Region distribution team. Everyone sees the same data — updates sync within ~8 seconds.

**Stack:** Static HTML + Tailwind, Cloudflare Pages Functions for the API, Cloudflare KV for storage.

## Features

- Daily summary table with staff, locations, DFSR, leads, SuperNet, Postpaid
- Per-staff performance cards (grouped by location)
- Screenshot mode for clean manager updates
- Auto-reset achievements on a new day (targets carry over)
- Optional password-protected editing
- Mobile-friendly with collapsible sidebar

## Architecture

```
GitHub repo  →  Cloudflare Pages (auto-deploy on push)
                      ├── static HTML/CSS/JS
                      ├── functions/api/data.js (read/write API)
                      └── KV namespace 'DATA' (shared storage)
```

## First-time setup

### 1. Create the GitHub repo

In GitHub: New repo → name it `south-region-dashboard` (or anything) → don't add a README (we have one).

On your computer, inside this folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/south-region-dashboard.git
git push -u origin main
```

### 2. Connect Cloudflare Pages to GitHub

1. Go to **dash.cloudflare.com → Workers & Pages → Create application → Pages → Connect to Git**
2. Authorize GitHub access, pick the `south-region-dashboard` repo
3. **Build settings:**
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: `/`
4. **Save and Deploy**

Wait ~30 seconds → you'll get a URL like `https://south-region-dashboard.pages.dev`.

### 3. Bind the KV namespace

KV namespace `south-region-daily` (ID: `b516cb658c0f4566a7819b24a66d821d`) already exists.

1. Open the deployed project → **Settings → Functions → KV namespace bindings → Add binding**
2. Variable name: `DATA`
3. KV namespace: `south-region-daily`
4. Save → **Deployments → Retry latest deployment**

After this retry, saves will hit KV and team members will see live data.

### 4. (Optional) Password-protect editing

By default, anyone with the URL can edit. To require a password:

1. Project → **Settings → Environment variables → Production → Add variable**
2. Name: `PASSWORD`, value: anything (e.g., `southregion2026`)
3. Retry deployment

Users will be prompted once per browser session when they try to save.

## Daily workflow

- Open the URL on phone/desktop
- New day? Achievements + DFSR + Lead reset to 0 automatically. Targets and staff stay the same.
- Update figures throughout the day — saves auto-sync
- Hit "📷 Screenshot" mode for clean manager view

## Updating the dashboard

Edit files locally → commit → push:

```bash
git add .
git commit -m "Tweak dashboard"
git push
```

Cloudflare auto-deploys the new version in ~30 seconds. No re-binding needed.

You can also edit files directly on github.com (pencil icon) — same auto-deploy.

## Files

- `index.html` — full dashboard (sidebar nav + Home / Dashboard / Staff / Reports / Settings views)
- `functions/api/data.js` — Pages Function (GET/POST API)
- `wrangler.toml` — KV binding declaration (reference)

## Troubleshooting

**"⚠ Offline" status** → API unreachable. Check that KV binding is added and deployment retried.

**"🔒 Auth required"** → `PASSWORD` env var is set. Enter the password when prompted.

**Numbers don't update across devices** → Wait up to 8 seconds (poll interval). If still stuck, check browser console for fetch errors.

**Want to wipe all data and start fresh** → Cloudflare dashboard → Workers & Pages → KV → `south-region-daily` → delete the `dashboard:state` key.
# OMSdashboard
# OMSdashboard
