# Personal Homepage — danilocloud.me

![JavaScript](https://img.shields.io/badge/javascript-ES6+-yellow.svg)

CV portfolio hosted as a static site on AWS S3, served via Cloudflare.

## Stack

- **Frontend** — React (Babel in-browser, no build step) + plain CSS
- **Data** — `frontend/data.json` (CV content) + open-meteo.com (live weather)
- **Hosting** — S3 static website + Cloudflare proxy (HTTPS, CDN)
- **IaC** — Terraform (`terraform/`) manages the S3 bucket and IAM deploy user
- **CI/CD** — GitHub Actions deploys on push to `main`

## Structure

```
personal_homepage/
├── frontend/
│   ├── index.html
│   ├── app.jsx       # Single-file React app
│   ├── styles.css
│   └── data.json     # All CV content lives here
└── terraform/        # S3 bucket, IAM user, budget alert
```

## Update content

Edit `frontend/data.json` and push to `main` — CI/CD syncs to S3 automatically.

## CI/CD

Any push to `main` that touches `frontend/**` triggers the workflow:

1. `aws s3 sync frontend/ s3://danilocloud.me/ --delete`
2. Sets `no-cache` headers on `index.html` and `data.json`
3. Purges the Cloudflare edge cache

Required secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `CF_DNS_API_TOKEN`.

## Infrastructure

```bash
cd terraform
terraform init -plugin-dir=<path-to-provider>
terraform plan
terraform apply
```

Provisions: S3 bucket (`danilocloud.me`), public read policy, website hosting, versioning, IAM user `homepage-deploy` with least-privilege S3 access, and a $2/month budget alert.

## Local preview

```bash
cd frontend && python -m http.server 3000
# open http://localhost:3000
```
