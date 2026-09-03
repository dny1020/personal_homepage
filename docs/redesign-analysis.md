# Frontend redesign — analysis and proposal

Status: **proposal only.** No production code has been changed. Reference studied:
`https://secfi.com/?ref=landingfolio` (measured 2026-09-02, desktop 879px CSS viewport).

The reference is used for design *principles* only. No Secfi copy, imagery, layout, brand,
or licensed typeface is reproduced. Content and identity stay Danilo's.

---

## 1. Current frontend

### Architecture (confirmed, unchanged by this proposal)

| Fact | Value |
|---|---|
| Framework | React 18 UMD from unpkg, no bundler |
| Source | `frontend/app.jsx`, single file, 610 lines |
| Build | Babel CLI, one transpile to `frontend/app.js` (gitignored) |
| Styles | `frontend/styles.css`, plain CSS, 1056 lines, no preprocessor |
| Routes | one, `/` → `App` |
| Content | `frontend/data.json`, fetched at runtime, `fallbackData` on failure |
| Runtime deps | React UMD, Google Fonts (Archivo, JetBrains Mono), open-meteo, Credly images |
| Assets | `IMG_2164.jpg` (638 KB portrait), `resume.pdf` (generated), inline SVG icons |
| Hosting | S3 + Cloudflare, deployed by GitHub Actions on push to `main` |

There is no router, no state library, no CSS framework, and no npm project. This shape is
binding per `PRODUCT.md` and the redesign fits inside it.

### Components that exist today

| Component | Lines | Role |
|---|---|---|
| `Icon` | ~15 | Six inline SVG paths |
| `LocalReading` | ~18 | Bogotá clock + open-meteo temperature, rendered in the footer |
| `Strip` | ~12 | Sticky section header ("designation strip") |
| `CrossConnect` | ~180 | The experience section: two columns joined by animated SVG jumper wires |
| `App` | ~330 | Everything else, inline |

Plus two module-level helpers: `crossConnect()` (string-matches skills against role
descriptions) and the constant tables `PAIRS`, `EQUIPMENT_GROUPS`, `BLOCKS`, `WEATHER_LABELS`.

### Current design system

The whole page is built on one metaphor: a telephone-exchange **main distribution frame**.
Recorded in `DESIGN.md` and `.impeccable/design.json`.

- **Colour** — warm olive-beige enamel `#d4cec0`, panels `#ded9cd`, troughs `#c4beaf`,
  ink `#191b17`. Chromatic accent comes only from the 25-pair jumper code
  (blue `#1b4fa0`, orange, green, brown, slate) and appears only on the SVG wires.
- **Type** — Archivo for headings and body, JetBrains Mono for nearly everything else:
  labels, org names, periods, tags, links, buttons, footer.
- **Radius** — `0` everywhere. `--rounded.square: "0"`. Every surface is a hard rectangle.
- **Borders** — 1px `#5e6259` hairlines and 2px `#454941` structural members, on every element.
- **Shadow** — none. No elevation model at all.
- **Spacing** — 3 / 8 / 12 / 16 / 20 / 24 / 34 px. Section body padding is 24px top, 34px bottom.
- **Navigation** — fixed 56px left rail showing five numbers: `00 01 02 03 04`.
- **Motion** — strips slide in on load (staggered 60ms); jumper wires draw with a
  `stroke-dashoffset` run. `prefers-reduced-motion` is honoured.

### What works and should survive

1. **The data pipeline.** One JSON file drives the page and the generated PDF. Untouchable.
2. **Honesty of content.** No invented metrics, no dead demo links, real dated roles.
3. **The live Bogotá reading.** Time plus weather, computed client-side, no auth, no key.
   It is the only thing on the page that proves it is alive.
4. **Density where it belongs.** Skills, tags, and periods genuinely benefit from monospace
   and tabular figures. The mono is right — its *scope* is wrong.
5. **Motion discipline.** Short durations, staggered entry, reduced-motion respected.
6. **Accessibility basics.** `aria-current` on nav, `aria-pressed` on the trace control,
   visible focus rings, an `IntersectionObserver` scroll-spy.
7. **Contrast passes.** Measured: ink on enamel 11.06:1, muted 5.51:1, faintest 4.62:1.
   All clear AA for normal text.

### What is not working visually

1. **The ground colour reads as dirt, not as paper.** `#d4cec0` is a desaturated olive.
   It drags every surface on top of it toward grey-green and removes any sense of light.
2. **Zero radius plus borders on everything produces a form, not a product.** Every element
   is a boxed cell. There is no figure/ground separation, so nothing can be primary.
3. **No elevation model.** Without shadow or a lighter card surface, hierarchy has to be
   carried entirely by border weight, and 1px vs 2px is not enough signal.
4. **Monospace is doing the body-text job.** Roughly 60% of visible strings are JetBrains
   Mono at 0.62–0.74rem — that is 10–12px. Legible, but it reads as a log dump and it caps
   the page's perceived quality far below the content's actual quality.
5. **Uppercase + wide tracking is applied indiscriminately.** `letter-spacing: 0.16em` on
   labels, `0.1em` on designations, `0.12em` on legends. At small sizes this destroys word
   shape and slows reading.
6. **The metaphor's vocabulary blocks comprehension.** A visitor sees "Cross-connect",
   "In service", "Termination", "Frame data", "Record copy", "Terminals", "5 pairs
   cross-connected". None of these say *experience*, *projects*, *contact*, *CV*, *skills*.
   The page asks to be decoded before it can be read.
7. **The navigation is five bare numbers.** `00`–`04` with only a `title` tooltip. Nothing
   tells a visitor what any section holds.
8. **The signature interaction dies on mobile.** Below 900px `.jumpers { display: none }`,
   the legend is hidden, and the two columns stack. The most expensive component on the
   page — ~180 lines of React plus `ResizeObserver`, `requestAnimationFrame`, and
   `getBoundingClientRect` measurement — renders nothing on phones.
9. **The cross-connect is derived from substring matching.** `crossConnect()` lowercases a
   role's title and description and tests `haystack.includes(skill)`. "Help Desk Specialist"
   gets "line side only"; a role that happens to mention Python gets a wire. The visual
   claim is precise; the data behind it is not.
10. **Micro-type is below comfortable minimums.** `0.62rem` ≈ 9.9px on `.upright-mark`,
    `.plate-caption`, `.pair-legend-title`, `.state`.
11. **The portrait is treated as evidence-of-file, not as a person.** 196px wide,
    `grayscale(0.35)`, captioned "ID PLATE". The one warm human asset on the page is
    deliberately chilled.
12. **The hero states a name and nothing else.** There is no sentence that says what Danilo
    does or why a stranger should keep reading, above the fold.
13. **The contact section repeats the navigation.** "Block elevation" re-lists all five
    sections with counts, immediately above the footer.

### Preserve / redesign, at a glance

| Preserve | Redesign |
|---|---|
| Buildless React UMD + Babel pipeline | Every visual token: colour, radius, shadow, spacing |
| `data.json` as the single content source | Section naming and information architecture |
| `fallbackData` guard and fetch error paths | Navigation model (left number rail → top bar) |
| Weather + time widget logic and `WIDGET_CONFIG` | Typographic roles (retire mono-as-body) |
| `IntersectionObserver` scroll-spy pattern | Experience presentation (retire jumper SVG) |
| Reduced-motion handling and focus rings | Card, button, and tag components |
| Inline SVG icons (extend, don't replace) | Portrait treatment |
| All `data.json` fields, unchanged | Section headers and eyebrow labels |

---

## 2. Reference analysis — what makes Secfi effective

Measured values, taken from the live page.

### Typography

| Role | Family | Size / line-height | Weight | Tracking |
|---|---|---|---|---|
| Hero headline | Reckless (serif) | 44 / 48px | 300 | −0.04em |
| Section headline | Reckless (serif) | 44 / 48px | 300 | −0.04em |
| Card title | Matter (sans) | 32 / 42px | 400 | −0.04em |
| Sub-heading | Matter (sans) | 20 / 30px | 400 | −0.03em |
| Body | Matter (sans) | 16–18px / ~1.6 | 400 | normal |

Three rules do most of the work:

1. **Two families, split by altitude.** A light serif is reserved for the single largest
   headline in a section. Everything below it — card titles, sub-heads, body, UI — is one
   sans. No monospace anywhere.
2. **Negative tracking that scales with size.** −0.04em at display sizes, −0.03em at 20px,
   normal at body. Large type is tightened; small type is never spread out.
3. **One emphasised phrase per headline, set in serif italic and a lighter colour.**
   "Things are just different when *you have equity*". "You need solutions built for *your*
   unique needs". It gives a headline a voice without a second colour or a highlight box.

### Colour

| Token | Value | Use |
|---|---|---|
| Ink | `#292A2D` | All text, and the fill of primary buttons |
| Canvas | `#FBFBF9` | Default section background |
| Tint | `#ECE9E4` | Alternate section background |
| Card | `#FFFFFF` | Raised surfaces on the tint |

Four neutrals. No brand accent colour anywhere on the homepage. All colour enters through
photography. Hierarchy is built from *surface*, not from hue.

### Spacing, grid, containers

- Section vertical padding: **160px**, symmetric, on every section including the last.
- Container max-widths in use: **1280px** (page), **1240px** (wide media), **900px**
  (two-column split), **740px** (prose), **440 / 392 / 370px** (cards).
- Card padding: **32px**.
- Breakpoints: **768 / 1120 / 1280 / 1441**.

The single most transferable number is the 160px section padding. It is what makes the page
feel expensive: each section is given far more room than its content strictly needs.

### Borders, radius, shadow

- Cards: `border-radius: 20px`.
- Buttons: `border-radius: 300px` — full pill.
- Small chips/badges: `border-radius: 12px`.
- Borders are almost absent. Separation comes from surface colour and radius.
- Shadow is deliberately near-invisible and layered:
  `rgba(41,42,45,0.02) 0 17px 37px`, stacked with tighter, slightly darker layers.
  It never looks like a drop shadow; it looks like the card is resting on the page.

### Buttons

One shape, three weights:

- **Primary** — ink fill `#292A2D`, white label, pill, label + a chevron in a circular
  white-on-transparent well at the right.
- **Secondary** — same pill, transparent fill, hairline border.
- **Icon-only** — a 40px circle carrying just the chevron, used as the affordance on list
  rows and cards.

The circled chevron is the site's one recurring signature. It appears on the hero CTA, on
every card, and on every row of the FAQ and article lists.

### Cards

Three card types, all sharing radius 20 / padding 32 / the same shadow:

1. **Feature card** — small sans eyebrow, large sans title, body paragraph, primary button.
2. **List card** — a stack of rows, each `title + circled chevron`, separated by hairlines.
3. **Media card** — an image filling the card at the same radius, no padding.

Images are always clipped to the card radius and always fill their box. There is no
floating, unframed image on the page.

### Navigation

Top bar, not sticky-shrinking: logo left, five text links, then `Login` (secondary pill)
and `Get started` (primary pill) hard right. A dismissible announcement strip sits above it.
The only decoration is a `NEW` badge on one nav item.

### Hero composition

Split: text at left in a ~50% column, image bleeding to the right edge and to the top.
Headline → 3-line supporting paragraph (max ~40 characters per line) → single primary
button. One CTA, not two. Below the fold edge, a small "Trusted by employees of some of the
best companies" line introduces a logo strip.

### Section composition

Every section is the same three-part unit:

```
centred serif headline (one emphasised phrase in italic)
   ↓  ~64px
content: 2-col split | 3-col card grid | carousel | list + media
   ↓
160px of air, then a background flip
```

Section identity is carried by **background alternation** (`#FBFBF9` ↔ `#ECE9E4`), not by
rules, borders, or numbered labels.

### Interaction and animation

Measured transition signatures:

- `opacity 0.3s cubic-bezier(0.16, 1.08, 0.38, 0.98)`
- `all 0.6s cubic-bezier(0.16, 1.08, 0.38, 0.98)`
- `transform 0.5s cubic-bezier(0.26, 1.04, 0.54, 1)`
- `background-color 0.2s cubic-bezier(0.77, 0, 0.175, 1)`

Two curves carry everything: a gentle overshoot (`0.16, 1.08, 0.38, 0.98`) for entrances,
and a hard ease-in-out (`0.77, 0, 0.175, 1`) for state changes. Entrances are 0.3–0.6s;
hovers are 0.2s. Nothing bounces, nothing spins, nothing is parallaxed.

### Responsive behaviour

Below 768px the grids collapse to one column, the card carousel becomes swipeable with dash
pagination, the nav collapses to a burger, and section padding drops. Card radius, button
shape, and type tracking are unchanged — the *system* does not simplify, only the layout does.

### Why it works — the four transferable principles

1. **Air is the luxury signal.** 160px between sections, 32px inside cards, ~40ch line length.
2. **Hierarchy from surface, not from lines.** Two background tints, one white card, one soft
   shadow, one radius. No borders needed.
3. **Exactly one voice per altitude.** Serif for the section headline. Sans for everything
   else. One accent gesture (the italic phrase). One recurring affordance (the circled chevron).
4. **Restraint is the aesthetic.** Four colours, one radius family, two easing curves,
   one button shape.

---

## 3. Design translation

How each principle maps onto this portfolio, and where it must be bent so the result is
Danilo's site rather than a Secfi skin.

| Secfi principle | Translation here | Deliberately different |
|---|---|---|
| 160px section rhythm | Adopt directly at ≥1280px | Scaled to 112 / 80 / 64 below |
| Two families, split by altitude | Serif display + sans body | **Third family retained**: mono, scoped strictly to numbers, dates, tags, and the live reading |
| No accent colour, colour from photography | Warm neutral ground, ink type | **One accent kept** — jumper blue `#1B4FA0` — because this site has almost no photography to carry colour |
| Italic-phrase emphasis in headlines | Adopt | Phrases are technical, not aspirational |
| Circled chevron as the signature | Adopt, as the outbound affordance | Points up-right (`↗`) on external links, right on internal ones — a repo link should look like leaving |
| Card radius 20px | Adopt at 16px | Slightly tighter reads as engineering rather than consumer finance |
| Pill buttons | Adopt | — |
| Background alternation for section identity | Adopt | Replaces the numbered designation strips entirely |
| Large photography per section | Not available | Substituted with a homelab diagram and typographic panels |

### What carries the identity once the frame metaphor is retired

The distribution-frame concept is the *previous* design's idea, not Danilo's identity. Its
expression — olive enamel, zero radius, borders everywhere, "Termination" as a section name —
is the direct cause of the visual result being rejected. Recommendation: **retire the
metaphor as a visual system**, keep four things that were genuinely his:

1. **Jumper blue `#1B4FA0`** promoted from one wire colour to the site's single accent.
2. **Ink `#1A1B18`**, the near-black with a green cast, kept as the text colour. It is
   warmer and less generic than a neutral `#111`.
3. **JetBrains Mono**, scoped to data: periods, counts, tags, the Bogotá reading.
4. **The content itself** — the VoIP depth, the homelab, the repos. That was always the
   identity; the beige was never carrying it.

This is a recommendation, not a fact. If the frame metaphor is worth keeping as a concept,
the alternative is to keep the *vocabulary* in a single place (an "About this page" note in
the footer) and let the interface itself speak plainly. Say which you prefer before
implementation starts.

---

## 4. Proposed design system

All tokens are plain CSS custom properties on `:root` in `styles.css`. No Tailwind, no
build step, no new dependency.

### Typography

Two new families from Google Fonts, replacing Archivo; JetBrains Mono stays.

| Token | Family | Rationale |
|---|---|---|
| `--font-display` | **Instrument Serif**, 400 + italic | Closest free analogue to Reckless: high-contrast, contemporary, a true italic. Display sizes only. |
| `--font-sans` | **Inter Tight**, 400/500/600 | Tight default tracking matches Matter's compactness; excellent at 14–18px. |
| `--font-mono` | **JetBrains Mono**, 400/500 | Unchanged. Numbers, dates, tags, the live reading. Never body copy. |

Font payload is comparable to today's (two families, one variable): keep `preconnect`,
keep `display=swap`, and request only the weights listed.

Scale, fluid via `clamp()`:

| Token | Size | Line-height | Tracking | Family |
|---|---|---|---|---|
| `--t-display` | `clamp(2.75rem, 6vw, 4.5rem)` | 1.04 | −0.03em | display |
| `--t-h2` | `clamp(2rem, 4vw, 3rem)` | 1.1 | −0.025em | display |
| `--t-h3` | `clamp(1.375rem, 2vw, 1.75rem)` | 1.25 | −0.02em | sans 500 |
| `--t-h4` | `1.125rem` | 1.35 | −0.01em | sans 600 |
| `--t-lead` | `1.125rem` | 1.65 | normal | sans 400 |
| `--t-body` | `1rem` | 1.6 | normal | sans 400 |
| `--t-small` | `0.875rem` | 1.5 | normal | sans 400 |
| `--t-eyebrow` | `0.8125rem` | 1.4 | 0.02em | sans 500 |
| `--t-mono` | `0.8125rem` | 1.4 | 0 | mono 500, `tabular-nums` |

Rules:

- Nothing renders below **13px**. The current 0.62rem (≈10px) labels are gone.
- Uppercase is used only on the eyebrow, and at `0.02em`, not `0.16em`.
- Prose columns cap at **68ch**; lead paragraphs at **46ch**.
- One serif-italic emphasis phrase per section headline, in `--ink-muted`.

### Colour

| Token | Value | Contrast on canvas | Use |
|---|---|---|---|
| `--canvas` | `#FAF9F6` | — | Default section background |
| `--tint` | `#F0EDE6` | — | Alternate section background |
| `--card` | `#FFFFFF` | — | Raised surfaces |
| `--ink` | `#1A1B18` | **16.43:1** | Headings, body, primary button fill |
| `--ink-muted` | `#5A5D55` | **6.37:1** | Secondary text, italic emphasis |
| `--accent` | `#1B4FA0` | **7.46:1** | Links, active nav, focus ring |
| `--hairline` | `#E2DED4` | 1.28:1 (decorative only) | Dividers inside cards |
| `--border-control` | `#8A8D83` | **3.21:1** | Borders of interactive controls |
| `--ink-inverse` | `#FAF9F6` | 16.43:1 on ink | Text on dark surfaces |

Every text pair clears WCAG AA. `--hairline` is decorative and must never be the only
boundary of a control — that is what `--border-control` is for, at the required 3:1.

The five 25-pair colours (`--pair-orange`, `-green`, `-brown`, `-slate`) are **removed**.
Only blue survives, as `--accent`.

### Spacing

4px base. `--s-1: 4px` … `--s-3: 12` `--s-4: 16` `--s-6: 24` `--s-8: 32` `--s-12: 48`
`--s-16: 64` `--s-24: 96` `--s-28: 112` `--s-40: 160`.

| Context | Value |
|---|---|
| Section padding ≥1280px | `160px` |
| Section padding 1024–1279 | `112px` |
| Section padding 768–1023 | `80px` |
| Section padding <768 | `64px` |
| Headline → content | `64px` (`48px` under 768) |
| Card padding | `32px` (`24px` under 768) |
| Grid gutter | `24px` |

### Layout and grid

- Page container `max-width: 1200px`, side gutter `24px` (`16px` under 640).
- Wide media container `1320px`.
- Prose container `680px`.
- 12-column grid at ≥1024, 6 at 768–1023, 1 below.
- Section identity by background alternation `--canvas` ↔ `--tint`. No rules, no numbers.

### Borders, radius, shadow

| Token | Value |
|---|---|
| `--r-sm` | `8px` (tags, small chips) |
| `--r-md` | `12px` (inputs, inner panels) |
| `--r-lg` | `16px` (cards, media) |
| `--r-xl` | `24px` (hero media, CTA band) |
| `--r-pill` | `999px` (buttons, status dot wells) |
| `--shadow-rest` | `0 1px 2px rgba(26,27,24,.03), 0 12px 28px rgba(26,27,24,.03)` |
| `--shadow-lift` | `0 2px 4px rgba(26,27,24,.04), 0 20px 44px rgba(26,27,24,.06)` |

Borders drop from "on everything" to: interactive control outlines, and hairline dividers
*inside* list cards. Cards are separated from the page by surface and shadow.

### Buttons

One pill shape, `height: 48px`, `padding: 0 8px 0 24px`, `--r-pill`.

| Variant | Fill | Label | Border |
|---|---|---|---|
| Primary | `--ink` | `--ink-inverse` | none |
| Secondary | transparent | `--ink` | `1px --border-control` |
| Ghost | transparent | `--ink-muted` | none, underline on hover |
| Icon | transparent | `--ink` | `1px --hairline`, 40px circle |

Primary and secondary carry a **28px circular chevron well** at the right edge —
the recurring affordance. On hover the chevron translates `2px` and the fill shifts one
step, `0.2s cubic-bezier(0.77, 0, 0.175, 1)`.

External links use `↗`; internal anchors use `→`.

### Cards

Shared: `--r-lg`, `--shadow-rest`, `background: --card`, `padding: 32px`.
Hover: `--shadow-lift` plus `translateY(-2px)`, `0.3s`.

1. **Capability card** — eyebrow, `--t-h3` title, body, tag row.
2. **Project card** — mono index, title, body, tag row, footer link with `↗`.
3. **Featured project card** — spans two columns, larger title, same anatomy.
4. **List card** — hairline-separated rows, each `label + value` or `title + chevron`.
   Used for experience, credentials, and contact.
5. **Media card** — image filling the card at `--r-lg`, no padding. Used for the portrait.

### Navigation

Sticky top bar, `72px` tall, `--canvas` at 88% with `backdrop-filter: blur(12px)`.
After `40px` of scroll a `1px --hairline` bottom border fades in — the only scroll effect.

- Left: `Danilo Narvaez` in sans 600, plus a small mono `danilocloud.me`.
- Centre: `Work · Experience · Homelab · Credentials`, anchor links, `--accent` +
  `aria-current` on the active one, driven by the existing `IntersectionObserver`.
- Right: `Download CV` as the primary pill.
- Under 900px: mark + primary pill only; the links move to a horizontally scrollable row
  pinned beneath the bar. No burger menu, no JS drawer — five links do not earn one.

### Animations

Two curves only, matching the reference's discipline:

- `--ease-entrance: cubic-bezier(0.16, 1.08, 0.38, 0.98)`
- `--ease-state: cubic-bezier(0.77, 0, 0.175, 1)`

| Event | Effect | Duration |
|---|---|---|
| Section enters viewport | `opacity 0→1`, `translateY(16px→0)` | `0.6s` entrance |
| Children within a section | same, staggered `60ms`, capped at 6 | `0.6s` entrance |
| Hero on load | headline lines reveal, staggered `80ms` | `0.7s` entrance |
| Button / link hover | fill shift, chevron `translateX(2px)` | `0.2s` state |
| Card hover | shadow rest→lift, `translateY(-2px)` | `0.3s` state |
| Nav border on scroll | `opacity 0→1` | `0.2s` state |

Everything is CSS transitions and transforms driven by an `IntersectionObserver` toggling
one class. No animation library. Under `prefers-reduced-motion: reduce`, reveals resolve
immediately to their final state and hover transforms are disabled — extending the existing
block in `styles.css`.

---

## 5. Proposed information architecture

Content is unchanged. Every field of `data.json` still has a home, and nothing new is
invented. What changes is order, naming, and emphasis.

### Today

| # | Label | Contains |
|---|---|---|
| 00 | Frame | name, role, stats, bio, actions, "Frame data" counts, achievement, portrait |
| 01 | Cross-connect | experience ↔ skills, wired |
| 02 | In service | projects |
| 03 | Qualification | education + certifications + badges |
| 04 | Termination | contact, languages, "Block elevation" section index |

### Proposed

| # | Section | Source fields | Why |
|---|---|---|---|
| 1 | **Hero** | `name`, `role`, `bio`, `location`, `resumeUrl`, `contact.github`, `avatarUrl` | Add one sentence, above the fold, that says what he does. Portrait becomes a media card. |
| 2 | **Signals** | `stats` + live Bogotá reading | The three counts as a quiet row, the clock/weather promoted out of the footer. Replaces "Frame data". |
| 3 | **What I work on** | `skills` (6 groups → 3 cards) | New presentation, existing data. Turns 40 loose chips into three legible capabilities: AI & Automation, Telephony & Real-time, Infrastructure & DevOps. |
| 4 | **Selected work** | `projects` | **Promoted above experience.** `PRODUCT.md` says peers judge by repos and the read path is outward. `doction` runs as the featured card. |
| 5 | **Experience** | `experience` | Plain reverse-chronological list card. Current role marked; the rest quiet. |
| 6 | **The homelab** | `achievements` | Its own section. Cannot be linked (both subdomains are NXDOMAIN), so it is *shown*: a small SVG diagram of the Pi, nginx, the containers, the WireGuard boundary. |
| 7 | **Credentials** | `education`, `certifications`, `badges`, `languages` | One grid. Languages fold in here rather than sitting beside contact. |
| 8 | **Contact** | `contact` | Dark CTA band, `--ink` ground, `--r-xl`. The one inverted surface on the page. |
| 9 | **Footer** | `footer` | Copyright and the repo link. Nothing else. |

### Changes worth calling out

- **Projects move above experience.** The current order is CV order; the proposed order is
  audience order.
- **Skills gain structure.** They are currently a flat chip field on the equipment side of
  the cross-connect. Three capability cards give a stranger a shape to hold.
- **The homelab gets a section.** It is described as the strongest available evidence and
  currently appears as a 34-character-wide grey paragraph in a corner of the hero.
- **The live reading moves up.** It is the page's proof of life and it is presently in the
  footer at 11px.
- **"Block elevation" is deleted.** It duplicates the navigation.
- **Section names become plain English.** Work, Experience, Homelab, Credentials, Contact.
- **Section numbering is dropped.** Background alternation carries section identity.

### Two open questions

1. **Frame metaphor** — retire it entirely (recommended), or keep it as a footer note?
2. **Portrait treatment** — keep the 35% desaturation, or run it at full colour? Full
   colour is warmer and matches the reference's photographic approach; desaturation is more
   consistent with the near-monochrome palette. Recommendation: full colour, since the
   photo is the only image on the page.

---

## 6. Component strategy

`app.jsx` stays a single file. Estimated size after the change: roughly 620–680 lines,
against 610 today — the ~180-line `CrossConnect` is removed and its budget is spent on
smaller, plainer components.

### Preserved unchanged

| Item | Note |
|---|---|
| `data.json` fetch + `fallbackData` merge | Including the error path |
| `WIDGET_CONFIG`, `WEATHER_LABELS`, weather fetch | Logic is correct; only presentation changes |
| `IntersectionObserver` scroll-spy | Retargeted at the new section ids |
| `ReactDOM.createRoot` mount | — |
| Reduced-motion and focus-visible handling | Extended to the new components |

### Modified

| Component | Change |
|---|---|
| `Icon` | Add `chevron`, `arrowUpRight`, `check`, `github`, `linkedin`. Switch `stroke-linecap` from `square` to `round`. |
| `LocalReading` | Same data, new placement (Signals row) and styling. Add a pulsing `--accent` status dot. |
| `App` | Same data wiring; body recomposed into the nine sections above. |
| `BLOCKS` constant | Becomes `SECTIONS`, with plain-English labels and no designation numbers. |

### Replaced

| Old | New | Reason |
|---|---|---|
| `Strip` (sticky designation strip) | `SectionHeader` — eyebrow, serif headline with italic phrase, optional lede | Sticky micro-strips fight the 160px rhythm |
| `.upright` left number rail | `TopNav` | Five numbers are not navigation |
| `CrossConnect` | `ExperienceList` + `CapabilityCards` | Signature interaction is invisible on mobile and its wiring is substring-derived |
| `.terminal` chips | `Tag` | Radius, size, and contrast |
| `.qual-grid` / `.badge-row` | `CredentialGrid` | Unify education, certs, and badges |
| `.plate` (ID PLATE figure) | `MediaCard` | Treat the portrait as a photograph |

### Removed

| Item | Lines saved (approx.) | Reason |
|---|---|---|
| `PAIRS` + jumper SVG path maths + `ResizeObserver` + `rAF` redraw | ~120 | Renders nothing below 900px |
| `crossConnect()` substring matcher | ~15 | Precise-looking output from imprecise input |
| `.pair-legend` block | ~10 JSX, ~40 CSS | Keys a device that no longer exists |
| `.eq-note` | ~8 | Mobile fallback for a removed component |
| "Block elevation" index | ~12 | Duplicates the navigation |
| `.frame-data` definition list | ~20 | Folds into the Signals row |
| `--pair-orange/green/brown/slate` | 4 tokens | Only blue is kept |

### Created

| Component | Notes |
|---|---|
| `TopNav` | Sticky bar, scroll-spy `aria-current`, mobile link row |
| `Hero` | Split layout, headline with italic phrase, one primary + one secondary action |
| `SignalRow` | `stats` + `LocalReading` |
| `CapabilityCard` | Three, derived from the six `skills` groups |
| `ProjectCard` / `FeaturedProject` | Card 2 and 3 above |
| `ExperienceRow` | Row inside a list card; current role flagged |
| `HomelabPanel` | Inline SVG diagram, no dependency, no external asset |
| `CredentialGrid` | Education + certifications + badges + languages |
| `CTABand` | Inverted dark panel, `--r-xl` |
| `Button` | `variant`, `href`, `external` props; owns the chevron well |
| `Tag` | Replaces `.terminal` |
| `Reveal` | Wrapper that toggles the entrance class via `IntersectionObserver` |

### CSS strategy

`styles.css` is rewritten rather than patched — roughly 1050 lines today, and nearly every
rule encodes the frame metaphor. Proposed order: reset → tokens → base type → layout
primitives → components → sections → motion → responsive. Target is similar or smaller than
today, since removing borders-on-everything removes a large amount of rule surface.

### Out of scope, unchanged

Backend, Terraform, GitHub Actions, `scripts/generate_resume.py`, `data.json` *values*,
`resume.pdf`, and the S3/Cloudflare hosting. The deploy workflow needs no edit: it already
transpiles `app.jsx` and syncs `frontend/`.

### Risks

1. **Two new webfonts.** Mitigated by `preconnect`, `display=swap`, and requesting only the
   listed weights. Net request count is unchanged from today.
2. **Rewriting `styles.css` loses the current responsive fixes.** Commits `1033b93` and
   `c57b4fb` closed specific breakpoint bugs; those cases must be re-tested at 390, 768,
   1024, and 1440 before deploy.
3. **Retiring the frame metaphor is a one-way door** for the existing `DESIGN.md` and
   `.impeccable/design.json`. Both need rewriting to match, or they become stale.
4. **`Instrument Serif` ships regular weight only.** The proposal never asks it for a
   second weight, but that constrains any future display variation.

---

## Next step

No implementation has begun. Approve, or answer the two open questions in §5, and the
redesign proceeds against this document.
