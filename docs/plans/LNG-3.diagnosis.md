# LNG-3 Diagnosis

## Current State

The site is a single minified React/Parcel SPA bundled into `index.html` (~175KB). There is no source directory in the repo — the bundled file is both the source and the artifact.

### Current Issues (per spec)
1. `fieldcrestventures.com` mailto link exists (2 occurrences confirmed)
2. Copy uses old voice/framing (tech-strategy diction for non-tech buyer)
3. "Langham AI" wordmark (needs to become "Langham.")
4. No /proof page
5. No contact modal (uses mailto: link)
6. Missing correct page title/meta
7. Fit section label bug (need to verify "A GOOD FIT" / "NOT A GOOD FIT" labels)
8. Retainer ticker has old wording

### Architecture Decision

Since there's no source in the repo, two options:
1. Reverse-engineer and edit the minified bundle (fragile, hard to maintain)
2. **Rebuild as clean multi-file static site** (recommended)

Option 2 is the right approach because:
- Multi-page (/proof) requires routing
- Modal, form handler, /proof all need clean JS
- The current bundle is unreadable/unmaintainable
- The current design tokens/CSS classes are already documented in line 1 of index.html

### Design Token Inventory (from current site)

**Colors:**
- ink: `#1a1813` / rgb(26, 24, 19)
- brass/bronze: `#8C6F46` / rgb(140, 111, 70)
- paper: rgb(251, 250, 247) = `#fbfaf7`
- cream: rgb(243, 241, 234) = `#f3f1ea`
- ink-soft: rgb(95, 90, 80) = `#5f5a50`
- ink-mute: rgb(139, 132, 120) = `#8b8478`
- ink-faint: rgb(171, 166, 154) = `#aba69a`
- bronze-deep: rgb(110, 86, 49) = `#6e5631`

**Fonts:**
- Display: Instrument Serif (Google Fonts)
- Body: Manrope
- Mono/Labels: JetBrains Mono

**Key CSS classes from existing site:**
- `.overline-label` — JetBrains Mono, uppercase, brass, 11px, tracking .16em
- `.display` — Instrument Serif, weight 400, tracking -.01em, line-height 1.02
- `.btn-primary` — ink bg, paper text, JetBrains Mono uppercase 12px, px-7/py-3.5
- `.reveal` — fade-in animation (opacity + translateY)

**Existing sections (current copy):**
1. Hero: "Keeping up is a second full-time job." (needs full rewrite)
2. Proof bar: −90%, 2 weeks, 6 weeks metrics (needs wording updates)
3. What you retain (3 cards + ticker) — needs copy update
4. Why now → "Why a retainer" — needs heading + copy update
5. Questions section — needs copy update + reorder (move up to section 02)
6. The math — needs copy update
7. The work (SPUR/OpenCollar/Thrive) — needs copy update
8. About Glenn — needs copy update → becomes section 07
9. Fit check — needs label bug fix + copy update
10. How it works — needs copy update
11. Close — remove mailto link, add modal CTA

**New sections/features:**
- Section 06: "The Fleet" (new)
- /proof page (new, with shell + empty cornerstone + log)
- Contact modal (replaces all mailto: links)
- Nav: add Proof link

**Form delivery:** Use Formspree (simple, free tier sufficient, no server needed)
- Create form at formspree.io → get form endpoint
- Credentials: just the form ID (public endpoint, no secret)
- Note: Formspree endpoint is public (form ID in HTML is acceptable) — no secrets to store
- Set custom subject and Reply-To via Formspree config

**Favicon generation strategy:**
- Create favicon.svg: uppercase L in Instrument Serif on ink background
- Use a simple SVG with embedded font or path approximation
- Generate ico and png from SVG using ImageMagick or similar

## Risk Items

1. Formspree free tier: 50 submissions/month — for a low-traffic consulting site, acceptable; no other service needed
2. Rate limiting: Formspree has built-in rate limiting; honeypot via hidden field
3. /proof page: must ship as shell with empty log (no approved entries yet); "SEE THE FLEET WORKING" link held
4. Favicon: need to generate ico/png from SVG on the build machine
