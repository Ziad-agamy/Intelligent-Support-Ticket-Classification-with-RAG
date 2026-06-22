# Design

Visual system for the Customer Support Ticket System. Anchored to PRODUCT.md: product register, calm-expert-trustworthy personality, restrained strategy, WCAG 2.2 AA floor.

## Theme

**Light**, single mode. The product is a transactional tool used in mixed lighting by customers who arrived with a problem; pure white surface removes visual noise and lets the brand color do the work. No dark mode in v1 — adding it later is straightforward once the token system is locked, but the team has not asked for it.

Strategy: **Restrained**. Tinted neutrals plus one accent used ≤10% of surface area. The brand color carries personality on the primary action only; everything else stays neutral. This is the Linear / Stripe / Vercel posture, not the AI-default SaaS posture.

Mood phrase: *late-afternoon support desk — quiet competence, paper on the desk, one warm coffee cup, no decorations.*

## Color Palette

All colors expressed in OKLCH. Tokens are CSS custom properties in `frontend/src/index.css`.

```
--bg:        oklch(1.000 0.000 0);     /* pure white */
--surface:   oklch(0.985 0.002 80);    /* white pulled 8% toward ink — cards, panels */
--ink:       oklch(0.205 0.013 60);    /* body text, ≥13:1 on bg */
--muted:     oklch(0.485 0.010 60);    /* secondary text, ≥5.4:1 on bg */
--primary:   oklch(0.620 0.180 56);    /* burnt honey — CTA fill, focus ring, current state */
--primary-ink: oklch(1.000 0.000 0);   /* text on primary — pure white by Helmholtz-Kohlrausch */
--accent:    oklch(0.450 0.105 250);   /* slate-blue — links, info markers, secondary markers */
--accent-ink:  oklch(1.000 0.000 0);
--border:    oklch(0.910 0.005 60);    /* hairlines, input borders */
--border-strong: oklch(0.820 0.008 60);
--success:   oklch(0.520 0.130 150);   /* green — submit success */
--danger:    oklch(0.500 0.180 25);    /* red — errors, validation */
--warn:      oklch(0.620 0.140 75);    /* amber — soft warnings */
```

Composition notes:

- **`--bg` is exactly pure white** (L 1.000, chroma 0.000). Not 0.99, not chroma 0.002. Stripe / Notion / Linear / Apple / Vercel all use literal #ffffff; the warmth lives in primary and ink, not the surface. This is the deliberate counter to the cream/sand AI default.
- **Primary chroma 0.180** sits under the 0.23 ceiling, and primary L 0.620 sits below the 0.78 fluorescent threshold, so primary carries white text without glow. Primary-vs-accent lightness contrast is 0.620 vs 0.450 — distinct in both hue and lightness, not two variants of the same idea.
- **Ink is neutral with 0.013 chroma toward the brand hue** — not toward warmth-by-default. It reads as nearly-black with a hint of warmth under the right light; never feels "off-black" or tinted.
- **Accent is a cool slate-blue** to break the warm monochromatic palette. Used sparingly: links, info pills, the response-card marker, status indicators. Never for buttons.
- **`--muted` ≥5.4:1 on bg**, exceeds the AA 4.5:1 floor by margin. Muted-gray body text on tinted bg is the most common AI failure; this ramp pulls muted toward ink.
- **Status colors** (success/danger/warn) are calibrated to clear-mid-luminance (L 0.50-0.62) with white text, not dark text on mid-fills — Helmholtz-Kohlrausch respected.

## Typography

One family: **Inter** (variable). Loaded from a self-hosted subset via `@fontsource-variable/inter` once npm dependencies are updated. Falls back to `system-ui` then `-apple-system`. No display pairing; Inter at multiple weights is enough.

Why Inter: it is the most common modern UI sans, tuned for small sizes, pairs cleanly with itself across weights 400/500/600/700, and renders identically across operating systems. The brand personality (calm, expert) does not require a display serif — competence reads in spacing and restraint, not in font choice.

Fixed rem scale (no fluid clamp on product UI):

```
--fs-xs:   0.75rem;    /* 12px — meta labels */
--fs-sm:   0.875rem;   /* 14px — small body, captions */
--fs-base: 1rem;       /* 16px — body, inputs */
--fs-md:   1.0625rem;  /* 17px — large body, hero subtitle */
--fs-lg:   1.25rem;    /* 20px — h3, section titles */
--fs-xl:   1.5rem;     /* 24px — h2 */
--fs-2xl:  1.875rem;   /* 30px — page h1 */
--fs-3xl:  2.25rem;    /* 36px — thank-you h1 */

--lh-tight:   1.15;    /* headings */
--lh-snug:    1.35;    /* subheadings */
--lh-normal:  1.55;    /* body */
--lh-relaxed: 1.7;     /* long-form markdown response */

--fw-regular:  400;
--fw-medium:   500;
--fw-semibold: 600;
--fw-bold:     700;

--tracking-tight:  -0.015em;   /* h1 only */
--tracking-normal:  0;
--tracking-wide:    0.04em;    /* reserved for small uppercase meta — use sparingly, not as eyebrow */
```

Line length capped at 65ch for prose, 75ch for the AI response body. Data inputs are exempt.

`text-wrap: balance` on h1, h2, h3. `text-wrap: pretty` on long prose paragraphs (response body).

Heading letter-spacing: h1 uses -0.015em, h2/h3 use 0. The dramatic -0.04em display ceiling is brand territory, not product. The product's headings are workmanlike.

## Spacing

4px base unit. Tokens only, never raw px:

```
--space-1:  0.25rem;   /* 4px */
--space-2:  0.5rem;    /* 8px */
--space-3:  0.75rem;   /* 12px */
--space-4:  1rem;      /* 16px */
--space-5:  1.5rem;    /* 24px */
--space-6:  2rem;      /* 32px */
--space-7:  2.5rem;    /* 40px */
--space-8:  3rem;      /* 48px */
--space-9:  4rem;      /* 64px */
--space-10: 5rem;      /* 80px */
--space-12: 7.5rem;    /* 120px */
```

Rhythm: form fields separated by `--space-5` (24px). Form groups separated by `--space-6` (32px). Page vertical padding `--space-8` to `--space-10` depending on breakpoint. Container max-width 560px on `/` (form), 720px on `/thank-you` (response).

## Layout

```
/            max-width 560px, single column, vertical stack
/thank-you   max-width 720px, single column, vertical stack
```

Container has horizontal padding `--space-5` on mobile, `--space-6` on ≥768px. Vertical centering comes from the page shell, not from inside the container.

Form row (first/last name): two-column grid (`grid-template-columns: 1fr 1fr`) collapsing to one column below 640px. Gap `--space-4`.

## Components

Each component carries: default, hover, focus-visible, active, disabled, loading (where applicable), error (where applicable). Tokens defined in `frontend/src/tokens.css`, components consume tokens only.

**Button (primary)**:
- Default: bg `--primary`, fg `--primary-ink`, no border, radius 10px, padding 12px 20px, weight 600.
- Hover: bg darken to `oklch(0.565 0.180 56)`, no transform, no shadow, no scale.
- Focus-visible: 2px outer ring `--primary` at 3px offset, never removed.
- Active: bg `oklch(0.520 0.180 56)`.
- Disabled: bg `--border-strong`, fg `--muted`, cursor not-allowed.
- Loading: spinner inline replaces label, button width stays locked so layout doesn't shift, button remains focusable.

**Button (secondary)**:
- Default: bg `--surface`, fg `--ink`, 1px border `--border`, radius 10px.
- Hover: bg `--bg`, border `--border-strong`.
- Focus-visible: same as primary, ring color `--ink`.
- Active: bg `--border` at low opacity.

**Input**:
- Default: bg `--bg`, fg `--ink`, 1px border `--border`, radius 8px, padding 11px 14px.
- Hover: border `--border-strong`.
- Focus-visible: 2px outer ring `--primary` at 2px offset, border `--primary`. Outline never removed.
- Error: border `--danger`, error text below in `--danger` 0.875rem.
- Placeholder: `--muted` (≥5.4:1 on bg, not the muted-gray default).
- Required indicator: 0.5rem `*` in `--danger`, in the label, screen-reader text "(required)".

**Textarea**:
- Same as input. `resize: vertical`. `min-height: 8rem`. No `max-height`.

**Form group**:
- Label above field, 0.875rem, weight 500, fg `--ink`.
- Error or helper text below field, 0.8125rem, fg `--danger` (error) or `--muted` (helper).
- All fields labeled programmatically; errors associated via `aria-describedby`.

**Status message (form-level)**:
- Single surface, bg `color-mix(in oklch, --success 8%, --surface)`, 1px border at `--success` 20% alpha, fg `--ink` with a leading 1rem icon in `--success`.
- Error variant uses `--danger`.

**Card (response, thank-you shell)**:
- bg `--surface`, 1px border `--border`, radius 12px. **No drop shadow.**
- Card header (thank-you icon, response header): no gradient; bg `--surface`, fg `--ink`, 1px bottom border `--border`. Optional 24px leading icon in `--primary` or `--accent`.
- No nested cards. No card-as-decoration.

**Icon**:
- Lucide-style stroke icons (lucide-react). Stroke 1.75, currentColor, 20px default size, scales via `width`/`height`.
- No filled variants on the same icon (no mixed fill/stroke).
- Icons used for: success marker, response marker, form-section markers. Not used as decoration.

**Link**:
- Default: fg `--accent`, underline always visible (not just on hover), underline-offset 2px.
- Hover: fg `--ink`, underline stays.
- Focus-visible: same ring as inputs.

## Motion

150-200ms on most transitions. Cubic-bezier `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quart) for enters; `cubic-bezier(0.55, 0, 1, 0.45)` for exits. Never bounce, never elastic, never spring.

Animations:

- **Input focus**: 150ms border + ring transition. No layout shift.
- **Button hover**: 120ms background transition. No transform, no scale.
- **Button loading**: inline spinner fade-in 100ms; label fades to 0.
- **Page enter on `/thank-you`**: response card content fades from `--muted` at 0.6 opacity to `--ink` at 1.0 over 250ms; entrance is one transition, no orchestrated sequence.
- **Status message**: slide-down 180ms ease-out-quart + opacity 0→1. Single element, not a coordinated set.

Reduced motion: every transition above becomes either a 0ms snap or a 100ms crossfade via `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition-duration: 100ms !important; animation-duration: 100ms !important; } }`.

No page-load choreography. No scroll-driven reveals. No parallax. No section-enter animations triggered on scroll.

## Accessibility

WCAG 2.2 AA floor. Verified:

- Body text contrast ≥ 4.5:1 against any surface it sits on. (`--ink` on `--bg` ≈ 13:1. `--muted` on `--bg` ≈ 5.4:1. Primary text on primary fill: pure white per Helmholtz-Kohlrausch, ≈ 4.6:1.)
- Large text ≥ 3:1.
- Focus rings visible on every interactive element. 2px outer ring, 2-3px offset, never removed by `outline: none` without a replacement.
- `prefers-reduced-motion` honored globally.
- Touch targets ≥ 44×44px.
- Form errors associated via `aria-describedby`. Live region for form-level status.
- Form labels programmatic, never placeholder-only.
- Inputs use the right `type` (`email`, `tel`) so mobile keyboards behave.
- Page title set per route.
- Language declared in HTML root.

## Anti-patterns (committed bans)

These are the rules PRODUCT.md sets out. They are restated here as engineering-level guards so every change can check them:

- No purple/indigo gradient headers. No gradient buttons. No gradient backgrounds on any element.
- No `box-shadow` larger than 8px blur on any element. Borders carry definition; if a shadow is needed, it is ≤ 6px blur at ≤ 8% alpha.
- No `border-radius` larger than 16px on cards, panels, sections, inputs. Buttons are 10px, inputs are 8px, the thank-you success circle is the only 50% (full pill) and is intentional.
- No 1px solid border + soft drop shadow on the same element (the "ghost card" pattern). Pick one.
- No uppercase tracked kickers above sections. If a meta label is needed, it is sentence-case at `--fs-xs` in `--muted`.
- No glassmorphism. No `backdrop-filter` blur on cards or surfaces.
- No gradient text (`background-clip: text`).
- No repeated `repeating-linear-gradient` backgrounds.
- No identical icon+title+text card grids. The thank-you response is not a 3-up feature grid.
- No "Submit Ticket" or "Contact Support" hero on the form page. The form is the work, not framed by marketing chrome.
- No sketchy SVG illustrations. No `feTurbulence` filters. No emoji as UI icons.
- No bounce, elastic, or spring easing. No `transform: translateY(-2px)` on hover (sub-pixel bouncing reads as nervous on touch devices).

## File map

```
frontend/src/
├── index.css              # tokens + global reset
├── tokens.css             # OKLCH palette, type, spacing, motion (consumed via index.css)
├── App.jsx                # form page
├── Form.css               # form layout (tokens only, no raw colors)
├── pages/
│   ├── ThankYou.jsx       # response page
│   └── ThankYou.css       # response layout (tokens only)
└── main.jsx               # router
```