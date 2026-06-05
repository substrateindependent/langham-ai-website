# LNG-3 Implementation Plan

## Approach

Rebuild the site as a clean multi-file static HTML/CSS/JS site. The current bundled React SPA is unmaintainable for this scope of work. The new structure will be:

```
/
├── index.html          (homepage, rebuilt)
├── proof/
│   └── index.html      (/proof page)
├── assets/
│   ├── site.css        (design tokens + all styles)
│   ├── site.js         (modal, scroll animations, nav)
│   └── modal.js        (contact modal + form handler)
├── favicon.svg
├── favicon.ico
├── apple-touch-icon.png
├── Dockerfile          (updated for multi-file)
└── fly.toml            (unchanged)
```

The Dockerfile will be updated to serve the full `/usr/share/nginx/html/` directory tree, with nginx configured for SPA-style routing (try_files for clean URLs).

## Plan Pieces

### Piece 1: Project scaffold + CSS
- Create `assets/site.css` with all design tokens (colors, fonts, classes from current site)
- Create nginx config that handles `/proof` → `/proof/index.html`
- Update Dockerfile to serve full directory

Done-when: CSS file exists with all tokens; Dockerfile updated

### Piece 2: Homepage (index.html)
- Rebuild `index.html` with full Appendix A copy, in order
- All sections: Hero, Proof Bar, 01-09, Close
- All copy verbatim (em-dashes, punctuation exact)
- Nav: Home + Proof links
- Footer: unchanged legal text
- NO mailto: links, NO fieldcrestventures.com
- "SEE THE FLEET WORKING" link present but held (disabled/commented) per constraints
- Wordmark: "Langham." with terminal period in brass

Done-when: `index.html` renders all sections; `curl | grep fieldcrest` → 0; `curl | grep mailto` → 0

### Piece 3: /proof page (proof/index.html)
- Shell copy per Appendix B: overline, H1, sub-header
- Cornerstone card component (hidden until content added)
- Empty log state (no entries — awaiting Glenn approval)
- Same nav as homepage (Proof link active)
- Same footer

Done-when: `/proof` returns 200; page renders shell copy; no fake entries; nav present

### Piece 4: Contact modal + form
- `assets/modal.js` — modal open/close/focus trap
- Form fields per Appendix C (NAME, EMAIL, COMPANY, PHONE optional, WHAT'S PROMPTING THIS?)
- Honeypot field (`website`)
- Formspree submission handler
- Rate limit client-side: >5 submissions/min/IP tracked in sessionStorage
- Success state: "Got it. You'll hear from Glenn within two business days."
- ESC + overlay click close; focus trap; mobile full-width sheet
- All "START A CONVERSATION" buttons trigger modal

Done-when: Modal opens on all CTA buttons; all fields present; honeypot works; success state exact text

### Piece 5: Favicon
- `favicon.svg`: uppercase L in Instrument Serif style, brass on ink background
- `favicon.ico`: generated from SVG (32+16 embedded, using ImageMagick or Python)
- `apple-touch-icon.png`: 180×180, full-bleed ink bg
- Link all three in `<head>` of both pages

Done-when: All three favicon files exist; both pages link them

### Piece 6: Meta + wordmark final pass
- `<title>` = `Langham — Tech & AI strategy, and the team that executes it`
- Meta description exact
- OG title/description exact
- Wordmark: Instrument Serif, 1.375rem desktop/1.25rem mobile, ink text + brass period
- Apply wordmark treatment consistently (header + footer if present)

Done-when: `<title>` and meta tags verified on both pages

### Piece 7: Pre-commit verification
- `curl | grep -ci 'fieldcrestventures\|mailto'` → 0 on both pages
- Retainer ticker exact text check
- Fit labels "A GOOD FIT" / "NOT A GOOD FIT" both present
- No fake /proof log entries
- Verify Dockerfile builds

Done-when: All checks pass; build succeeds

## Formspree Setup (manual step before Piece 4)
1. Go to formspree.io → Create new form → name "Langham Contact"
2. Set submission email: glenn@fieldcrestventures.com
3. Note the form ID (e.g., `xpwzqdke`)
4. Configure subject template in Formspree: `[Langham lead] {name} — {company}`
5. The form endpoint goes in the HTML (public, not a secret)
6. No Fly secrets needed for Formspree (public endpoint)
