---
name: danilocloud.me
description: Warm paper, near-black ink, one blue. Three type families with strict roles.
colors:
  canvas: "#faf9f6"
  tint: "#f0ede6"
  card: "#ffffff"
  card-warm: "#fcfbf9"
  ink: "#1a1b18"
  ink-lifted: "#2e302b"
  ink-muted: "#5a5d55"
  ink-inverse: "#faf9f6"
  accent: "#1b4fa0"
  accent-soft: "#e8eef7"
  hairline: "#e2ded4"
  hairline-warm: "#e5e1d8"
  border-control: "#8a8d83"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2.75rem, 6vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  h2:
    fontFamily: "Instrument Serif, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  h3:
    fontFamily: "Inter Tight, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "clamp(1.375rem, 2vw, 1.75rem)"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  h4:
    fontFamily: "Inter Tight, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Inter Tight, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  body:
    fontFamily: "Inter Tight, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  eyebrow:
    fontFamily: "Inter Tight, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  pill: "999px"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "12px"
  s4: "16px"
  s6: "24px"
  s8: "32px"
  s12: "48px"
  s16: "64px"
  s24: "96px"
  section: "160px"
shadows:
  rest: "0 1px 2px rgba(26,27,24,.03), 0 12px 28px rgba(26,27,24,.03)"
  lift: "0 2px 4px rgba(26,27,24,.04), 0 20px 44px rgba(26,27,24,.06)"
motion:
  entrance: "cubic-bezier(0.16, 1.08, 0.38, 0.98)"
  state: "cubic-bezier(0.77, 0, 0.175, 1)"
---

# Design

The full analysis, the reference study, and the reasoning behind every token are in
[`docs/redesign-analysis.md`](docs/redesign-analysis.md). This file is the short reference.

## The idea

Warm paper, near-black ink, one blue. The page earns its quality from air and from
restraint rather than from ornament: four neutrals, one accent, one radius family, two
easing curves, one button shape.

The distribution-frame metaphor that shaped the previous design has been retired. What
survived from it is what was actually Danilo's: the jumper blue, now the only hue on the
page; the near-black with a green cast; monospace, kept for data; and the content itself.

## Type — three families, strict roles

| Family | Where it is allowed |
|---|---|
| Instrument Serif | The single largest headline in a section, and the one italic phrase inside it. Nothing else. |
| Inter Tight | Every readable thing: card titles, sub-heads, body, buttons, navigation. |
| JetBrains Mono | Data only — dates, counts, tags, org names, repository paths, the live reading. **Never a sentence.** |

Nothing renders below 13px. Uppercase appears only on the eyebrow, at `0.02em`, never the
`0.16em` of the previous design. Prose caps at 68ch, leads at 46ch.

## Colour and contrast

Measured against the surface each token sits on:

| Pair | Ratio |
|---|---|
| ink on canvas | 16.43:1 |
| ink-muted on canvas | 6.37:1 |
| accent on canvas | 7.46:1 |
| border-control on canvas | 3.21:1 |
| `rgba(250,249,246,.62)` on ink | 7.01:1 |

`hairline` is decorative at 1.28:1 and must never be the only boundary of a control —
that is what `border-control` is for.

## Structure

- Section identity comes from background alternation, `canvas` ↔ `tint`. No rules, no
  numbered strips.
- Section padding steps 160 → 112 → 80 → 64 at 1280 / 1024 / 768.
- Container 1200px, gutter 24px (16px under 768).
- Cards carry radius 16, padding 32, and a shadow under 6% opacity. They should read as
  resting on the paper, never as floating above it.
- The circled chevron is the one recurring affordance: down for a download, up-right for
  anything that leaves the site, right for an internal jump.
- Grids fill their rows. Three capability cards go 3 → 1, never 3 → 2 → orphan; six
  projects sit in two clean rows of three.

## Motion

Entrances use `--ease-entrance` over 0.6s, staggered 60ms, capped at six children.
State changes use `--ease-state` over 0.2s. No library, no parallax, no scroll-jacking.

The fade-up hidden state lives behind `.js-reveal` on `<html>`, which JavaScript only adds
once it knows it can reveal again — without JS, or without `IntersectionObserver`, nothing
is ever hidden. Under `prefers-reduced-motion` every reveal resolves immediately and hover
transforms are dropped.

## Note

`.impeccable/design.json` still describes the retired distribution-frame system and is now
stale. It is tool-owned; regenerate it rather than hand-editing.
