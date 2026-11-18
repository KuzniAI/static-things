# Verification

Checked on 18 November 2026.

## Automated checks

```sh
node scripts/validate.mjs
node --test tests/content.test.mjs
node --check assets/app.mjs
```

All pass. The content check validates all five profiles and confirms that their avatar files exist. Tests cover Martin’s Lean 4/Druid/WoW discovery, multiple-word matching, case/diacritic handling, ordered tag deduplication, duplicate IDs, malformed interests, local avatar paths, and rejection of unsafe URL schemes and credentials.

## Browser verification

Served the repository as `/static-things/` beneath a local HTTP root to exercise a GitHub Pages-style base path. Used the in-app browser with its native dark theme at desktop size and a 390 × 844 mobile viewport.

Confirmed:

- Directory renders all five profiles with local avatars and a single labelled search box.
- `lean` and `druid` find Martin; a nonexistent tag shows the empty state; clearing restores all five people.
- Native keyboard Tab from search reaches the profile link, and Enter opens it; profile heading receives focus.
- Profile heading, avatar, bio, tags, optional personal link, interest order, and external-link attributes render correctly.
- Desktop interests use two columns; mobile uses one. Neither view overflows horizontally.
- Back to people restores the query and row focus. Browser Back restores the lower directory position and focus (Sol, approximately 708px scroll on the tested desktop viewport).
- Profile deep links survive reload at `/static-things/`; unknown IDs show a useful missing-person message and return link.
- No browser console errors or warnings during these interactions.

Light-theme and reduced-motion rules were reviewed in CSS; those media preferences were not emulated in this browser session. No screen-reader audit, cross-browser certification, or live GitHub Pages deployment was performed. Loading/fetch-error and broken-avatar fallbacks are implemented but were not deliberately induced in the browser.

## Before publication

Replace illustrative sample identities/content as appropriate, review contributed links and avatar rights, run the checks, and enable branch/root publishing in GitHub Pages. Runtime validation is a convenience, not a replacement for PR content review. No GitHub settings were changed during this implementation.
