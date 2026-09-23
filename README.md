# Personal Homepage — danilocloud.me

![JavaScript](https://img.shields.io/badge/javascript-ES6+-yellow.svg)

CV portfolio served as a static site from GitHub Pages on the apex `danilocloud.me`.

## Stack

- **Frontend** — React 18 UMD + plain CSS. `app.jsx` is transpiled once by Babel CLI to `app.js`; there is no bundler.
- **Data** — `frontend/data.json` (CV content) + open-meteo.com (live weather)
- **Hosting** — GitHub Pages, custom domain `danilocloud.me`, TLS issued by GitHub. Cloudflare holds the DNS zone (records are DNS only, not proxied)
- **CI/CD** — GitHub Actions builds and publishes on push to `main`; no stored credentials

## Structure

```
personal_homepage/
├── frontend/         # everything published, minus app.jsx
│   ├── index.html
│   ├── 404.html      # served by Pages for unknown paths
│   ├── app.jsx       # Single-file React app (source, not published)
│   ├── styles.css
│   ├── data.json     # All CV content lives here
│   ├── robots.txt
│   ├── sitemap.xml
│   └── *.jpg/.png/.ico/.svg  # generated, see "Images"
├── assets/           # source photo, not published
└── scripts/          # resume.pdf and image generators, GitHub drift check
```

## Update content

Edit `frontend/data.json` and push to `main` — CI/CD publishes it automatically. Also regenerate `frontend/resume.pdf`, or the deploy fails.

## Images

`frontend/portrait.jpg`, `og-image.jpg`, `apple-touch-icon.png` and `favicon.ico` are generated from `assets/IMG_2164.jpg` and committed. Regenerate them when the source photo changes:

```bash
uv run --with pillow python scripts/generate_images.py
```

`favicon.svg` is hand-written. Nothing resizes images at deploy time.

## Search Console

The site is verified as a domain property, which needs no marker file in this repository:

1. Search Console → Add property → **Domain** → `danilocloud.me`
2. Add the `TXT` record it gives you to the Cloudflare zone, then Verify
3. Sitemaps → submit `https://danilocloud.me/sitemap.xml`

No analytics is installed, and none should be added here without a reason.

## CI/CD

Any push to `main` that touches `frontend/**` triggers the workflow:

1. Transpiles `app.jsx` → `app.js` with Babel CLI
2. Fails if `frontend/resume.pdf` is stale against `data.json`
3. Uploads `frontend/` (minus `app.jsx`) and deploys it to GitHub Pages

No secrets: the deploy authenticates with the workflow's own OIDC token.

GitHub Pages serves everything with `Cache-Control: max-age=600` and does not allow per-file headers — the `?v=N` query strings in `index.html` handle asset cache busting.

## DNS

Zone `danilocloud.me` on Cloudflare. `@` and `www` are CNAMEs to `dny1020.github.io`, **DNS only** (grey cloud) so GitHub can issue and renew the certificate. Everything else on the zone is Amazon SES mail (DKIM, SPF, DMARC) and is unrelated to hosting.

## Local preview

```bash
cd frontend && python -m http.server 3000
# open http://localhost:3000
```
