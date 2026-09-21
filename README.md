# BLACKGRID

Premium one-page website for **Blackgrid** — a digital agency that builds websites,
digital experiences, and web solutions for businesses, startups, creators, and brands.

> We build digital experiences that make businesses look bigger, better, and more credible.

Dark-first, grid-driven, zero-dependency. Built with semantic HTML, modern CSS,
and vanilla ES modules. No frameworks, no build step — deploy anywhere.

---

## Quick start

```bash
# any static server works — e.g.
python3 -m http.server 5173
# or
npx serve .
```

Open `http://localhost:5173`. You can also open `index.html` directly, though a
server is recommended so ES modules load correctly.

---

## Structure

```
index.html            All sections (hero → footer), meta, JSON-LD
css/
  tokens.css          Design tokens — color, type, spacing, motion
  base.css            Reset, typography, ambient grid + noise, reveal system
  components.css      Buttons, nav, cards, accordion, form controls
  sections.css        Per-section layouts + responsive rules
js/
  main.js             Bootstrap
  nav.js              Sticky header, mobile menu, keyboard trap
  reveal.js           Scroll reveals (text lines, blocks, media)
  hero-grid.js        Animated hero grid canvas
  magnetic.js         Magnetic CTA micro-interaction
  accordion.js        FAQ accordion (aria-expanded + inert)
  form.js             Inquiry form validation + submit
  effects.js          Parallax, process rail, active nav tracking
assets/
  favicon.svg
  og.jpg              Open Graph share image
  work/               Project imagery (placeholders — replace)
sitemap.xml
robots.txt
```

---

## Before you launch — replacing placeholders

The site never fabricates metrics, clients, awards, or reviews. Sample content is
either clearly marked in the UI or structured for one-line replacement.

| What | Where | What to do |
| --- | --- | --- |
| **Projects** | `index.html` → `<!-- PLACEHOLDER PROJECT -->` blocks, `assets/work/` | Swap copy, images, industry, services. Point `View project →` links at real case studies (currently `#contact`). Search for `data-placeholder`. |
| **Testimonials** | `index.html` → `voices` section (`PLACEHOLDER` pills visible in UI) | Replace quote + `Client Name` / `Role · Company`, delete the `pill-placeholder` spans. |
| **Form delivery** | `js/form.js` → `FORM_ENDPOINT` | Set to a Formspree/Basin/Netlify/own API URL. While empty, the form validates and shows a local success state. |
| **Email / social links** | `index.html` → commented blocks near the contact panel and footer | Uncomment and fill real URLs (Instagram, LinkedIn, GitHub, X). |
| **Domain** | `index.html` (canonical, OG, JSON-LD), `sitemap.xml`, `robots.txt` | Replace `https://blackgrid.studio` with the production URL. |

---

## Design system

- **Color** — near-black surfaces (`#0a0a0b`), off-white type, hairline borders,
  a single volt accent (`#d6ff3f`) used sparingly (labels, hover, focus).
- **Type** — Space Grotesk (display) + Inter (body), system monospace for
  technical microcopy and coordinates (`01 / SERVICES`, `BG.01`, `S.03`).
- **Grid** — persistent 72px background grid, shared-hairline card grids,
  12-column asymmetric work layout, crosshair corner marks.
- **Motion** — line-mask text reveals, media clip reveals, animated hero grid,
  magnetic CTAs, marquee, scroll-linked process rail. All disabled under
  `prefers-reduced-motion: reduce`. Hover-only content stays visible on touch.

## Technical notes

- Semantic landmarks (`header`, `main`, `section`, `footer`), single `h1`,
  sequential heading hierarchy, skip link, focus-visible styles.
- Keyboard-friendly: mobile menu focus trap + `Esc`, accordion buttons,
  `inert` on collapsed FAQ panels.
- SEO: title/meta description, Open Graph + Twitter cards, canonical,
  `ProfessionalService` JSON-LD, `sitemap.xml`, `robots.txt`.
- Performance: no dependencies, lazy-loaded images below the fold with
  width/height to prevent CLS, canvas animation paused off-screen/hidden tab,
  font preconnect + `display=swap`.
- The inquiry form includes a honeypot field; wire `FORM_ENDPOINT` before launch.

## Deploy

Static hosting — Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, or any
nginx/Apache box. Publish the repository root as the web root.

### Vercel

`vercel.json` pins the correct zero-config static behavior (no install step,
no build step, serve the repository root). The site needs **no build** — the
deployed branch must contain `index.html` at its root.

Required project settings (Dashboard → Project → Settings):

| Setting | Value |
| --- | --- |
| Framework Preset | **Other** |
| Root Directory | *(empty — the repository root, not a subfolder)* |
| Build Command | *(empty — `vercel.json` disables the build step)* |
| Output Directory | *(empty — `vercel.json` serves the project root)* |
| Install Command | *(empty — there is no `package.json`)* |
| Environment Variables | none |
| Production Branch | the branch that contains the website (see below) |

**Important:** Vercel deploys the Production Branch (usually `main`). The
branch it deploys must contain `index.html` at the root — if `main` is behind,
merge the website into `main` first or point the Production Branch at the
branch that has the site.
