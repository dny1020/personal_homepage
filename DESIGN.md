---
name: danilocloud.me
description: A telephone-exchange main distribution frame, carrying an engineer's record as wired terminal blocks.
colors:
  enamel: "#d4cec0"
  enamel-lit: "#ded9cd"
  trough: "#c4beaf"
  trough-deep: "#a9a291"
  steel: "#5e6259"
  steel-dark: "#454941"
  ink: "#191b17"
  ink-soft: "#494d44"
  ink-faint: "#55584f"
  strip: "#ede9dd"
  strip-edge: "#c6c0b0"
  pair-blue: "#1b4fa0"
  pair-orange: "#c9550f"
  pair-green: "#1d6f3f"
  pair-brown: "#7a4a22"
  pair-slate: "#5c6a74"
typography:
  display:
    fontFamily: "Archivo, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1.9rem, 5vw, 3.7rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Archivo, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo, system-ui, -apple-system, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo, system-ui, -apple-system, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.16em"
  term:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.72rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
  micro:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.66rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.08em"
rounded:
  square: "0"
  circle: "50%"
spacing:
  hair: "3px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  block: "34px"
components:
  tag:
    backgroundColor: "{colors.enamel-lit}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "8px 14px"
    typography: "{typography.term}"
  tag-live:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.strip}"
    rounded: "{rounded.square}"
    padding: "8px 14px"
  tag-live-hover:
    backgroundColor: "{colors.steel}"
    textColor: "{colors.strip}"
  terminal:
    backgroundColor: "{colors.trough}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.square}"
    padding: "4px 8px"
    typography: "{typography.term}"
  terminal-live:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.strip}"
  terminal-dimmed:
    backgroundColor: "{colors.enamel}"
    textColor: "{colors.ink-soft}"
  state:
    backgroundColor: "{colors.enamel-lit}"
    textColor: "{colors.ink-faint}"
    rounded: "{rounded.square}"
    padding: "2px 6px"
    typography: "{typography.micro}"
  state-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.strip}"
  circuit:
    backgroundColor: "{colors.enamel-lit}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "12px 14px"
  circuit-active:
    backgroundColor: "{colors.strip}"
    textColor: "{colors.ink}"
  strip:
    backgroundColor: "{colors.strip}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "0 16px"
    height: "34px"
  data-row:
    backgroundColor: "{colors.enamel-lit}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "7px 12px"
    typography: "{typography.micro}"
  term-link:
    backgroundColor: "{colors.enamel-lit}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "10px 14px"
    typography: "{typography.term}"
  term-link-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.strip}"
---

# Design System: danilocloud.me

## Overview

**Creative North Star: "The Distribution Frame"**

In a telephone exchange, the main distribution frame is the steel rack where every subscriber line lands on one side, every switch port on the other, and jumper wire crosses between them. It is the act of routing made into an object: who connects to whom is not described anywhere, it is visible as wire. This site is that frame. The page is not a document about an engineer who routes signals between systems — it is the rack, and the record is wired into it.

The ground is equipment enamel (`#d4cec0`), the warm putty of painted exchange steel under fluorescent light, not a screen colour and not a dark-mode default. Structure is drawn in painted steel members at one and two pixels. Text is engraved ink. Labels ride on designation-strip stock, the paper slips that sit in a channel above each connection block. The only chromatic system on the page is the **25-pair telecom colour code** — blue, orange, green, brown, slate — and it is spent exclusively on live jumper wire. Every interface state that is not wire is carried by fill, weight and member thickness instead.

The system is entirely flat and entirely square. There are **zero** `box-shadow` declarations, **zero** `backdrop-filter` declarations, and exactly **one** `border-radius` in the stylesheet: the 50% on the two rivet dots at the ends of each designation strip. Depth is real material stacking — a recessed trough is darker than the enamel around it, a strip is lighter — never a simulated bevel or a cast shadow. A frame rendered with CSS relief would be a costume; the honest reduction is the commitment.

**Key Characteristics:**
- Equipment-enamel ground; no dark mode, no glass, no gradient field
- The 25-pair colour code as the only chroma, reserved for wire
- Square corners everywhere; one circle, on the strip rivets
- No shadows and no blur — depth from tonal grounds and steel members
- Full-bleed frame elevation; no centred content column
- Data set in mono with tabular figures; prose in Archivo
- One authored landing: strips seat, then jumpers run, then it stops

## Colors

Painted steel and enamel in a narrow warm-grey band, with one saturated system reserved for wire.

### Primary
- **Jumper Blue** (`#1b4fa0`), **Jumper Orange** (`#c9550f`), **Jumper Green** (`#1d6f3f`), **Jumper Brown** (`#7a4a22`), **Jumper Slate** (`#5c6a74`): the first five ring colours of the 25-pair code, assigned in order to the wires leaving the circuit under trace. They exist as SVG stroke and as the swatches in the pair legend. They appear nowhere else.

### Neutral
- **Enamel** (`#d4cec0`): the frame's paint, and the page ground.
- **Enamel Lit** (`#ded9cd`): a raised face — circuit bodies, service cells, data rows.
- **Trough** (`#c4beaf`): a recessed channel — the upright rail, terminals at rest, the pair legend, the footer.
- **Trough Deep** (`#a9a291`): strip rivets, terminal edges at rest, dashed rules. Never a text ground.
- **Steel** (`#5e6259`) and **Steel Dark** (`#454941`): the frame's members, at 1px and 2px respectively. Steel also carries text selection.
- **Ink** (`#191b17`): engraved type, and the fill of every live or active control.
- **Ink Soft** (`#494d44`): prose and terminal labels. Passes 4.67:1 on trough, the darkest text ground in the system.
- **Ink Faint** (`#55584f`): section heads, metadata, strip clauses. Only ever on enamel, enamel-lit or strip stock — never on trough.
- **Strip** (`#ede9dd`) and **Strip Edge** (`#c6c0b0`): designation-strip stock and its edge. Strip is also the text colour on any inked control.

### Named Rules

**The Wire Rule.** The 25-pair colour code is spent on jumper wire and on the legend that decodes it. Nothing else on the page may take a pair colour — not a button, not a chip, not a border, not a focus ring. A page where the accent appears on controls is a page where a blue wire reads as brand colour instead of as pair 1, and that is precisely the generic-portfolio tell this world exists to refuse.

**The Fill Rule.** State is carried by fill and weight, never by hue. A live terminal, an active circuit's state chip, the current rail designation and the primary action are all ink-filled with strip-coloured type. A dimmed terminal recedes to the enamel ground. Never dim with `opacity`: a translucent chip lets jumper wire show through and reads as a strike-through.

**The No-Pure-Black Rule.** The darkest value is Ink (`#191b17`). Pure `#000` and pure `#fff` never appear; every value sits in the warm grey band of painted equipment.

## Typography

**Structural face:** Archivo (with `system-ui, -apple-system, sans-serif`) — weights 400, 500, 600, 700
**Terminal face:** JetBrains Mono (with `ui-monospace, SFMono-Regular, Menlo, monospace`) — weights 400, 500, 700

**Character:** Archivo is an American grotesque with signage lineage — sturdy, slightly condensed, and convincing at display scale, which is what a stencilled frame designation needs. JetBrains Mono is the instrument voice. The two do all the work; there is no third family and no display serif.

### Hierarchy
- **Display** (Archivo 700, `clamp(1.9rem, 5vw, 3.7rem)`, line-height 0.98, tracking -0.025em, uppercase): the name, once, on the identification strip. Nothing else takes this size.
- **Title** (Archivo 600, `1rem`–`1.02rem`): role titles, project names, qualification titles.
- **Body** (Archivo 400, `0.84rem`–`0.95rem`, line-height 1.5): prose. Measure capped at 34–66ch depending on column.
- **Label** (Archivo 600, `0.72rem`, tracking 0.16em, uppercase): designation-strip titles.
- **Terminal** (JetBrains Mono 500, `0.68rem`–`0.74rem`, tracking 0.02em): all data — periods, pair counts, designations, terminals, contact rows.
- **Micro** (JetBrains Mono 500, `0.62rem`–`0.66rem`, tracking 0.08em): group labels, captions, legend keys.

Every numeric readout carries `font-variant-numeric: tabular-nums slashed-zero`.

*Implementation note: the mono band currently carries more one-off steps than these six roles describe (0.62, 0.64, 0.66, 0.68, 0.7, 0.72, 0.74rem). Consolidate to `0.66` (micro) and `0.72` (terminal) as the two mono steps; the extra values are drift, not system.*

### Named Rules

**The Instrument Voice Rule.** If a value was measured, counted, dated or rated, it is mono with tabular figures. If a human wrote it as a sentence, or it is the name of a thing, it is Archivo. "Jun 2024 – Present" is mono; "10 pairs cross-connected" is mono; "Kamailio" is not, because a technology name is a label, not a reading. Monospace here is the frame's data voice, never a costume for "technical".

**The Engraved Strip Rule.** A designation strip never truncates. It is the world's signature label, and cutting it mid-word is the one thing it must not do. Below 560px the strip drops its clause and shows the designation alone.

## Layout

Full-bleed frame elevation. There is no centred content column and no `max-width` on the page: the frame runs edge to edge, offset only by the fixed 56px upright rail on the left (44px below 900px).

The page is five stacked **blocks**, each opened by a 34px designation strip that sticks to the top of the viewport as its block scrolls. Block bodies pad 24px/16px/34px. The upright carries the vertical `MDF` mark and the block index (00–04), with the current designation inked by an IntersectionObserver at `-20% 0px -70% 0px`.

Block 01, the cross-connect, is the only three-column structure: `minmax(0, 1.05fr) 120px minmax(0, 0.95fr)` — line side, wire gutter, equipment side. The equipment column is a flex column with `justify-content: space-between` and `min-height: 100%`, so it terminates at the line side's foot rather than running out above it.

Blocks 02 and 03 are `repeat(auto-fit, minmax(320px, 1fr))` and `minmax(300px, 1fr)` cell grids that share continuous members: each cell draws only its right and bottom border against a container that draws top and left, so adjacent cells never double their rules.

**Breakpoints:** two. At 900px the wire gutter collapses, the cross-connect stacks, the pair legend is replaced by a text note, and the head goes single column. At 560px the strip drops its clause and block padding tightens.

### Named Rules

**The Shared Member Rule.** Adjacent units in a block share one steel member. A circuit sets `border-top: none` against its predecessor; a grid cell draws only right and bottom. Two abutting 1px borders read as a 2px seam and turn a block back into a stack of cards.

**The Full-Bleed Rule.** The frame owns the whole viewport. No centred column, no page gutter, no content max-width. The only reserved edge is the upright rail.

## Elevation & Depth

There are no shadows in this system, and no blur. `box-shadow` and `backdrop-filter` appear zero times in the stylesheet, and that is a rule rather than an omission.

Depth is material stacking in three tonal planes, read against the enamel ground:

- **Raised** — Enamel Lit (`#ded9cd`): circuit bodies, service and qualification cells, data rows, contact rows. Lighter than the ground.
- **Recessed** — Trough (`#c4beaf`): the upright rail, terminals at rest, the pair legend, the footer. Darker than the ground.
- **Strip stock** — Strip (`#ede9dd`): designation strips and the surface of any hovered circuit. The lightest plane, and the only one that carries display type.

Members separate planes: 1px Steel for ordinary divisions, 2px Steel Dark between blocks and around the ID plate.

### Named Rules

**The No-Relief Rule.** Never simulate the material. No bevels, no emboss, no metallic gradient, no grain filter, no faked screw heads beyond the two flat rivet dots. If the frame is ever to gain real material, it arrives as a produced raster texture, not as CSS relief. Imitation material is the most reliable mark of machine-made design, and an honest flat reduction outranks a convincing fake.

**The Three Plane Rule.** Every surface is raised, recessed, or strip stock. Name its plane before building it. A fourth value means the system grew a tone it does not need.

## Shapes

Square. `border-radius` appears once in the entire stylesheet — `50%` on the two rivet dots that terminate each designation strip — and nothing else on the page is rounded. No pills, no rounded cards, no soft corners on buttons, chips, images or panels.

Form is carried by the member grid: everything is a rectangle bounded by painted steel, at 1px for divisions within a block and 2px between blocks. The ID plate takes a 2px frame with a 6px trough inset, the only double-framed element. Terminals are 1px rectangles at `4px 8px`. The wire is the only curve in the system: cubic beziers with a bend of `max(40, (x2 - x1) * 0.55)`, 1.6px stroke, drawn behind every opaque block.

### Named Rules

**The Square Rule.** Nothing is rounded. If a new element seems to want a radius, it wants to be a different plane or a different member weight instead. The single circle is the rivet, and it is 5px.

## Components

### Upright Rail
The frame's left member, fixed full height at 56px, Trough ground with a 2px Steel Dark right edge. Carries the vertical `MDF` mark and five 32x28px designation links. The current block's designation is ink-filled with strip type; hover draws a Steel border. Below 900px it narrows to 44px and drops the mark.

### Designation Strip
A 34px bar of strip stock with a 1px Steel bottom edge, sticky at `top: 0`, bearing a 5px Trough Deep rivet at each end. It carries the designation in mono 700, the block title as a tracked uppercase label, an optional clause in Ink Faint, and a right-aligned count. It never truncates.

### Identification Strip (signature)
Block 00's strip, unrolled: full-bleed strip stock, `20px 16px 16px`, static rather than sticky, carrying the name at display scale, the discipline line in mono above a 1px rule, and a mono line of record counts. This is the frame's name plate and the page's first viewport. It replaces the conventional portfolio hero entirely — there is no hero on this page.

### Circuit
A record on the line side: an `<article>` on Enamel Lit with a 1px member, `12px 14px`, sharing its top member with the circuit above. Holds a state control, a role title, a mono period, a mono pair count, the organisation, and the description. Pointer entry previews its trace; the surface lifts to strip stock and the member goes to Ink.

### State Control (signature)
The chip that reads `Active` or `Terminated` is a real `<button type="button">` with `aria-pressed` and an `aria-label` naming its circuit. It is the trace toggle. `Active` is ink-filled with strip type; `Terminated` is an Ink Faint outline. Pressing pins a circuit's trace; the pin survives the pointer leaving, and only pressing again releases it. The role title stays a sibling `<h4>` so the document outline keeps all five roles.

### Terminal
A mono chip on the equipment side, 1px Trough Deep edge on Trough, `4px 8px`, `position: relative; z-index: 1` so wire passes behind it. Three states, all opaque: at rest on Trough; live, ink-filled with strip type; dimmed, receded to the Enamel ground. Terminals are packed at 3px gaps — density is the point.

### Jumper (signature)
An SVG overlay at `z-index: 0` spanning the cross-connect field, drawn from measured element boxes and recomputed on a `ResizeObserver` plus scroll and resize, always on the next animation frame. One cubic bezier per connection, 1.6px, coloured by pair index in code order. The set is derived, never authored: each role's own title and description are matched against the terminal inventory, so a wire exists only where the record already says it does. The circuit still in service is traced at rest, so the mechanism is visible without interaction.

### Tag
A square mono control, `8px 14px`, 1px member on Enamel Lit. The primary variant (`RECORD COPY`) is ink-filled with strip type and goes to Steel on hover.

### Frame Data Panel
A label-value list in a 1px frame: each row is Enamel Lit, `7px 12px`, with a micro uppercase term at the left and a mono value pushed right. Carries only metadata about the record — location, circuit and terminal counts, issue year — never CV content.

### Pair Legend / Block Elevation
The frame's printed matter. The legend seats at the foot of the equipment column with five 16x3px swatches naming their pairs and a foot line carrying terminal and circuit totals. The elevation key lists the five blocks with their designations, titles and live counts, each row a link. Below 900px the legend is replaced by a plain note, because no wire is drawn at that width and a colour key would decode an absent device.

### Cells (service, qualification, badge)
Grid cells on Enamel Lit drawing right and bottom members only, `14px`–`16px` padding, lifting to strip stock on hover. Project cells carry a mono designation, a title, prose, terminals and their source tag. Badge rows carry a 42x42px raster in a 1px Trough well.

### Browser Surfaces
Selection is Steel with strip type. The focus ring is a 2px Ink outline at 2px offset. The scrollbar is thin, Steel thumb on Trough track.

### Motion
One authored landing, once: designation strips seat in from `translateX(-10px)` at 340ms on a 60ms stagger, then the live jumpers draw via `stroke-dashoffset` at 500ms after a 300ms delay, then it stops. Everything after is 150ms linear state feedback. Under `prefers-reduced-motion: reduce` the landing is removed, wire renders already drawn, and all transitions collapse to 0.01ms.

## Do's and Don'ts

### Do:
- **Do** spend the 25-pair colour code on wire and its legend, and nowhere else.
- **Do** carry state with fill and weight — ink-filled for live, outline for at-rest, receded to enamel for dimmed.
- **Do** keep every surface square. The one circle in the system is the 5px strip rivet.
- **Do** name a surface's plane before building it: raised, recessed, or strip stock.
- **Do** let adjacent units share one steel member.
- **Do** set every measured value in mono with tabular figures and a slashed zero.
- **Do** derive relationships from the record rather than authoring them — a wire may only exist where the CV already says it does.
- **Do** keep the frame full-bleed; the upright rail is the only reserved edge.
- **Do** put an interactive control on an actual `<button>` and leave headings as headings.

### Don't:
- **Don't** give a pair colour to a button, chip, border or focus ring.
- **Don't** add a `box-shadow` or a `backdrop-filter`. There are zero of each, deliberately.
- **Don't** round anything.
- **Don't** dim with `opacity` — a translucent terminal lets wire show through and reads as a strike-through.
- **Don't** simulate the material with CSS bevels, emboss, metallic gradients or grain. Real material arrives as a produced raster or not at all.
- **Don't** centre the content in a column, or re-introduce a hero above the identification strip.
- **Don't** ship a big-number-plus-small-label stat row. Counts belong on designation strips and in the frame data panel.
- **Don't** let a designation strip truncate; drop its clause instead.
- **Don't** print the same record at two designations. One record, one home — the elevation key asserts where each block's content lives, and it must stay true.
- **Don't** wrap a whole card in `role="button"`. It swallows the headings inside it and destroys the document outline.
