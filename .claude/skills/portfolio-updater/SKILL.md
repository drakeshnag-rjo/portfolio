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
| `index.html` | Single-page main site: 3D hero, about, expertise (bento), skills, experience timeline, credentials, research teaser, contact |
| `research.html` | Dedicated research page: Scholar metrics, filterable publication list, research interests |
| `data/publications.json` | **Single source of truth** for publications + citation metrics. `research.html` and the hero counters both render from it |
| `style.css` | "Obsidian Aurora" design system: tokens in `:root` (new names + legacy aliases like `--bg-card` that older partials rely on) |
| `research.css` | Research-page-only styles (consumes the tokens) |
| `main.js` | Shared, null-guarded page behaviour (nav, reveal-on-scroll, tilt cards, typewriter role, JSON counters, experience toggles, footer year). Safe to include on EVERY page |
| `scene.js` | Three.js hero scene (ES module; Three.js comes from the jsdelivr CDN via the import map in index.html's head). Index page only |
| `research.js` | Research-page JS (JSON rendering/filter/sort only) |
| `cookie-consent.js`, `gdpr-styles.css` | GDPR consent — include both on every page (standalone, hardcoded colors) |
| `favicon.svg`, `og-image.png`, `robots.txt`, `sitemap.xml` | SEO assets — add new pages to the sitemap |

## Workflow: Sync publications from Google Scholar

Automatic: `.github/workflows/update-scholar.yml` runs
`scripts/update_scholar.py` every Monday (also triggerable from the
repo's Actions tab) and commits `data/publications.json` changes, which
redeploys the site. Manual sync (below) is only needed when the Action
is blocked by Scholar or a new paper can't wait for Monday.

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

## Design conventions ("Obsidian Aurora")

- Palette: near-black `--bg` #06070d, aurora gradient `--grad`
  (teal #2dd4bf → indigo #818cf8 → violet #a78bfa). Accents sparingly.
  Never hardcode new colors; reuse the tokens in `style.css`.
- Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono
  (labels/numbers/kickers), loaded from Google Fonts in each `<head>`.
- Recurring pieces: `.kicker` mono section labels, `.card` glass surfaces
  (blur + 1px `--border`, teal glow on hover), `.tilt` for 3D hover tilt,
  `.reveal` for scroll entrance (main.js drives both), pill nav with teal
  `.active` state, gradient text via `.grad-text`.
- Reveal-on-scroll is rect-based in main.js, NOT IntersectionObserver —
  IO reports no intersections in some embedded browsers, which would leave
  content invisible. Keep it that way.
- The Three.js scene respects `prefers-reduced-motion` (renders one static
  frame) and pauses when scrolled past. Keep those behaviours if editing.
- New pages: copy `research.html`'s shell (`<head>`, navbar, footer,
  cookie button, `main.js` include). Mark the current page's nav link
  `active`. Do NOT include `scene.js` outside index.html.

## Deploying

GitHub Pages serves `main` directly — a push is a deploy. Before pushing:
serve locally and click through both pages, check the browser console for
errors, and confirm with the user before pushing anything public.
