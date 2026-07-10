# Deploying the guest guide to GitHub Pages (free)

The folder `CCW_2026-07-10_guidebook-site` is the complete website. Nothing to build or compile.

## One-time setup (~5 minutes)

1. Log in at github.com → click **+** → **New repository**. Name it e.g. `oslo-guide`, visibility **Public**, no README. Create.
2. On the empty repo page click **uploading an existing file**, drag in ALL files from this folder (`index.html`, `app.js`, `content.json`, `sw.js`, `manifest.webmanifest`, `DEPLOY.md` optional, and the whole `assets` folder). Commit.
3. Repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` → Save.
4. After ~1 minute the guide is live at `https://<your-username>.github.io/oslo-guide/`

## Guest links (personalization)

The app reads URL parameters and remembers them on the guest's device:

```
https://<user>.github.io/oslo-guide/?name=Anna&checkin=2026-07-12&checkout=2026-07-15
```

In Hospitable message templates, build the link with short codes so each guest gets their own:
`?name=%guest_first_name%&checkin=%check_in%&checkout=%check_out%` (verify exact short-code names in Hospitable → use the short-codes picker).
A bare link with no parameters also works — it just shows the standard cover.

## Updating content later

Edit `content.json` (each topic has a `html` field) and re-upload it on GitHub (repo → open file → pencil icon → paste → commit). The site updates in ~1 minute. Or ask Claude to do it.

## Features included

Offline PWA (installable, works without internet after first visit), full-text search, area map (Leaflet/OpenStreetMap), print-entire-guide button, share button, per-guest greeting and stay dates, Touch Stay content structure (11 categories, 52 topics) with accordion sections.

## Switchover checklist

- [ ] Deploy to GitHub Pages, test on your phone (incl. Add to Home Screen)
- [ ] Update guide link in Hospitable message templates
- [ ] Print new QR code for the apartment (any QR generator pointing at the new URL)
- [ ] Run both guides in parallel for one guest cycle
- [ ] Cancel Touch Stay subscription (~$8/month saved)
