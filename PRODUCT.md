# Product

## Register

product

## Users

End customers with an active problem — billing, account access, a broken feature — who want a fast, accurate answer in under 30 seconds. They arrive frustrated, often on mobile, sometimes under bad lighting or with shaky connectivity. They are not browsing; they are blocked. Success means they leave with a real answer and the impression that the company takes them seriously.

Internal context (not the user, but a constraint): support engineers review these tickets downstream. The data captured — name, contact, the question as typed — needs to be exact and durable. The UI must not interfere with that.

## Product Purpose

This product converts a customer problem into a grounded answer. A user submits a question; the system classifies it, retrieves verified knowledge, and returns a contextual response that is either immediately useful or clearly sets up human follow-up. The product exists to make the first 60 seconds of support feel competent — not cheerful, not performative, competent.

Success looks like: a customer lands, types their question, gets an answer they can act on, and trusts the system enough to come back. No one should have to wait, no one should have to guess what to write, no one should have to interpret a templated apology as progress.

## Brand Personality

Calm, expert, trustworthy. The bar is the tool disappearing into the task. Three words: competent, plain, present.

Voice is direct, sentence-case, no exclamation marks, no apology cascades ("We're sorry for the inconvenience"). When there is an error, it names the error and gives the next action. When there is success, it states the outcome and stops. The interface should read like a competent colleague, not a marketing campaign.

Reference behavior: Linear's restraint, Stripe's form discipline, Raycast's command clarity. The opposite of a friendly-bot voice.

## Anti-references

Generic SaaS template — purple/indigo gradient headers, 20px-plus rounded cards, paired soft drop shadows on white surfaces, "Submit Ticket" buttons, identical icon-plus-title-plus-text card grids. The current code is exactly this and gets fully replaced.

AI slop reflexes — all-caps tracked kickers above every section, glassmorphism as default, gradient text, hand-drawn sketchy SVG illustrations, repeating-linear-gradient stripe backgrounds, hero-metric templates (big number + small label), numbered section markers as default scaffolding.

Customer-service cliche — "We're here to help!", "Our team will get back to you shortly", sympathetic filler copy, exclamation marks, decorative niceness that adds no information. Plain, direct, confident copy only.

## Design Principles

Show competence through craft, not copy. Every component earns its place by being precise — fields are tight, focus rings are visible, errors are specific. The interface is honest about what just happened and what comes next.

Restraint is the floor, not the ceiling. One accent color used for primary action and current state only. Decorative motion is forbidden. Display fonts are forbidden in UI labels, buttons, data. System sans, fixed rem scale, earned familiarity.

Respect the customer's time. The form must be skimmable. Required-state must be obvious. The submit affordance must never move or change shape between idle, hover, focus, loading. Submitting must produce a visible outcome within 2 seconds or a visible in-progress state within 100 ms.

The brand is the answer, not the wrapper. Color and typography carry personality. Imagery, illustration, and emoji do not. If the answer is good, the chrome stays out of the way.

## Accessibility & Inclusion

WCAG 2.2 AA, ship-ready, no exceptions. Body text contrast ≥ 4.5:1 against its background; large text (≥ 18px or bold ≥ 14px) ≥ 3:1. Placeholder text hits the same 4.5:1 as body, not a muted gray default. Focus rings are visible on every interactive element, including on custom controls, and never removed.

prefers-reduced-motion: every animation and transition has an alternative — typically a crossfade or instant change. No content is gated on a class-triggered reveal that pauses on hidden tabs.

Mobile-first responsive: layout works at 320px width without horizontal scroll, and the form remains usable one-handed. Input types are correct (email, tel) so mobile keyboards behave. Touch targets ≥ 44px.

Form-specific a11y: every field has a programmatic label, every error is associated with its field via aria-describedby, the submit button announces loading state, and validation messages are announced via a polite live region.