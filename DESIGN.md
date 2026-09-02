---
name: danilocloud.me
description: A night-shift operations console for a telephony and infrastructure engineer's CV portfolio.
colors:
  ink-900: "#0b0d12"
  ink-800: "#121620"
  ink-700: "#181e2b"
  teal: "#2dd4bf"
  teal-bright: "#4ee3d0"
  teal-dark: "#0f766e"
  teal-ink: "#081017"
  mist: "#f8fafc"
  slate-200: "#d5dae3"
  slate-400: "#9aa4b2"
  glass: "rgba(255, 255, 255, 0.06)"
  hairline: "rgba(255, 255, 255, 0.12)"
  shadow: "rgba(4, 8, 20, 0.45)"
typography:
  display:
    fontFamily: "Sora, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(2.8rem, 6vw, 4.6rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "normal"
  headline:
    fontFamily: "Sora, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(2rem, 4vw, 2.8rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "normal"
  title:
    fontFamily: "Sora, system-ui, -apple-system, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Space Grotesk, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Space Grotesk, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.08em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.85rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
rounded:
  sm: "10px"
  md: "14px"
  lg: "18px"
  pill: "999px"
  circle: "50%"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  2xl: "40px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.teal-ink}"
    rounded: "{rounded.pill}"
    padding: "12px 26px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.teal-ink}"
  button-ghost:
    backgroundColor: "rgba(255, 255, 255, 0.08)"
    textColor: "{colors.mist}"
    rounded: "{rounded.pill}"
    padding: "12px 26px"
  button-ghost-hover:
    backgroundColor: "rgba(255, 255, 255, 0.15)"
    textColor: "{colors.mist}"
  nav-cta:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.teal-ink}"
    rounded: "{rounded.pill}"
    padding: "9px 20px"
  nav-cta-hover:
    backgroundColor: "{colors.teal-bright}"
    textColor: "{colors.teal-ink}"
  card-glass:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.mist}"
    rounded: "{rounded.lg}"
    padding: "20px"
  chip-tag:
    backgroundColor: "rgba(45, 212, 191, 0.14)"
    textColor: "{colors.teal}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  skill-pill:
    backgroundColor: "rgba(45, 212, 191, 0.08)"
    textColor: "{colors.slate-200}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  skill-pill-hover:
    backgroundColor: "rgba(45, 212, 191, 0.08)"
    textColor: "{colors.mist}"
  contact-item:
    backgroundColor: "rgba(255, 255, 255, 0.05)"
    textColor: "{colors.mist}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
  contact-item-hover:
    backgroundColor: "rgba(255, 255, 255, 0.05)"
    textColor: "{colors.teal}"
  stat-tile:
    backgroundColor: "rgba(8, 12, 20, 0.5)"
    textColor: "{colors.teal}"
    rounded: "{rounded.md}"
    padding: "14px"
---

# Design System: danilocloud.me

## Overview

**Creative North Star: "The Night Operations Console"**

This is a room with the lights off and one instrument lit. The page sits at near-black (`#0b0d12`), lifted only by a cold teal glow bleeding in from the top-right corner and a fine dot-grid noise laid over everything at 15% opacity. Content lives on translucent panes stacked in that dark — you can see the glow through them, which is the point: the panels are glass in front of a running system, not cards on a page. Nothing here is bright except the one accent, and the accent is doing work.

The tone is **instrumented, quiet, precise, and warm underneath**. Instrumented, because the surface reports live state rather than describing it: the footer carries Bogotá's actual local time and current temperature, and the timeline lights exactly one milestone — the role still running. The page once carried a live WebRTC webchat widget too, and should again; it was removed while its subdomain is unreachable, because an instrument that reports nothing is worse than an absent one. Quiet and low-lit, because a visiting engineer is reading, not being sold to — there is no hero animation to sit through, and the type never shouts. Precise, because alignment and rhythm are the visible evidence of engineering discipline; a misaligned rail on this page costs more credibility than it would anywhere else. Warm underneath, because there is a person here and the design says so — a real photograph rather than an avatar, a coffee-consumption API sitting among the serious infrastructure, plain first-person copy with no inflation.

Typographically it runs on two geometric sans faces — Sora for structure, Space Grotesk for prose — with a monospace instrument voice for anything measured. The form language is soft: pills for anything interactive or categorical, generously rounded panes, one hairline of light on every edge. Motion is a single gesture, repeated: a 28px rise into view on scroll, a 2-8px lift on hover, 250ms, never more.

**Key Characteristics:**
- Near-black ground with a single teal signal color; no second accent
- Translucent panes at three distinct tiers of depth, not one uniform glass
- One hairline of light (`rgba(255,255,255,0.12)`) defines every edge
- Live readouts over static claims — the interface reports rather than asserts
- Pill geometry for interactive and categorical elements; soft rectangles for content
- Motion as feedback only: reveal-on-scroll, hover lift, nothing longer than 600ms
- Full `prefers-reduced-motion` honoring, already implemented

## Colors

A single cold accent burning in a deep blue-black room, with a three-step grey ramp carrying all text.

### Primary
- **Phosphor Teal** (`#2dd4bf`): The one light in the room. Named for CRT phosphor, not for a brand — it reads as an instrument's readout, not as decoration. At rest it marks only the primary button, the nav CTA, the stat values, the active nav underline, and the milestone dot of the role still running. Under the pointer or the keyboard it also carries every hover border, the focus ring, and the text selection. It takes a matching glow wherever it fills a raised element (`0 10px 30px rgba(45,212,191,0.3)`).
- **Phosphor Bright** (`#4ee3d0`): The hover state of the accent, and only that. It exists so the primary CTA can brighten without shifting hue.
- **Phosphor Deep** (`#0f766e`): Never a surface. Used exclusively as the far stop of the 135° avatar gradient, so the photograph frame has depth rather than a flat wash.
- **Console Ink** (`#081017`): The text color that sits *on* teal. Not a neutral — it is a blue-black chosen to keep teal buttons readable without introducing pure black anywhere in the system.

### Neutral
- **Ink Void** (`#0b0d12`): The page ground. Everything else floats on it.
- **Ink Raised** (`#121620`): One step up from the void. Used where a surface must be opaque rather than translucent — the mobile navigation panel, which cannot blur content behind it while scrolling is locked.
- **Ink Panel** (`#181e2b`): The opaque dropdown menu surface. The lightest opaque ink in the system.
- **Mist** (`#f8fafc`): Primary text and headings. Never pure white — the off-white keeps a dark screen readable at length.
- **Slate 200** (`#d5dae3`): Body prose, descriptions, secondary text. Carries almost all the reading weight on this page.
- **Slate 400** (`#9aa4b2`): Metadata only — dates, periods, the footer, the location line. The system's way of saying "this is a timestamp, not content."
- **Glass Fill** (`rgba(255,255,255,0.06)`) and **Hairline** (`rgba(255,255,255,0.12)`): The pane material and its edge. See Elevation & Depth.

### Named Rules

**The One Light Rule.** There is exactly one accent color in this system and there will never be a second. No status greens, no warning ambers, no per-category hues on skill groups. If something needs to be distinguished from its neighbor, distinguish it with type, weight, position, or opacity — never by introducing a color.

**The Scarcity Rule.** Phosphor Teal marks *state and signal*, not category. At rest it appears in exactly five places: the primary button, the nav CTA, the three stat values, the active nav link's underline, and the dot of the one role still running. Everything else earns it only under the pointer or the keyboard — hover borders, focus rings, text selection. Tags, skill pills, education chips, icon wells, section rails, and the scroll-to-top control are all neutral by rule. **Audit test:** count the elements painting teal as a foreground, border, or fill in the resting state. If more than roughly one in ten, the signal has become wallpaper and the rarest thing on the page is no longer the most important.

**The No-Pure-Black Rule.** The darkest value in the system is `#07080c` (the far stop of the background gradient). Pure `#000` never appears. Every dark is a blue-black, which is what makes the teal read as cold light rather than as neon.

## Typography

**Display Font:** Sora (fallback `system-ui, -apple-system, sans-serif`) — weights 600, 700
**Body Font:** Space Grotesk (fallback `system-ui, -apple-system, sans-serif`) — weights 400, 500, 600
**Mono/Instrument Font:** JetBrains Mono (fallback `ui-monospace, SFMono-Regular, Menlo, monospace`) — weight 500

**Character:** Two geometric sans faces that share a skeleton but not a temperament. Sora is the structural voice — wide, even, confident at display sizes, and it carries every heading. Space Grotesk is the reading voice, slightly mechanical in its detailing (the flat-sided `a`, the cut terminals), which keeps technical prose from feeling like marketing copy. The pairing is deliberately close; the hierarchy comes from size and weight, not from contrast between families.

The monospace is the instrument voice: it separates *what is measured* from *what is said*. Dates, periods, stat values, and proficiency ratings are readouts and are set in mono with tabular figures and a slashed zero; prose is not. Technology names are **not** readouts — a tag reading "PostgreSQL" is a label, and setting it in mono would be monospace worn as a costume for "technical" rather than used for data. The line is measurement, not subject matter.

### Hierarchy
- **Display** (Sora 600, `clamp(2.8rem, 6vw, 4.6rem)`, line-height 1.05): The name, once, in the hero. Nothing else in the system is allowed this size.
- **Headline** (Sora 600, `clamp(2rem, 4vw, 2.8rem)`, line-height ~1.15): Section titles. Eight of them on the page; they are the scan structure.
- **Title** (Sora 600, `1rem`–`1.2rem`): Job titles, project names, badge names, card headings. The step from Headline to Title is deliberately large — there is no mid-level heading, which keeps the page a flat list of sections rather than a nested document.
- **Body** (Space Grotesk 400, `1rem`, line-height 1.6): All descriptions and prose. Constrain measure to 65–75ch; the hero bio already caps at `520px` for this reason.
- **Label** (Space Grotesk 600, `1rem`, letter-spacing `0.08em`, uppercase): Skill category headers only. The letter-spacing plus uppercase is what makes a 1rem label read as a label rather than as a title at the same size.
- **Mono** (JetBrains Mono 500, `0.8rem`–`0.85rem`, letter-spacing `0.02em`): Periods, dates, stat values, tags, endpoints. Metadata sizes stay in the `0.8`–`0.85rem` band that the system already uses for `slate-400` text.

### Named Rules

**The Instrument Voice Rule.** If a value was measured, counted, dated, or rated, it is set in mono with `font-variant-numeric: tabular-nums slashed-zero`. If a human wrote it as a sentence, or it is the name of a thing, it is set in Space Grotesk. "Jun 2024 – Present" is mono; "13+" is mono; "Intermediate (B1)" is mono. "Design and implement enterprise SIP telephony solutions" is not, and neither is "Kamailio". **Audit test:** point at any string of digits on the page — if it is not in mono, either it should be, or it is genuinely prose. Then point at any mono string with no digits and no rating in it; that one is a costume and should come off.

**The Two-Step Rule.** Between any two adjacent levels of hierarchy there is a visible step in *both* size and weight or color. Never differentiate two type levels by size alone at close values; the system has no `1.05rem` vs `1.1rem` distinctions worth making.

## Layout

A single centered column, `max-width: 1180px`, with `24px` gutters that tighten to `16px` below 640px. Every section is a full-width band inside that container at `80px` vertical padding; the page top clears the floating navbar with `140px` of lead-in (`130px` on mobile).

The grid model is uniform and deliberately simple: `repeat(auto-fit, minmax(<floor>, 1fr))` everywhere, with the floor doing all the responsive work. There are no media-query column counts. The floors in use are `280px` (hero, projects), `300px` (skills), `260px` (achievements, repositories), `240px` (education, badges), and `100px` (stat tiles). Gaps sit at `20px`–`24px` between cards, `40px` between hero columns, `16px` between stat tiles.

**Breakpoints:** two, and only two. `960px` collapses the navigation into a toggled overlay panel and turns the skills grid single-column; `640px` tightens gutters, makes buttons full-width, and forces the badges grid to one column. Everything else adapts through `auto-fit` without a query.

**The vertical rail.** The experience timeline is the one piece of structural geometry in the system: a `2px` rail at 12% white running the full height of the section, with `10px` Slate 400 dots at each milestone under a `6px` halo at 6% white. The rail is structure, so it is neutral. Exactly one dot is lit — the role whose period still reads "Present" — and that single teal mark is what tells a reader where the timeline ends without a word of copy doing it.

**Rhythm.** Internal padding runs on a coarse scale: `14px` (tiles), `18px`–`20px` (list items and cards), `22px`–`24px` (feature cards), `28px`–`32px` (hero card, contact panel). Padding scales with the surface's importance, not with its content.

### Named Rules

**The One Column Rule.** This page is a single 1180px column and a vertical read. No sidebars, no sticky rails, no split-screen sections, no full-bleed breakouts. The nav is the only fixed element besides the scroll-to-top control.

## Elevation & Depth

Depth is built from translucency, not from shadow. Surfaces are panes of glass over a lit background: a 6% white fill, a 1px hairline at 12% white, a `22px` backdrop blur, and a wide soft shadow to seat the pane in the dark. The three fixed background layers underneath — a radial teal glow at 15%/15%, a 160° blue-black gradient, and a 3px dot-grid noise field at 15% opacity — are what make the glass legible. Remove them and the panes turn into flat grey rectangles.

**Glass is tiered, not uniform.** The current implementation applies the same treatment to nearly every surface, which flattens the hierarchy it should be creating. The system defines three tiers:

- **Tier 1 — True glass (blurred):** The floating navbar and the hero card. These are the only surfaces that carry `backdrop-filter: blur(22px)`. They sit closest to the viewer and are the only ones that visibly refract the glow behind them.
- **Tier 2 — Tonal panes (unblurred):** Project cards, badge cards, achievement cards, repo cards, timeline entries, language cards, the contact panel. Same 6% fill and hairline, but no backdrop blur — they read as material, not as glass, and they cost nothing to composite.
- **Tier 3 — Recessed wells:** Stat tiles and contact rows. *Darker* than their parent (`rgba(8,12,20,0.5)` / `rgba(255,255,255,0.05)`) with a fainter 8-10% hairline. These read as pressed into the surface rather than lifted off it — the readout inset on an instrument panel.

### Shadow Vocabulary
- **Seat** (`box-shadow: 0 18px 40px rgba(4,8,20,0.45)`): The default under any Tier 1 or Tier 2 surface. Its job is to separate the pane from the ground, not to suggest height.
- **Deep seat** (`box-shadow: 0 24px 60px rgba(4,8,20,0.45)`): The hero card only. The largest surface gets the widest shadow so it doesn't float unanchored.
- **Overlay** (`box-shadow: 0 14px 32px rgba(4,8,20,0.6)`): The dropdown menu. Darker and tighter, because it must read as *in front of* a Tier 1 surface.
- **Accent glow** (`box-shadow: 0 10px 30px rgba(45,212,191,0.3)`, hover `0 16px 36px rgba(45,212,191,0.45)`): Teal elements only — the primary button and the scroll-to-top control. This is light spilling from the element, not a shadow cast by it, which is why it is tinted rather than dark.

### Named Rules

**The Three-Pane Rule.** Every surface belongs to exactly one of the three tiers. Before adding a surface, name its tier. A new card is Tier 2 by default; Tier 1 is reserved for the two elements that already hold it, and each additional `backdrop-filter` is a real compositing cost on a page that already paints three fixed background layers.

**The Hairline Rule.** Every raised surface carries exactly one 1px border at `rgba(255,255,255,0.12)` — the light catching an edge. Never two borders, never a border plus an outline, and never a hairline on a Tier 3 well brighter than 10%.

**The Lift-On-Intent Rule.** Surfaces are still at rest. They move only in response to the pointer, and the movement encodes direction: cards rise (`translateY(-4px)` to `-8px`), timeline entries slide along their rail (`translateX(6px)`), and the accent brightens. Rest state is never animated.

## Shapes

Soft rectangles for content, full pills for anything interactive or categorical, circles for identity. Nothing in this system has a square corner except the left edge of an education item, where the rail cuts it.

The radius scale in use is **`10px` / `14px` / `18px` / `999px` / `50%`**, and radius encodes the size of the thing: `10px` for inline controls (project links, dropdown items), `14px` for small tiles and cards (stat tiles, language cards, badge thumbnails), `18px` for standard content cards, `999px` for pills and buttons, `50%` for avatars, timeline dots, and the scroll-to-top control.

The implementation also contains one-off values at `12px`, `16px`, `20px`, `22px`, `24px`, and `26px`. These are drift, not system: each appears once or twice on a single component. New work uses the five-step scale.

**Borders carry no colour at structural weight.** A tinted `border-left` or `border-right` above 1px reads as a stripe stuck onto a card rather than as material, so the education list — which once wore a `2px` teal left border and a square left edge — is now an ordinary Tier 2 pane: a full `14px` radius and one hairline on all four sides.

**Borders** are always 1px hairlines, with one structural exception: the `2px` neutral timeline rail, which is geometry rather than edging.

### Named Rules

**The Three-Radius Rule.** Content surfaces use `10px`, `14px`, or `18px` — nothing between. If a new component seems to need `16px`, it is either a small tile (`14px`) or a card (`18px`); decide which, and use that.

**The Pill Rule.** Round to `999px` only when the element is a discrete, tappable, or countable unit: a button, a tag, a skill pill, a level indicator. Never pill a container that holds prose.

## Components

### Buttons
- **Shape:** Full pill (`999px`), `12px 26px` padding, weight 600 at `0.95rem`, 1px transparent border reserved so variants don't shift size.
- **Primary:** Phosphor Teal fill with Console Ink text (`#081017`) and an accent glow (`0 10px 30px rgba(45,212,191,0.3)`). One per view. The hero's "Download CV" is the canonical instance.
- **Primary hover:** Rises `2px`; the glow widens and intensifies (`0 16px 36px rgba(45,212,191,0.45)`). The fill does not change — the light around it does.
- **Ghost:** 8% white fill, Mist text, 20% white border. The secondary action; unlimited per view.
- **Ghost hover:** Fill to 15% white, rises `2px`.
- **Nav CTA:** A compact primary (`9px 20px`, `0.9rem`) that brightens to Phosphor Bright on hover instead of glowing — it lives on a glass pane and a glow there would smear.
- **Mobile:** Below 640px every button goes full-width and stacks.

### Chips and Pills
The system has **two** chip variants, not three. Categorical things are never accented; they are named, and the name is the content.
- **Tag** (project technologies and education skills, one shared rule): 5% white fill, one hairline, Slate 200 text, `6px 12px`, weight 500 at `0.8rem`. Static — not interactive, purely categorical.
- **Skill pill:** the same neutral fill and hairline at `8px 14px` and `0.85rem`, because 30+ appear at once. It is the one chip that responds: hovering brightens the border to full teal and the text to Mist.

### Cards and Containers
- **Corner style:** `18px` for standard cards (badge, achievement, repo), `14px` for education items, `20px` for project cards, `24px` for the hero card, `22px` for the contact panel. Consolidate the `20px`/`22px` outliers to `18px` under the Three-Radius Rule; the hero card may keep `24px` as the one intentional exception.
- **Background:** Glass Fill (6% white), Tier 2 by default.
- **Border:** One hairline at 12% white.
- **Shadow:** Seat, or Deep seat for the hero card.
- **Padding:** `20px` for list-scale cards, `24px` for project cards, `28px`–`32px` for the hero and contact panels.
- **Hover:** Border brightens to `rgba(45,212,191,0.4)` and the card rises `4px`–`8px` over 250ms. The border shift is the primary signal; the lift supports it.

### Navigation
- **Style:** A floating Tier 1 glass bar, `min(1180px, 92%)` wide, centered, `22px` from the top, `20px` radius. On scroll past 40px it tightens to `12px` from the top with reduced padding — the only scroll-linked state in the system.
- **Links:** Slate 200 at `0.95rem` weight 500. The active and hover state sweeps a `2px` teal underline in from the left over 250ms — `transform: scaleX()` from a `transform-origin: left`, never an animated `width`, which would thrash layout on every frame of the sweep — and lifts the text to Mist. This underline is the purest expression of the Scarcity Rule: teal marks exactly one link, the one you are reading.
- **Brand:** A 42px circular avatar (photo, or initials on a 135° teal gradient) with a 2px white-15% ring, beside the first two name words at `1.05rem` weight 600.
- **Dropdown:** An opaque Ink Panel surface (`#181e2b`), `14px` radius, `10px` padding, items at `10px` radius. It is opaque, not glass, because a blurred menu over a blurred bar is unreadable. Opens on hover on desktop, on click on mobile.
- **Mobile (≤960px):** The links become a fixed Ink Raised panel below the bar; the toggle's three bars rotate into an X.

### Timeline (signature component)
The system's defining structure and the piece most worth preserving. A `2px` neutral rail at 12% white anchors the left edge of the experience section. Each entry hangs a `10px` Slate 400 dot on the rail under a `6px` halo at 6% white, and a Tier 2 pane sits `24px` to its right. Hovering slides the pane `6px` further along the rail and brightens its border. The role title is Title-scale Sora; the company is Mist at weight 500; the period is mono, right-aligned in a flex header that wraps on narrow screens.

**The current entry is the only lit one.** An entry whose period contains "Present" takes the modifier `.timeline-item--current`, which fills its dot with teal and restores the teal halo. The marker is derived from the data, never from list position, so it stays correct when roles are reordered and disappears honestly when no role is open.

### Stat Tiles
Three recessed wells in the hero card, `14px` radius, `14px` padding, centered. The value is teal at `1.3rem` weight 600, set in the mono instrument voice with tabular figures; the label is Slate 400 at `0.8rem` in Space Grotesk. This is the clearest instrument readout in the system and the model for how measured values look everywhere else — and one of only two places teal survives as a resting foreground.

### Contact Rows
Tier 3 wells, `12px` radius, `12px 16px` padding, 5% white fill with a 10% hairline, each led by a 16px icon. Hovering shifts both the border and the text to teal — the only place in the system where a full row adopts the accent, justified because these are the terminal actions of the page.

### Scroll-to-Top
A 48px circle fixed at `28px` from the bottom-right: Ink Panel fill, one hairline, seat shadow, Mist arrow. Hidden at `opacity: 0` with `pointer-events: none` until 400px of scroll. On hover it rises `4px` and its border and arrow turn teal. It is a persistent control, and a persistently teal control would have been the single largest leak in the Scarcity Rule — a utility affordance holding the same weight as the page's one primary action.

### Browser Surfaces
The parts of the page nobody draws still belong to the system. Text selection is teal at 25% with Mist text. The keyboard focus ring is a `2px` teal outline at `3px` offset on every link and button, which is the accent doing its actual job — marking state — and it is the only focus treatment in the system. The scrollbar is thin, with a 18%-white thumb on a transparent track.

### Icons
A hand-authored set of 15 single-path SVGs on a `32×32` viewBox, filled with `currentColor` at 16px default. No icon library, no icon font, no external requests. Icons inherit the color of whatever they sit in, which is why they never need their own color rules.

## Do's and Don'ts

### Do:
- **Do** treat Phosphor Teal as the one light in the room — mark state and signal with it (active nav, current role, live link, stat value, primary CTA, focus), and audit that it stays near one element in ten.
- **Do** name a surface's tier before you build it: Tier 1 true glass (nav and hero card only), Tier 2 tonal pane (the default), Tier 3 recessed well (readouts and rows).
- **Do** put exactly one 1px hairline at `rgba(255,255,255,0.12)` on every raised surface.
- **Do** set measured values — dates, periods, counts, tags, endpoints — in the mono instrument voice, and load JetBrains Mono in `index.html` when you do.
- **Do** stay on the five-step radius scale: `10px`, `14px`, `18px`, `999px`, `50%`.
- **Do** let `repeat(auto-fit, minmax(<floor>, 1fr))` do the responsive work; add a media query only for the two breakpoints that already exist (`960px`, `640px`).
- **Do** keep motion as feedback: reveal at 600ms, hover at 250ms, hover lifts between 2px and 8px, and extend the existing `prefers-reduced-motion` block to cover anything new.
- **Do** show live state where you can — real local time, real weather, real reachable endpoints. The instrument reports; it does not describe.
- **Do** keep the accent glow tinted (`rgba(45,212,191,…)`) on teal elements and dark (`rgba(4,8,20,…)`) everywhere else.
- **Do** theme the surfaces you did not draw — selection, focus ring, scrollbar — from the palette. They are the cheapest evidence the page was built rather than assembled.
- **Do** animate `transform` and `opacity` only. The nav underline sweeps with `scaleX`, not `width`.

### Don't:
- **Don't** introduce a second accent color. No status green, no warning amber, no per-category hue. Differentiate with type, weight, position, or opacity.
- **Don't** add `backdrop-filter` to a new surface. Two blurred layers already exist and the page paints three fixed background layers beneath them.
- **Don't** use pure `#000` or pure `#fff`. The darkest value is `#07080c`; the lightest is Mist (`#f8fafc`).
- **Don't** pill a container that holds prose. Pills are for discrete, countable, or tappable units.
- **Don't** add radius values between the scale steps — no `12px`, `16px`, `20px`, `22px`, `26px` on new work.
- **Don't** drift toward the template dev portfolio: no purple-to-blue gradient hero, no floating 3D blobs, no typewriter effect on the role line, no animated counting stat numbers.
- **Don't** drift toward corporate SaaS marketing: no illustrated people, no "Trusted by" logo wall, no testimonial cards, no trust badges. PRODUCT.md records that none of that evidence exists and it must never be fabricated to fill a layout.
- **Don't** drift toward the over-animated showcase: no scroll-jacking, no parallax, no cursor followers, no magnetic buttons, no page transitions. Motion responds to the user; it never performs for them.
- **Don't** drift toward the corporate résumé document: no serif headings, no letterhead layout, no dense two-column body text. This is a console, not a printout — `resume.pdf` already exists for anyone who wants the document.
- **Don't** add a sidebar, sticky rail, split-screen section, or full-bleed breakout. One 1180px column, one vertical read.
- **Don't** accent something categorical. Tags, skill pills, icon wells, and section rails are neutral; if a reader needs to tell two of them apart, that is a job for type, weight, or position.
- **Don't** ship a link that goes nowhere, and don't count a private subdomain as a live demo. Every `demo` value was removed on 2026-09-01 — three were `"#"` placeholders and the fourth pointed at a host that returns NXDOMAIN publicly. Verify a target resolves from outside the network before a control is allowed to promise it.
