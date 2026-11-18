# Into Things.

**Come see what everyone's into.** A small directory of people, told through their interests.

This is a working static prototype: HTML, CSS, vanilla JavaScript, and a JSON file. No accounts, backend, package installation, or build step. The directory currently features Damian.

## Preview locally

From this repository, run:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000>. Use an HTTP server rather than opening `index.html` directly: browsers restrict fetching JSON from `file://` URLs.

## Add yourself

1. Fork the repository and create a branch (or use GitHub’s file editor).
2. Add your profile to the `profiles` array in [`data/profiles.json`](data/profiles.json). Copy the [complete example and field guide](docs/contributing.md).
3. Optionally add an avatar to `assets/avatars/`. Omit it for an initials fallback.
4. Preview your profile and search tags. If Node 18+ is available, run:

   ```sh
   node scripts/validate.mjs
   node --test tests/content.test.mjs
   ```

5. Open a pull request with your content and avatar. Maintainers review and merge it; the deployed directory then updates. There is no website editor or login.

The JSON array order controls the directory order, and your interest array order controls your profile. Set a profile’s `tags` array to choose its displayed and searchable tags. If `tags` is omitted, tags are derived from each interest’s **answer and optional keywords**. An empty array hides all tags. No LLM runs. Search matches these tags, case-insensitively; multiple words must all appear across a person’s tags.

## Deploy on GitHub Pages

1. Push these files to your repository’s default branch (typically `main`).
2. In **Settings → Pages → Build and deployment**, choose **Deploy from a branch**.
3. Select your branch and **/ (root)**, then Save.
4. Wait for GitHub’s Pages deployment to finish. For this repository the expected address is <https://KuzniAI.github.io/static-things/>; use the address GitHub reports.

See [GitHub’s publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) for the hosting settings. No custom workflow or build command is necessary. `.nojekyll` keeps this a plain static site. All application assets and the JSON request use relative URLs; hash-based profile routes such as `#person/martin` work on repository paths and survive reloads without server rewrites. Keep assets, data, and `index.html` together when hosting elsewhere.

## Project map

- `index.html` — shared page shell and directory/search landmarks.
- `assets/style.css` — flat responsive design, system light/dark themes, reduced motion support.
- `assets/app.mjs` — rendering, navigation, query and scroll restoration.
- `assets/content.mjs` — shared content validation, tags, and search logic.
- `assets/avatars/` — bundled profile images.
- `data/profiles.json` — the only content file friends need to edit.
- `data/profiles.schema.json` — JSON Schema for editor assistance.
- `scripts/validate.mjs` and `tests/` — optional dependency-free Node checks.
- [Contribution guide](docs/contributing.md) — fields, example, avatars, links, and PR review.
- [Product and design decisions](docs/product-design.md) — scope and interaction rationale.
- [Verification notes](docs/verification.md) — automated and browser checks.

The existing [Apache 2.0 license](LICENSE) is preserved. Only contribute material you can publish under this repository’s terms. This repository is the implementation record. The ChatGPT project can hold ongoing product discussions; it does **not** automatically sync with GitHub.
