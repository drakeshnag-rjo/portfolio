---
name: portfolio-updater
description: >
  Maintain and update Dr. Rakeshnag Dasari's portfolio website (this repo,
  deployed to https://drrakeshnagdasari.is-a.dev via GitHub Pages). Use this
  skill whenever the user wants to refresh publications or citation metrics
  from Google Scholar, add or edit certifications, education, experience
  entries, or skills, add a new page, or restyle anything on the site — even
  if they just say "update my portfolio", "add my new paper", "sync my
  scholar profile", or "add my new cert". Always consult this skill before
  editing any HTML/CSS/JS in this repo so changes follow the site's
  conventions.
---

# Portfolio Updater

This repo is a **static site** (no build step, no framework) deployed by
GitHub Pages from the `main` branch to the custom domain in `CNAME`
(`drrakeshnagdasari.is-a.dev`). Never delete `CNAME` or `.nojekyll`.

## Architecture

| File | Role |
|---|---|
| `index.html` | Single-page main site: hero, about, expertise, skills, experience, credentials (education + certs), contact |
| `research.html` | Dedicated research page: Scholar metrics, filterable publication list, research interests |
| `data/publications.json` | **Single source of truth** for publications + citation metrics. `research.html` and the hero publication counter both render from it |
| `style.css` | Global styles and design tokens (`:root` variables) |
| `research.css` | Research-page-only styles (extends the same tokens) |
| `script.js` | Main-page JS (nav, role carousel, scroll effects, experience toggles) — it assumes hero elements exist, so do NOT include it on subpages |
| `research.js` | Research-page JS (nav + JSON rendering/filter/sort) |
| `cosmic-background.js`, `wormhole-gravity.js` | Decorative canvas backgrounds |
| `cookie-consent.js`, `gdpr-styles.css` | GDPR consent — include both on every page |

## Workflow: Sync publications from Google Scholar

The user's Scholar profile:
`https://scholar.google.com/citations?hl=en&user=bz6-A4oAAAAJ`

1. Fetch the profile with WebFetch (a plain browser fetch is CORS-blocked;
   server-side fetch works). Ask for: citation metrics (total citations,
   h-index, i10-index) and every publication (title, authors, venue, year,
   citations).
2. Update `data/publications.json`:
   - Update `scholar_profile.metrics` and set `scholar_profile.last_updated`
     to today's date (YYYY-MM-DD).
   - Merge publications: update citation counts on existing entries, append
     new ones. Each entry needs `title`, `authors`, `venue`, `year`,
     `citations` (0 if not listed), and `type` — one of `journal`,
     `conference`, `patent`, `book`. Patents have venues like
     "IN Patent App. …"; conferences say "Conference"; default to `journal`.
3. Keep the human-readable teaser in `index.html` consistent — the
   `scholar-profile-card` heading ("N Publications · X+ Citations ·
   h-index Y").
4. Verify: serve locally (`python3 -m http.server`) and check that
   `research.html` shows the right counts and the newest paper appears.
   The page must never show "—" in the metrics cards — that means the JSON
   failed to load or parse.

## Workflow: Add a certification or education entry

Certifications and education live in `index.html` under
`<section id="credentials">` as `education-card` divs inside an
`education-grid`. Follow the existing pattern:

```html
<div class="education-card">
    <div class="degree-icon"><i class="devicon-XXX-plain colored"></i></div>
    <h4>Certification Name</h4>
    <p class="university">Issuer</p>
    <p class="year">YYYY</p>
</div>
```

Use Devicon classes for vendor logos (`devicon-google-plain`,
`devicon-amazonwebservices-plain-wordmark`, `devicon-azure-plain`,
`devicon-kubernetes-plain`, `devicon-oracle-plain`) and FontAwesome
(`fas fa-…`) when no vendor icon exists. Keep entries in reverse
chronological order.

## Workflow: Add or edit an experience entry

Experience entries are `timeline-item` divs in `<section id="experience">`,
newest first. Entries with details use the `expand-btn` +
`experience-details` pattern (see the State of New Jersey entry as the
canonical example); short entries can omit it. Quantify achievements where
the user provides numbers, and end each detailed entry with a
`tech-stack` block of `skill-tag` spans.

## Design conventions

- Colors, spacing, radii, shadows come from `:root` variables in
  `style.css` ("Deep Space Voyager" palette — electric blue #3b82f6,
  cosmic violet #8b5cf6, warp cyan #06b6d4 on deep-void #050510).
  Never hardcode new colors; reuse the tokens.
- Fonts: Inter (body) + JetBrains Mono (numbers/code), loaded from Google
  Fonts in each page's `<head>`.
- Cards share the pattern: `var(--bg-card)` background, 1px
  `rgba(255,255,255,0.05)` border, `var(--radius-lg)`, hover lift +
  `rgba(99,102,241,0.3)` border.
- New pages: copy the `<head>`, navbar, footer, and cookie button from
  `research.html` (not `index.html`, whose script.js will crash on pages
  without hero elements). Add `active` class to the current page's nav link.

## Deploying

GitHub Pages serves `main` directly — a push is a deploy. Before pushing:
serve locally and click through both pages, check the browser console for
errors, and confirm with the user before pushing anything public.
