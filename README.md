# langham.ai Website

This is the website for [Langham AI](https://langham.ai), deployed as a static site on Fly.io.

## Structure

- `index.html` — The main website (self-contained React SPA, no separate assets needed)
- `Dockerfile` — Nginx:alpine container serving `index.html` on port 8080
- `fly.toml` — Fly.io deployment configuration
- `README.md` — This file

## How to Update the Site

### Quick update (edit HTML directly)

1. Edit `index.html` with your changes
2. Commit and push to `main`
3. Deploy: `fly deploy -a langham-ai-site`

### Full workflow

```bash
# Clone the repo
git clone https://github.com/substrateindependent/langham-ai-website
cd langham-ai-website

# Make your changes to index.html

# Deploy
fly deploy -a langham-ai-site

# Verify
curl -I https://langham.ai
```

## Deployment

- **Platform:** Fly.io (app: `langham-ai-site`, org: `glenn-clayton`)
- **Region:** ord (Chicago)
- **Container:** nginx:alpine serving index.html on port 8080
- **Domain:** https://langham.ai and https://www.langham.ai
- **TLS:** Managed automatically by Fly.io

## DNS Configuration (GoDaddy)

| Type  | Name | Value                     |
|-------|------|---------------------------|
| A     | @    | (Fly.io shared IPv4)      |
| AAAA  | @    | (Fly.io IPv6)             |
| CNAME | www  | langham-ai-site.fly.dev   |

## Prerequisites

- [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/) installed and authenticated
- Access to the `glenn-clayton` Fly.io org
