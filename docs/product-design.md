# Into Things: static release decisions

## Intent and scope

A person-first directory for curious friends. The starting question is “what are you into?” rather than a job title, follower count, or engagement score. A profile contains a person’s own categories and answers, in their own order. The initial release is a public, read-only prototype; contributions happen through reviewed GitHub pull requests. Authentication, an editor, private profiles, analytics, and a backend are outside this release.

These decisions carry forward the approved direction from the “Explore Product Direction” conversation: bold modern typography, flat editorial layout, a shared directory/profile language, automatic themes, and visible return navigation. Earlier login/join proposals are superseded by the PR-only scope. Sample content is illustrative, including Martin’s Lean 4 and Druid interests and patch’s coding-agent experiments.

## Information and interaction

The homepage has the Into Things. brand, “Come see what everyone's into.”, one labelled search box, and compact people rows. Every row repeats the avatar, name, bio, and tags found in its profile header. The whole row is a native link: keyboard, open-in-new-tab, and copy-link behaviour remain available.

Interest answers plus author-supplied keyword aliases produce deterministic tags. This is static derivation, not a claim that an LLM is running. Categories remain self-defined. All tags appear; no important alias is hidden behind an arbitrary tag limit. A simple substring search is sufficient at this scale. Empty, loading, failed-content, missing-avatar, and unknown-profile states have explicit behaviour.

Hash routes avoid GitHub Pages rewrite requirements. Queries live in the URL. Opening a profile records the directory’s scroll position and focused row in history state. Browser Back and Back to people restore the query, scroll, and row focus during the current session. A profile opened independently returns to a filtered directory via its query-bearing back link. No personal data or credentials are stored. Scroll restoration after a full reload is left to the browser.

Profiles show optional personal links and an ordered list of interests. Desktop reads row by row across two columns; mobile keeps that same order in one column. Each entry has a category, one answer, optional explanation and links. There is no nested content or collapse interaction.

## Visual system

- Solid full-page near-white gray `#f3f4f6` or charcoal `#23252b`; no paper container, shadows, gradients, or dashboard cards.
- Accent `rgb(11, 156, 255)` on the wordmark dot, focus indicators, and small details. Darker blue text in light mode keeps links readable against the background.
- A tightly spaced bold system sans for headings and the wordmark; native monospace for small labels. No remote font requests or unavailable font dependencies. System font appearance varies by device; bundled custom typography can be considered later.
- Fine horizontal rules, open whitespace, and two editorial columns on wide screens.
- Native `prefers-color-scheme`; no account preference or theme switch required.
- A short profile entrance animation only when reduced motion is not requested. Navigation works without the animation or a View Transitions API.

## Accessibility and technical constraints

Semantic landmarks, labelled search, polite result announcements, visible keyboard focus, skip link, decorative empty avatar alt text, heading hierarchy, flexible text wrapping, and native links. The same content remains usable on small screens and with motion disabled. JSON is validated before rendering and inserted with DOM text methods, never HTML interpolation. External URLs are constrained to HTTP(S); avatars are local and have a text fallback.

There is no build pipeline or runtime dependency. Serve the repository root as static files. Optional Node checks help contributors but are not needed to deploy. Future work should preserve this contribution model until an explicit product decision changes it. ChatGPT discussions are context, not an automatically synchronized source of truth; record accepted implementation decisions here.
