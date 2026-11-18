# Adding or updating a person

Edit `data/profiles.json`, not the HTML. Keep the top-level `version` at `1`. Add one object to the `profiles` array, separated from its neighbours by commas. JSON uses double quotes and does not allow comments or trailing commas.

Here is a complete profile object (replace the example identity and URL with your own):

```json
{
  "id": "your-pseudonym",
  "name": "Your display name",
  "bio": "A little about you, in your own words.",
  "links": [
    { "label": "My website", "url": "https://example.com/" }
  ],
  "interests": [
    {
      "category": "A language I’m learning",
      "answer": "Lean 4",
      "description": "What draws me to it, or what I’m working on.",
      "keywords": ["mathematics", "formal verification"],
      "links": [
        { "label": "Lean language", "url": "https://lean-lang.org/" }
      ]
    },
    {
      "category": "Away from a screen",
      "answer": "Birdwatching"
    }
  ]
}
```

## Field guide

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | Yes | Unique lowercase letters/numbers with single separating hyphens. Stable public profile URL; changing it breaks old links. |
| `name` | Yes | Display name or pseudonym; no legal name required. |
| `bio` | Yes | Short plain-text introduction. |
| `avatar` | No | A path such as `assets/avatars/your-pseudonym.webp`. Omit for initials. |
| `links` | No | Array of personal `{ "label": "…", "url": "https://…" }` links. |
| `interests` | Yes | Nonempty array in your preferred order. |
| Interest `category` | Yes | Your own prompt or category; there is no fixed taxonomy. |
| Interest `answer` | Yes | One answer as a text string. Creates a search tag. |
| Interest `description` | No | Context, story, or explanation as plain text. |
| Interest `keywords` | No | Extra searchable tags; useful aliases such as `WoW` or `gaming`. |
| Interest `links` | No | One or more labelled links for that interest. |

Omit optional text fields rather than leaving empty strings. No nested interests, markup, Markdown, or HTML. Extra/unknown fields are rejected to catch spelling mistakes. There are no arbitrary character or interest counts enforced; keep the directory introduction compact and your profile readable.

## Tags and search

Tags are each interest’s answer followed by its keywords, in interest order. Whitespace is trimmed; case-insensitive duplicates are removed. Category labels and descriptions do not silently become tags. Search ignores case and diacritics and matches partial tags. Space-separated terms must all occur somewhere in the profile’s tags. The directory has one search box; tags themselves are labels, not additional filters. Names and bios are not searched.

## Avatars, privacy, and links

Use your own photo, artwork, or an image you have permission to publish. Credit third-party artwork and its license in the PR when required. Remember: a public repository and its history are public; avoid addresses, private contact details, or photos of others without consent.

Place a small square image (ideally 120–256 px, under 100 KB) in `assets/avatars/`. Allowed extensions: `.svg`, `.png`, `.jpg`, `.jpeg`, `.webp`; filenames contain only letters, digits, underscores, and hyphens. Use a simple **static** SVG without scripts, foreign objects, embedded external content, or event handlers. Maintainers must review SVG source; the content validator checks the path and existence, not SVG safety. Raster images are the easiest option. Remote avatar URLs are deliberately unsupported: no tracking hosts, API keys, or broken third-party avatar services. The bundled initial avatars are original placeholder artwork.

Links must be absolute HTTP(S) URLs without embedded usernames/passwords. Prefer HTTPS. `javascript:`, `data:`, relative and protocol-relative links are rejected. External links open in a new tab with `noopener noreferrer` and an accessible notice. Text is rendered as text, never inserted as HTML. Maintainers should still open and review link destinations before merging; protocol validation cannot establish that a website is trustworthy.

## Before opening the pull request

- Validate with `node scripts/validate.mjs` (Node 18+, no installation needed). It also checks avatar files exist. The JSON Schema is available for editors, and runtime validation uses the same rules as the command, with extra uniqueness and URL safety checks.
- Preview at narrow and wide widths; open your profile and check its interest order and links.
- Search for your answers and keywords. Try keyboard Tab and Enter, then Back to people.
- Include a short description of the changes and confirmation that you can publish the content and avatar.

Maintainers: review identity/content consent, image permissions, SVG source, destinations, and validation output. Merge only approved contributions. Branch-based Pages publishing serves the merged default branch.
