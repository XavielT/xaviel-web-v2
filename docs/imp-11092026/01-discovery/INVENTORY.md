# INVENTORY — Phase 0 Discovery

Date: 2026-09-11
Author: Claude Opus 5 (1M context), read-only discovery pass
Scope: `xaviel-web-v2` (personal site) + `tu-gasolina-rd` ("Tu Combustible RD")

---

## 0. Read this before anything else — two blocking discrepancies

### 0.1 The context package this phase was told to read does not exist

The prompt instructed me to read:

- `docs/imp-11092026/00-context/01-project-brief.md`
- `docs/imp-11092026/00-context/02-architecture-decisions.md`
- `docs/imp-11092026/00-context/03-conventions.md`
- `docs/imp-11092026/01-discovery/TEMPLATE-inventory.md`

**None of these exist.** Verified: `docs/` is absent from both site checkouts, and a
filesystem search under `/home/xaviel` (depth 4) for `imp-11092026` or
`TEMPLATE-inventory.md` returns nothing. This document is therefore structured against
the ten numbered investigation areas in the Phase 0 prompt itself, not against the
template.

Direct consequences:

- **Acceptance criterion "every `{{PLACEHOLDER}}` used by later prompts has a value"
  cannot be satisfied** — the placeholder table lives in the missing template. I have
  supplied a best-effort placeholder table in §11 derived from what later phases are
  described as needing, but it is my invention, not the package's.
- **Acceptance criterion "conflicts between the ADRs and reality are reported"
  cannot be satisfied** — there are no ADRs to compare against. §12 lists instead the
  assumptions *embedded in the Phase 0 prompt's own wording* that the code contradicts,
  which is the nearest available substitute.

### 0.2 The designated working directory is a stale checkout

| | Primary working dir | Actual current site |
|---|---|---|
| Path | `/home/xaviel/dev/xaviel-web-v2` | `/home/xaviel/dev2/xaviel-web-v2` |
| Branch | `develop` | `main` |
| HEAD | `430b21e` | `9a40301` |
| HEAD date | 2026-05-01 | 2026-09-04 |
| Has Apps section / Music Hub | **No** | **Yes** |
| `git remote -v` | `git@github.com:XavielT/xaviel-web-v2.git` | same remote |

Both checkouts track the same GitHub remote. `dev2` is **5 commits ahead** of the `dev`
checkout's HEAD:

```
9a40301 fix(navbar): let the pill hug its links instead of a fixed width
73fe339 fix(navbar): bound the link row by the pill, whatever the label length
5a2edcf fix(navbar): keep the links inside the pill with 7 items
7e19bdb fix: point the Android button at the releases page
9b201c0 feat: Apps section with Music Hub          <-- the pattern this phase must document
430b21e Add real links on projects, ...            <-- HEAD of /home/xaviel/dev checkout
```

The `dev` checkout's `origin/*` refs are stale (last fetched ~May 2026), so
`git log origin/main` there still shows `430b21e` and gives no hint that it is behind.

**Everything in §1–§7 of this document describes `/home/xaviel/dev2/xaviel-web-v2`,**
because that is the code that is actually deployed and that contains the Music Hub
integration. All file paths in §1–§7 are relative to that directory unless stated.

**Recommendation before Phase 1:** confirm which checkout is canonical and run later
phases there. Running Phase 1+ against `/home/xaviel/dev/xaviel-web-v2` would edit a tree
that is missing the entire Apps section, `app-card` component, and `AppCard` model.

**Resolved 2026-09-11:** the owner confirmed `/home/xaviel/dev2/xaviel-web-v2` is
canonical. This document now lives there; the docs-only branch briefly created in the
stale checkout was removed. See §0.3.

### 0.3 Decisions taken (2026-09-11)

Two of the questions this document raised have been answered by the owner. They are
recorded here because they collapse most of §9 and change what later phases are for.

| Question | Answer | Consequence |
|---|---|---|
| §14 Q1 — link out, or host the app on the site? | **Link out**, exactly like Music Hub | §9's hosting risks (framework incompatibility, 5.1 MB bundle vs the 1 MB budget, router ownership, CSS collision, TS/toolchain divergence) **do not apply**. The site change is one `AppCard` entry plus an icon. |
| §14 Q2 — which checkout is canonical? | **`/home/xaviel/dev2/xaviel-web-v2`** | §1–§7 already describe this tree, so they stand as written. Later phases run here. |

**What this leaves as the only real blocker (§14 Q3):** the app has nothing to link *to*
yet. Verified 2026-09-11:

- **Web app: not deployed.** No live URL exists. The 5.1 MB `dist/` export is local only.
- **Android: a release exists but carries no APK.** `XavielT/tu-combustible-rd` has tag
  and release **v1.1.0** (2026-08-19) — but `gh release view` reports **zero assets**, so
  `releases/latest` would land the visitor on a page with nothing to download. This is a
  softer failure than a 404, but still a dead end.

Because `app-card.html` renders an empty `url`/`apkUrl` as a disabled "coming soon"
button (§3.2 step 6), the card **can ship now** and light up as each target appears. That
is exactly the case the component was built for.

---

## 1. Site stack

Source: `package.json`, `angular.json`, `tsconfig.json`, `vercel.json`.

| Item | Value | Evidence |
|---|---|---|
| Framework | **Angular 21** (`@angular/core` `^21.0.0`) | `package.json:26` |
| Router type | **Angular Router, standalone bootstrap — but effectively a single-page scroll site.** `provideRouter(routes)` is wired, `routes` is an **empty array**. Navigation is anchor links to `#section` ids. | `src/app/app.routes.ts:3` (`export const routes: Routes = [];`), `src/app/app.config.ts:9`, `src/app/components/navbar/navbar.html:13-38` |
| TypeScript | Yes, `~5.9.2`, `strict: true` plus `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`; Angular `strictTemplates: true` | `tsconfig.json:6-25` |
| Styling system | **Plain CSS**, per-component `styleUrl`, with global CSS custom properties. Tailwind 3.4.19 is installed and configured with prefix `tw-` but **is not used in any template** — grep for `tw-` in `src/**/*.html` returns nothing. | `tailwind.config.js`, `postcss.config.js`, `src/styles.css`, and commit `9b201c0`'s own message: *"Tailwind is configured with a `tw-` prefix here but is not actually used in the markup"* |
| Component library | None. All components hand-written standalone Angular components. | `src/app/shared/**` |
| State management | None. Angular `signal()` for local UI state only (hover, menu open, active section). | `src/app/app.ts:28-36`, `src/app/components/navbar/navbar.ts:10,31` |
| Data fetching | One `fetch` to `/api/contact` from the contact form. No other network I/O. | `src/app/components/contact-form/contact-form.ts` |
| Package manager | **npm 10.9.2** (pinned via `packageManager`) | `package.json:17` |
| Test setup | `@angular/build:unit-test` builder + **vitest 4.0.8** + jsdom. 10 `*.spec.ts` files exist (default CLI scaffolds). **No test script beyond `ng test`; no evidence tests are run in CI.** | `angular.json` (`architect.test`), `package.json` devDeps, `find src -name "*.spec.ts"` → 10 |
| Lint | **None.** No ESLint config, no `lint` script. | no `.eslintrc*`/`eslint.config.*` in repo |
| Format | **Prettier**, configured inline in `package.json` (`printWidth: 100`, `singleQuote: true`, Angular parser for HTML). No `.prettierrc`. No format script. | `package.json:8-16` |
| Hosting target | **Vercel.** Static SPA output + one serverless function. | `vercel.json`, `.vercel/` present |
| Deploy pipeline | Vercel Git integration (inferred — no GitHub Actions workflow exists in the repo). `buildCommand: npm run build`, `outputDirectory: dist/portfolio-v2/browser`, SPA rewrite of `/(.*)` → `/index.html` after `filesystem`, and `/api/(.*)` → `/api/$1`. | `vercel.json` |
| Node version | **UNKNOWN — not pinned anywhere.** No `engines` field, no `.nvmrc`, no `.node-version`, no Vercel Node setting in `vercel.json`. Whatever Vercel's project default is. | verified absent |
| Analytics | Vercel Analytics, injected at bootstrap | `src/main.ts:4-6` |

### Serverless API

`api/contact.ts` — a Vercel Node function using **Resend** (`resend@^6.9.3`) to email the
contact form. Validates name/email/topic/message, has a honeypot field `company`. Reads
`process.env.RESEND_API_KEY`. `api/` has its own `package.json` and `tsconfig.json`
(added in commit `a32a627`). Local dev proxies `/api` to the deployed site
(`proxy.conf.json` → `https://xavielweb.vercel.app`) rather than running the function
locally.

---

## 2. Site structure

```
xaviel-web-v2/
├── angular.json            # single project "portfolio-v2", sourceRoot src/, assets from public/
├── vercel.json             # build cmd, output dir, SPA + /api routing
├── proxy.conf.json         # dev-only: /api -> https://xavielweb.vercel.app
├── tailwind.config.js      # prefix "tw-", content src/**/*.{html,ts} — configured, unused
├── postcss.config.js
├── tsconfig{,.app,.spec}.json
├── api/
│   ├── contact.ts          # Vercel serverless fn (Resend)
│   ├── package.json        # separate deps for the function
│   └── tsconfig.json
├── public/                 # copied wholesale to output root (angular.json assets glob **/*)
│   └── assets/
│       ├── apps-imgs/      # <-- app icons. music-hub.png lives here
│       ├── projects-imgs/
│       ├── skills-icons/
│       ├── certificates-imgs/ , certificates-pdfs/
│       ├── icons/ , img/ , fonts/ , textures/ , pdfs/
└── src/
    ├── index.html          # <html lang="en">, title "PortfolioV2", <app-root>
    ├── main.ts             # bootstrapApplication + Vercel analytics inject()
    ├── styles.css          # global CSS variables (--Hub etc.)
    └── app/
        ├── app.ts          # ROOT COMPONENT — holds ALL page data arrays
        ├── app.html        # ALL page sections inline
        ├── app.css
        ├── app.routes.ts   # empty Routes array
        ├── app.config.ts
        ├── components/     # page-level: navbar, footer, xlogo, contact-form
        └── shared/
            ├── components/ # card, app-card, certificate-card, progress-bar-card, maintenance
            ├── models/     # app-card.model.ts, project-card.model.ts, skill.model.ts, certificate.model.ts
            └── ui/         # badge
```

**Unusual / worth noting:**

- There are **no routes**. The entire site is one component (`App`) rendering every
  section in `app.html`. Adding a *routed* app would be the first route in the project.
- `src/app/app.component` is an **empty directory** left behind by a rename. Harmless.
- Section ids in `app.html` are the navigation contract: the navbar's
  `IntersectionObserver` (`navbar.ts:12-29`) observes *every* `<section>` and sets
  `activeSection` from `entry.target.id`. A new `<section id="x">` is picked up with zero
  navbar TS changes — only a `<li>` in `navbar.html`.
- A second reveal-on-scroll `IntersectionObserver` lives in `app.ts:49-63`, keyed off the
  `.reveal` class.
- `public/` is copied to the output **root**, so `public/assets/x.png` is served at
  `/assets/x.png`.

---

## 3. MUSIC HUB INTEGRATION — the critical section

### 3.1 Verdict

**(c) — a separate deploy that is merely linked to.**

There is **no Music Hub code in the site repo at all**. Music Hub is an independent
Angular 19 + Capacitor application living in its own repository
(`/home/xaviel/dev2/music-hub`, GitHub `XavielT/music-hub`) with its own Vercel
deployment at `https://music-hub-xaviel.vercel.app`. The site's entire "integration" is a
**data entry in a hardcoded array plus a presentational card with two external
`<a target="_blank">` links, and one PNG icon copied across repos.**

This is high-confidence, not inferred. Evidence:

- The complete integration is commit `9b201c0` (`feat: Apps section with Music Hub`,
  2026-09-03). Its **entire** diff is 9 files, +238/-2 lines:
  ```
  public/assets/apps-imgs/music-hub.png            | Bin 0 -> 49085 bytes
  src/app/app.css                                  |  19 +++-
  src/app/app.html                                 |  12 +++
  src/app/app.ts                                   |  21 +++-
  src/app/components/navbar/navbar.html            |   4 +
  src/app/shared/components/app-card/app-card.css  | 122 +++++++++++++++++++++++
  src/app/shared/components/app-card/app-card.html |  25 +++++
  src/app/shared/components/app-card/app-card.ts   |  25 +++++
  src/app/shared/models/app-card.model.ts          |  12 +++
  ```
- No iframe, no micro-frontend, no module federation, no mounted bundle, no workspace, no
  local package: `package.json` has no workspaces field and no `music-hub` dependency;
  grep for `iframe` in `src/**` returns nothing.

### 3.2 End-to-end trace, entry point → app rendering

1. **Navbar link** — `src/app/components/navbar/navbar.html:24-27`
   ```html
   <li>
     <a class="nav-link" href="#apps" (click)="closeMenu()"
        [class.active]="activeSection() === 'apps'">Apps</a>
   </li>
   ```
   Placed between "Main Projects" and "SKills". No TS change was needed — the
   `IntersectionObserver` in `navbar.ts:12-29` observes all `<section>` elements
   generically.

2. **Section markup** — `src/app/app.html:121-131`
   ```html
   <!-- ---------Apps--------- -->
   <section id="apps" class="container apps-container">
     <div class="main-title-container">
       <h3 class="main-title">Apps</h3>
       <span class="main-span">Things you can install and use</span>
     </div>
     <div class="apps-cards">
       <app-app-card *ngFor="let app of apps" [app]="app"></app-app-card>
     </div>
   </section>
   ```
   Sits between the `#main-projects` and `#skills` sections.

3. **Catalog entry (the registration)** — `src/app/app.ts:78-93`, a hardcoded array field
   on the root `App` component:
   ```ts
   apps: AppCardModel[] = [
     {
       icon: '/assets/apps-imgs/music-hub.png',
       name: 'Music Hub',
       description:
         'A personal music app: upload your own songs, they sync across every device through Supabase, and download them for offline listening. Installable on iPhone and desktop, with a native Android build.',
       badges: ['Angular', 'Capacitor', 'Supabase', 'PWA'],
       url: 'https://music-hub-xaviel.vercel.app',
       // Points at the releases page rather than the direct
       // releases/latest/download/music-hub.apk asset: that direct URL 404s
       // whenever no release is published, while this page never breaks and
       // always offers the newest build.
       apkUrl: 'https://github.com/XavielT/music-hub/releases/latest',
       iosHint: 'On iPhone: open the app in Safari, then Share → Add to Home Screen.',
     },
   ];
   ```

4. **Model** — `src/app/shared/models/app-card.model.ts` (complete file):
   ```ts
   export interface AppCard {
     icon: string;
     name: string;
     description: string;
     badges: string[];
     /** Live web app. Empty string renders the button as "coming soon". */
     url: string;
     /** Android APK. Empty string renders the button as "coming soon". */
     apkUrl: string;
     /** Shown under the buttons for iPhone users. */
     iosHint?: string;
   }
   ```

5. **Card component** — `src/app/shared/components/app-card/app-card.ts`, standalone,
   selector `app-app-card`, single `@Input() app`, two getters `hasWebApp` / `hasApk`
   that are simply `!!this.app.url` / `!!this.app.apkUrl`. Imports the shared `Badge`.

6. **Card template** — `src/app/shared/components/app-card/app-card.html`: icon + name +
   badges, description, then the actions:
   ```html
   <a *ngIf="hasWebApp" class="app-card-btn app-card-btn-primary" [href]="app.url"
      target="_blank" rel="noopener noreferrer">Open app</a>
   <span *ngIf="!hasWebApp" class="app-card-btn app-card-btn-disabled"
         title="Coming soon">Open app</span>

   <a *ngIf="hasApk" class="app-card-btn" [href]="app.apkUrl"
      target="_blank" rel="noopener noreferrer">Android APK</a>
   <span *ngIf="!hasApk" class="app-card-btn app-card-btn-disabled"
         title="Coming soon">Android APK</span>
   ```
   An empty-string `url`/`apkUrl` degrades to a disabled span with a "Coming soon"
   tooltip — deliberate, so a card can ship before its target exists.

7. **Rendering** — the user clicks "Open app" and **leaves the site** for
   `music-hub-xaviel.vercel.app` in a new tab. Music Hub never renders inside the
   portfolio. Nothing of Music Hub is bundled, proxied, or embedded.

### 3.3 Per-question answers

| Question | Answer |
|---|---|
| Entry point from app listing | Navbar `#apps` anchor → `<section id="apps">` → `*ngFor` over `apps` → `app-app-card` → external `<a target="_blank">` |
| Every route it owns **in the site** | **Zero.** `app.routes.ts` is an empty array. Music Hub owns no site route, no path prefix, nothing. |
| Where its code lives | Entirely outside this repo: `/home/xaviel/dev2/music-hub` (GitHub `XavielT/music-hub`). |
| How assets are handled | **One file, copied by hand**: `public/assets/apps-imgs/music-hub.png` (49 KB), duplicated from the music-hub repo. No sync, no build step, no symlink. Referenced by the absolute path `/assets/apps-imgs/music-hub.png`. |
| Own build step | **None in the site.** Music Hub builds and deploys independently (its own `vercel.json`, `render.yaml`, `.github/` workflows, Capacitor Android build). The site's `npm run build` is untouched by it. |
| Styling relative to the site | `app-card.css` (122 lines) is written in the **site's** plain-CSS idiom using the site's existing CSS variables (`--Hub`, `--HubShadow`) and `.reveal` pattern — explicitly *not* Tailwind. Music Hub's own styling is irrelevant; it never renders here. |
| Shares layout / nav | No. Once the user clicks through, they are on a different origin with its own shell. |
| Stores data, and where | Not in the site. Music Hub stores its own data in **Supabase** (project **x-core**) — see §7. The site persists nothing. |
| Registered in a catalog/config/CMS | The `apps: AppCardModel[]` literal at `src/app/app.ts:78`. |
| Hardcoded or data-driven | **Hardcoded** — a TypeScript array literal compiled into the bundle. No JSON, no MDX, no CMS, no API. Changing an app requires a code edit and a redeploy. |

### 3.4 Friction in the pattern (what a repeat costs)

Verified from the diff — reproducing this pattern for a new app requires:

1. **Manually copy the icon** from the app repo into
   `public/assets/apps-imgs/<app>.png`. Nothing keeps the two copies in sync; if the app
   changes its icon, the site silently keeps the old one.
2. **Append one object** to `apps` in `src/app/app.ts` (the description text is
   hand-maintained prose duplicating what the app's own README/store listing says).
3. **No second config edit is required** for the section itself — the navbar `<li>`
   already exists and the `*ngFor` picks up new entries. The commit message's claim
   *"a future app is one entry"* is accurate **for the link-out pattern**.
4. **Redeploy the whole site** to change any app metadata.
5. Version/status drift: the card hardcodes an APK link to
   `releases/latest` (deliberately, to avoid the 404 that a direct
   `releases/latest/download/*.apk` URL gives when no release exists — see the inline
   comment at `app.ts:86-89`). There is no "version", "status", or "updated" field on
   `AppCard`, so the site cannot show whether an app is alpha, live, or abandoned.

**The pattern is cheap precisely because it integrates nothing.** See §9 for why this
matters for Tu Combustible RD.

---

## 4. App catalog

- **Mechanism:** a hardcoded TypeScript array literal, `apps: AppCardModel[]`, declared
  as a field on the root component `App` — `src/app/app.ts:78-93`. Not MDX, not JSON, not
  a database, not a CMS.
- **Shape:** the `AppCard` interface (`src/app/shared/models/app-card.model.ts`) —
  reproduced in full in §3.2 step 4. Fields: `icon`, `name`, `description`, `badges[]`,
  `url`, `apkUrl`, `iosHint?`.
- **Current contents:** exactly one entry, Music Hub.
- **Sibling arrays in the same file**, same style — the site keeps *all* content this way:

  | Array | Model | File | Count |
  |---|---|---|---|
  | `apps` | `AppCard` | `shared/models/app-card.model.ts` | 1 |
  | `projects` | `ProjectCard` (`image, title, description, badges[], url?, variant?`) | `shared/models/project-card.model.ts` | 4 |
  | `skills` | `Skill` | `shared/models/skill.model.ts` | 12 |
  | `certificates` | `Certificate` | `shared/models/certificate.model.ts` | 3 |

- **Fit for Tu Combustible RD:** as a *link-out card* it fits perfectly — one new object
  with `icon`, `name`, `description`, `badges: ['Expo','React Native','SQLite'…]`, `url`,
  `apkUrl`, `iosHint`. **What the shape does not express:** no `status`/`version` field,
  no route/internal-link option (`url` is always rendered as an external
  `target="_blank"` anchor), no ordering/`featured` flag, no per-app tags beyond
  `badges`, no "requires sign-in" affordance. If Tu Combustible RD is to be *hosted* on
  the site rather than linked, `AppCard` needs at minimum a way to express an internal
  route — the template hardcodes `target="_blank" rel="noopener noreferrer"`.
- **Note:** `apps` and `projects` are deliberately distinct concepts — the commit message
  for `9b201c0` frames Apps as *"things visitors can actually install and use, as opposed
  to the source-code projects above it."* Tu Combustible RD belongs in `apps`.

---

## 5. Existing i18n

**There is none.** Verified absent:

- No i18n library in `package.json` (no `@angular/localize`, `ngx-translate`, `transloco`,
  `@ngx-i18nsupport`, nothing).
- No `$localize` / `i18n` attributes anywhere in `src/**`.
- No locale files, no `locales/` directory, no `messages.xlf`.
- No locale config in `angular.json` (no `i18n` block, no `localize` option).
- `tsconfig.json:19` has `"enableI18nLegacyMessageIdFormat": false` — this is the Angular
  CLI's **default scaffold value**, present in every new Angular app. It is not evidence
  of i18n work.
- `src/index.html:2` — `<html lang="en">`, static, never changed at runtime.

### String inventory (scope for Phase 1)

All user-facing copy is currently **English**, with two locations:

| Location | Approx. count | Notes |
|---|---|---|
| `src/app/app.html` | ~23 text nodes | all section headings, subtitles, about-me prose |
| `src/app/components/contact-form/contact-form.html` | ~16 text nodes | labels, options, button copy |
| `src/app/components/navbar/navbar.html` | 7 | nav labels; these double as `activeSection` display |
| `src/app/components/footer/footer.html` | 5 | |
| `src/app/shared/components/app-card/app-card.html` | 4 | `Open app`, `Android APK`, ×2 for the disabled variants; plus `title="Coming soon"` |
| `src/app/shared/components/maintenance/maintenance.html` | 2 | |
| `src/app/components/xlogo/xlogo.html` | 2 | |
| `src/index.html` | 1 | `<title>PortfolioV2</title>` |
| `placeholder` / `alt` / `title` attributes across all templates | 18 | |
| **Data arrays in `src/app/app.ts`** | **26** `name`/`title`/`description`/`iosHint` values | projects (4×2), apps (1×3), skills (12 names), certificates (3 names) — **prose lives in TypeScript, not templates** |
| `src/app/components/contact-form/contact-form.ts` | ~5 | alert/status messages |
| `api/contact.ts` | ~8 | server error strings + the email body HTML template |

**Rough total: ~110 user-facing strings**, of which roughly a quarter sit inside `.ts`
data arrays rather than templates. *(Counts are grep-based approximations — mechanical
`>text<` node counting — and should be treated as a scoping estimate, not an exact
figure. Marked as inferred.)*

**Phase 1 implication:** Angular's built-in `$localize`/`i18n` extraction only covers
templates. The ~26 strings in `app.ts` data arrays and the API's strings would need a
different mechanism (or the arrays need to move into a locale-aware structure). Worth
deciding before Phase 1 picks a library. Also note the site is written in English while
**Tu Combustible RD is written entirely in Spanish** (§8) — the two will collide.

---

## 6. Existing auth

**None. There is no authentication of any kind in the site.**

Verified absent: no Supabase, no NextAuth (not applicable — Angular), no Clerk, no Auth0,
no Firebase Auth, no session handling, no login route (there are no routes at all), no
guard, no interceptor, no cookie/JWT handling. Grep for `supabase|next-auth|clerk|@auth`
across `src/`, `api/`, and all config returns only the two *prose* mentions of "Supabase"
in the Music Hub card copy (`src/app/app.ts:83` description text and `:84` badge string).

**No Supabase client is configured in the site.** The only backend credential the site
holds is `RESEND_API_KEY` (see §7).

---

## 7. Supabase / x-core

### In the site repo: zero code references

Every occurrence of the string "Supabase" in `xaviel-web-v2` is **display copy about
Music Hub**:

- `src/app/app.ts:83` — inside the Music Hub `description` string.
- `src/app/app.ts:84` — `badges: ['Angular', 'Capacitor', 'Supabase', 'PWA']`.

No `@supabase/supabase-js` dependency, no client init, no env vars, no SSR/middleware
session handling (the site is a static SPA — there is no server to hold a session; the
only server code is the stateless `api/contact.ts`), no generated database types.

### Site environment variables (values redacted)

| Var | File | Purpose |
|---|---|---|
| `RESEND_API_KEY` | `.env`, `.env.local` | Resend email for the contact form |
| `VERCEL_OIDC_TOKEN` | `.env.local` (Vercel CLI–generated) | Vercel tooling |

`.gitignore` covers `.env*` and `.env*.local` — neither is committed.

### x-core: found, but only in the Music Hub repo

"x-core" is the name of the **shared Supabase project backing all of Xaviel's personal
apps**. It appears nowhere in the site or in Tu Combustible RD — only in music-hub:

- `/home/xaviel/dev2/music-hub/src/environments/environment.ts:3` —
  `// Project: x-core (shared backend for all personal apps).`
- `/home/xaviel/dev2/music-hub/src/environments/environment.development.ts:2` —
  `// Same x-core project as production — there is no separate dev project.`

**This is the single most important cross-cutting fact for Phase 5.** Details:

| Item | Value | Evidence (paths under `/home/xaviel/dev2/music-hub`) |
|---|---|---|
| Client library | `@supabase/supabase-js` `^2.114.0` | `package.json` |
| Client init | `createClient(environment.supabaseUrl, environment.supabaseAnonKey, {...})` | `src/shared/services/supabase.service.ts:2,35` |
| Config vars | `supabaseUrl`, `supabaseAnonKey`, `siteUrl`, `updateRepo` — **committed to the repo as plain `environment.ts` files**, not env vars. The file states this is deliberate: *"The anon key is public-safe (RLS protects the data), so these files stay committed."* | `src/environments/environment.ts`, `environment.development.ts` |
| Dev vs prod projects | **The same project.** *"there is no separate dev project."* | `environment.development.ts:2` |
| SSR / middleware session handling | **None** — Music Hub is a client-side Angular SPA; the Supabase JS client handles sessions in browser storage. | no SSR setup in `angular.json` |
| Generated DB types | **No.** No `database.types.ts`, no `supabase gen types` script. The client is untyped (`SupabaseClient` with no generic parameter at `supabase.service.ts:35`). | verified |
| Edge functions | Two: `supabase/functions/link-metadata/index.ts`, `supabase/functions/admin-users/index.ts` | |
| Auth surface | Real auth exists in Music Hub: `src/app/pages/auth/`, `src/app/pages/auth-reset/`, `src/app/pages/admin/`. Password reset emails point at `environment.siteUrl` because the Capacitor WebView's `location.origin` is `https://localhost`. | `environment.ts` comment block |

**Two risks to flag now, both verified:**

1. **A live Supabase anon JWT is committed in plaintext** at
   `music-hub/src/environments/environment.ts`. It decodes to project ref
   `nakgrkcqyuycadeuenuw`, role `anon`, `exp` 2104037565 (≈ year 2036). The author
   documents this as intentional and RLS-protected. It is defensible for an anon key
   **only if RLS is actually enforced on every table** — I did not verify the RLS
   policies (no DB access), so this is **unverified**. If Phase 5 puts Tu Combustible RD's
   vehicle/fill-up data in the same project, that assumption becomes load-bearing for a
   second app's data.
2. **Prod and dev share one project.** Any Phase 5 migration testing writes to production
   data.

---

## 8. TU COMBUSTIBLE RD — full profile

Repo: `/home/xaviel/dev2/tu-gasolina-rd` (directory name `tu-gasolina-rd`, package/app
name `tu-combustible-rd` / "Tu Combustible RD"). All paths in this section are relative
to it.

### 8.1 Stack

| Item | Value | Evidence |
|---|---|---|
| Framework | **Expo SDK 57 / React Native 0.86.2**, `expo-router` ~57.0.14 (file-based routing) | `package.json` |
| React | **19.2.3** (+ `react-dom` 19.2.3, `react-native-web` ~0.21.0) | `package.json` |
| Entry | `expo-router/entry` | `package.json:main` |
| TypeScript | **~6.0.3**, `typedRoutes: true` experiment enabled | `package.json`, `app.json` |
| Build tooling | **Metro** bundler via Expo; **EAS Build** for Android (`eas.json`); Capacitor **not** used | `eas.json`, `app.json` |
| Package manager | npm (`package-lock.json`, no other lockfile) | |
| Version | app `1.1.0`, Android `versionCode: 2`, package `com.xavieltucombustiblerd.app` | `app.json` |
| Web support | **Yes and already proven** — `app.json` sets `web.bundler: "metro"`, `web.output: "static"`, and a **5.1 MB static export already exists in `dist/`** (dated 2026-08-21) with per-route HTML files. | `app.json`, `dist/` |
| Test setup | **None.** No test script, no test framework, no test files. | `package.json` |
| Lint/format | **None.** No ESLint, no Prettier config. | |
| Scheme | `tucombustiblerd` (deep links) | `app.json` |

### 8.2 Route / screen inventory

File-based (`expo-router`). Root stack in `app/_layout.tsx`, tabs in `app/(tabs)/_layout.tsx`.

| Route | File | LOC | What it does |
|---|---|---|---|
| `/(tabs)` → `index` | `app/(tabs)/index.tsx` | 140 | **Inicio.** Dashboard for the active vehicle: spend this month, latest km/gal, average economy, an insight line, and a `PriceBoard` of reference prices. Vehicle switcher. |
| `/(tabs)/cargar` | `app/(tabs)/cargar.tsx` | 72 | **Cargar.** Log a fill-up via `FillUpForm`; on save runs `reviewFillUp()` and alerts with computed economy. Form resets on focus. |
| `/(tabs)/historial` | `app/(tabs)/historial.tsx` | 110 | **Historial.** Fill-up list, newest first, filterable by fuel type chips; each row shows date, volume, money, km and computed economy. Tap → edit. |
| `/(tabs)/cifras` | `app/(tabs)/cifras.tsx` | 241 | **Cifras.** Analytics: monthly spend buckets (last 6 months), distance in logs, per-fuel-type breakdown, economy trend. Largest screen. |
| `/(tabs)/mas` | `app/(tabs)/mas.tsx` | 139 | **Más.** Vehicle list/switch/delete, link to reference prices, link to Gastos, **JSON backup export / import**, "borrar todos los datos". |
| `/onboarding` | `app/onboarding.tsx` | 22 | First-run vehicle creation. `(tabs)/_layout.tsx:21-23` redirects here whenever `data.vehicles.length === 0`. |
| `/vehiculo` | `app/vehiculo.tsx` | 22 | Add/edit vehicle. Presented as a **modal**. |
| `/gastos` | `app/gastos.tsx` | 175 | **Gastos y mantenimiento.** Expense CRUD across 8 categories + maintenance reminders. |
| `/precios` | `app/precios.tsx` | 76 | **Precios MICM.** Manually edit the six reference prices and the week label; reset to seed values. |
| `/carga/[id]` | `app/carga/[id].tsx` | 48 | Edit/delete an existing fill-up. |
| `/+not-found` | `app/+not-found.tsx` | 36 | 404. |
| — | `app/+html.tsx` | 39 | **Web-only HTML shell** for the static export. |

Components: `FillUpForm` (186), `ui.tsx` (112 — `Card`, `Chip`, `PrimaryButton`,
`GhostButton`), `PriceBoard` (93), `VehicleForm` (77), `Field` (45), `Themed` (45),
`FuelPicker` (25), `T` (23 — typography wrapper), `ExternalLink` (22).
Total app + components + lib ≈ **1,938 LOC**. Small.

### 8.3 Persistence — exactly how and where (critical for Phase 5)

**Mechanism: `@react-native-async-storage/async-storage` 2.2.0. One key. One JSON blob.
The entire app state is serialized on every change.**

- Key: **`'tu-combustible-rd/v1'`** — `lib/storage.ts:6`
- Read: `loadData()` — `AsyncStorage.getItem(KEY)` → `JSON.parse` → `normalizeData()`;
  falls back to `EMPTY_DATA` on missing or malformed data (`lib/storage.ts:37-45`).
- Write: `saveData()` — `AsyncStorage.setItem(KEY, JSON.stringify(data))`
  (`lib/storage.ts:47-49`).
- Trigger: a `useEffect` in `StoreProvider` writes **the whole blob** on every `data`
  change once `ready` (`lib/store.tsx:42-45`). Errors are swallowed (`.catch(() => {})`).
- **On web, AsyncStorage is backed by `localStorage`** under the same key — relevant if
  the app is embedded as a web build.

**`expo-sqlite` ~57.0.1 is a dependency AND an `app.json` plugin, but is never
imported.** Grep for `expo-sqlite|SQLite` across `app/`, `components/`, `lib/` returns
**nothing**. It is dead weight (and a misleading signal — do not assume a SQLite schema
exists).

#### Data model, field by field (`lib/types.ts`, complete)

```ts
export const FUEL_TYPES = ['premium','regular','gasoil_regular','gasoil_optimo','glp','gnv'] as const;
export type FuelType = (typeof FUEL_TYPES)[number];
export type FuelGroup = 'gasolina' | 'gasoil' | 'glp' | 'gnv';

export type Vehicle = {
  id: string;                 // generated, see below
  name: string;
  plate: string;              // '' allowed
  defaultFuelType: FuelType;
  tankVolume: number | null;
  createdAt: string;          // ISO 8601, new Date().toISOString()
};

export type FillUp = {
  id: string;
  vehicleId: string;          // FK -> Vehicle.id
  occurredAt: string;         // ISO 8601; built from a date input at 12:00 local
  odometerKm: number;
  volume: number;             // gal, or m³ for gnv
  pricePerUnit: number;       // DOP per unit
  totalDop: number;           // DOP
  fuelType: FuelType;
  isFullTank: boolean;
  station: string;            // free text, seeded from STATIONS
  notes: string;
  createdAt: string;          // ISO 8601
};

export const EXPENSE_CATEGORIES =
  ['maintenance','repair','insurance','tax','toll','parking','wash','other'] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export type Expense = {
  id: string;
  vehicleId: string;          // FK -> Vehicle.id
  occurredAt: string;         // ISO 8601
  odometerKm: number | null;
  amountDop: number;
  category: ExpenseCategory;
  description: string;
  createdAt: string;
};

export type MaintenanceReminder = {
  id: string;
  vehicleId: string;          // FK -> Vehicle.id
  title: string;
  dueDate: string | null;         // ISO 8601
  dueOdometerKm: number | null;
  completedAt: string | null;     // ISO 8601; null = open
  notes: string;
  createdAt: string;
};

export type ReferencePrices = Record<FuelType, number>;   // all six keys always present

export type Settings = {
  activeVehicleId: string | null;
  referencePrices: ReferencePrices;
  priceWeekLabel: string;     // e.g. '15–21 ago 2026 (MICM)'
};

export type AppData = {       // <-- THE ENTIRE localStorage/AsyncStorage VALUE
  vehicles: Vehicle[];
  fillups: FillUp[];
  expenses: Expense[];
  reminders: MaintenanceReminder[];
  settings: Settings;
};

export type EconomyPoint = {  // derived, never persisted
  fillUpId: string; occurredAt: string; distanceKm: number;
  volume: number; kmPerUnit: number; costPerKm: number | null;
};
```

#### Relationships

Flat, one level deep. `Vehicle` 1─∞ `FillUp`, `Expense`, `MaintenanceReminder`, all via a
plain `vehicleId` string. No nesting, no join tables. **Deletes are cascaded manually in
application code** — `deleteVehicle` filters `fillups`, `expenses` and `reminders` by
`vehicleId` and repoints `settings.activeVehicleId` (`lib/store.tsx:86-98`). There is no
referential integrity anywhere else; an orphaned `vehicleId` would simply never render.

#### ID generation (`lib/format.ts:52-54`)

```ts
export function id(): string {
  return globalThis.crypto?.randomUUID?.() ?? `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
```

**Client-generated, and not uniformly UUIDs** — where `crypto.randomUUID` is unavailable
it falls back to a timestamp+random string of the form `id_1724... _a3f9...`. Any Phase 5
migration must accept **both** shapes as primary keys (a Postgres `uuid` column would
reject the fallback form; use `text`, or remap).

IDs are assigned in the store's `upsert*` functions: `const x = input.id ?? id()`
(`lib/store.tsx:59,101,120,139`). `createdAt` is set once on insert and preserved on
update.

#### Write-path semantics worth knowing

- New fill-ups/expenses/reminders are **prepended** (`[next, ...prev.fillups]`); vehicles
  are appended.
- `upsertVehicle` sets `settings.activeVehicleId` to the new vehicle **only if it is
  currently null** (`?? vehicleId`).
- `normalizeData()` (`lib/storage.ts:20-35`) is the forward-compat shim: it defaults every
  missing array to `[]` and merges `referencePrices` over `DEFAULT_REFERENCE_PRICES`, so
  a new fuel type added in code appears with its default price in old saved data.
- `restoreData()` runs incoming data through `normalizeData()`; `resetAll()`
  `structuredClone(EMPTY_DATA)`.

#### Backup / export format (`lib/backup.ts`) — the ready-made migration vehicle

```ts
type BackupFile = {
  app: 'tu-combustible-rd';
  version: 1;                 // BACKUP_VERSION
  exportedAt: string;         // ISO
  data: AppData;
};
```

- Export writes `tu-combustible-rd-YYYY-MM-DD.json` to the cache dir via
  `expo-file-system` and hands it to `expo-sharing`.
- Import uses `expo-document-picker`, accepts **either** the wrapped `BackupFile` shape
  **or** a bare `AppData` (`backup.ts:50-51`).
- **Phase 5 note:** this gives a fully specified, versioned, user-invocable serialization
  of the entire dataset. It is the obvious migration path into Supabase — far better than
  reading AsyncStorage directly.

### 8.4 External data sources

**None. The app makes no network requests whatsoever.** Grep for
`fetch(|axios|XMLHttpRequest|https://` across `app/`, `components/`, `lib/` returns
nothing.

Fuel prices are a **static, hand-maintained seed**, not a feed:

```ts
/** MICM week of 15–21 Aug 2026 — reference only, not a live feed. */
export const DEFAULT_REFERENCE_PRICES: ReferencePrices = {
  premium: 341.1, regular: 307.5, gasoil_regular: 259.8,
  gasoil_optimo: 293.1, glp: 135.2, gnv: 43.97,
};
export const DEFAULT_PRICE_WEEK = '15–21 ago 2026 (MICM)';
```
(`lib/fuel.ts:86-96`)

The `/precios` screen tells the user outright: *"Actualízalos cuando salga el aviso nuevo.
No se descargan solos."* ("Update them when the new notice comes out. They don't download
themselves.") — `app/precios.tsx:42`. MICM is the Dominican Ministry of Industry and
Commerce, which publishes weekly fuel prices; **nothing scrapes or fetches it.**

`lib/fuel.ts` also carries a static `STATIONS` list (Texaco, Shell, TotalEnergies, Next,
Isla, Esso, Pueblo, Otra) and the full `FUEL_CATALOG` with labels and units
(`gal` for everything except `gnv`, which is `m³`).

### 8.5 Auth today

**None.** No login, no account, no user id, no remote anything. The Más screen states the
model explicitly: *"Todo vive en este dispositivo. No hay cuenta ni nube."* ("Everything
lives on this device. There's no account or cloud.") — `app/(tabs)/mas.tsx:99`, and
*"Guarda el archivo en Drive, correo o tu computadora antes de desinstalar la app."*

Adding auth + sync is therefore a **product change, not just a technical one** — copy on
at least two screens becomes false the moment Phase 5 lands.

### 8.6 Styling approach, and distance from the site

**React Native `StyleSheet.create()` objects colocated in each file, plus a small token
module.** There is no CSS, no class names, no cascade.

`constants/theme.ts` (complete):
```ts
export const colors = {
  canopy:'#0B1F1C', canopyLift:'#12352F', ink:'#1C241F', muted:'#5E6B64',
  receipt:'#F3EFE4', receiptDeep:'#E7E0D0', led:'#F0B429', ledDim:'#C48A16',
  nozzle:'#E85D4C', teal:'#3C9A8A', line:'rgba(28, 36, 31, 0.12)',
  white:'#FFFFFF', danger:'#B42318',
};
export const fonts = {
  display:'Syne_800ExtraBold', title:'Syne_700Bold', body:'Figtree_400Regular',
  medium:'Figtree_500Medium', semibold:'Figtree_600SemiBold', bold:'Figtree_700Bold',
  mono:'IBMPlexMono_400Regular', monoBold:'IBMPlexMono_700Bold',
};
```

Fonts are loaded as **npm packages** (`@expo-google-fonts/{figtree,ibm-plex-mono,syne}`)
via `useFonts` in `app/_layout.tsx:17-26`, with a splash screen held until loaded.

**Distance from the site: very large.**

| | Site | Tu Combustible RD |
|---|---|---|
| Mechanism | Plain CSS files, CSS custom properties, cascade | RN `StyleSheet` objects, no cascade |
| Palette | `--Hub: #ffb300` amber on dark; `--HubShadow: #d0d0d0` (`src/styles.css:7-11`) | `receipt: #F3EFE4` cream / `canopy: #0B1F1C` deep green / `led: #F0B429` amber |
| Type | Custom display faces from `public/assets/fonts/` (Baloba, Gefika, ROLNER, Spoilers…) | Google Fonts npm packages (Syne, Figtree, IBM Plex Mono) |
| Language | **English** | **Spanish (es-DO)** throughout, including `Intl.NumberFormat('es-DO')` currency DOP and `toLocaleDateString('es-DO')` (`lib/format.ts:4-17,36-50`) |

The amber accents are coincidentally close (`#ffb300` vs `#F0B429`) but nothing else is.

### 8.7 Dependency list and conflicts with the site

Full runtime deps: `@expo-google-fonts/{figtree,ibm-plex-mono,syne}`,
`@expo/vector-icons` ^15.0.2, `@react-native-async-storage/async-storage` 2.2.0,
`expo` ~57.0.14, `expo-constants`, `expo-document-picker`, `expo-file-system`,
`expo-font`, `expo-linking`, `expo-router` ~57.0.14, `expo-sharing`, `expo-splash-screen`,
`expo-sqlite` *(unused)*, `expo-status-bar`, `expo-symbols`, `expo-web-browser`,
`react` 19.2.3, `react-dom` 19.2.3, `react-native` 0.86.2, `react-native-reanimated` 4.5.1,
`react-native-safe-area-context` ~5.7.0, `react-native-screens` ~4.26.0,
`react-native-web` ~0.21.0, `react-native-worklets` 0.10.1.
Dev: `@types/react` ~19.2.2, `typescript` ~6.0.3.

**Conflicts with the site, concretely:**

| Conflict | Detail |
|---|---|
| **Framework** | React 19 vs **Angular 21**. These are not "a version mismatch" — they are different frameworks. There is no shared component model. |
| **TypeScript** | App is on TS **~6.0.3**; site is on **~5.9.2**. A single merged `tsconfig`/toolchain would have to reconcile these. Angular 21 pins its supported TS range via `@angular/compiler-cli`; TS 6.0 may be outside it (**unverified** — I did not resolve the peer range). |
| **Bundler** | Metro (Expo) vs `@angular/build` (esbuild/Vite). Mutually exclusive in one build. |
| **Router** | `expo-router` file-based with `typedRoutes` vs Angular Router. Two routers cannot own the same history. |
| **Styling** | RN `StyleSheet` → `react-native-web` emits atomic CSS classes at runtime into the document head; the site uses global plain CSS with unscoped selectors (`.container`, `.main-title`). Collision risk is real but one-directional (see §9). |
| **Native-only modules** | `expo-sharing`, `expo-document-picker`, `expo-file-system`, `expo-splash-screen`, `expo-symbols` — the backup/restore feature (`lib/backup.ts`) depends on all three of the first ones. On web these are either no-ops or absent. **The export/import flow will not work as written in a browser.** |
| **Bundle size** | The existing static web export is **5.1 MB** (`dist/`, 12 HTML entry points + `_expo/` JS). The site's production budget is `maximumError: 1MB` initial / warning at 500 kB (`angular.json`). Bundling this into the Angular app would blow the budget by ~5×. |
| **Dead dep** | `expo-sqlite` is declared and plugin-registered but unused — remove or it will confuse Phase 5. |

---

## 9. Conflict analysis — applying the Music Hub pattern to Tu Combustible RD

### The pivotal asymmetry

**The Music Hub "pattern" is not an integration pattern.** It is a link. Music Hub is an
Angular 19 web app with its own Vercel deployment, so "make it openable from the
portfolio" meant "add an `<a href>`". The pattern's entire cost is: copy a PNG, append one
object to an array.

Tu Combustible RD can be linked the **exact same way, today, at the same cost** —
*provided it has a deployed web URL and/or an APK release*. In that case §9 has almost no
risks, and the real work in Phases 1–5 is elsewhere (i18n, auth, sync).

Everything below assumes the harder reading: that "integrate" means **host the app on the
site**, not link to it. **This ambiguity is my blocking question — see §14.**

### Concrete risks, if hosting is intended

1. **Framework incompatibility is absolute, not incremental (highest risk).**
   Angular 21 cannot render React 19 components. The only viable hosting options are:
   (a) **iframe** the existing Expo static export; (b) **serve it at a path** on the same
   Vercel project as independent static files (e.g. `/apps/combustible/*`), which is an
   iframe-free variant of the same idea; (c) **rewrite the app in Angular** (~1,900 LOC of
   screens plus the `lib/` logic — a genuine rewrite, not a port); (d) a React-in-Angular
   micro-frontend mount, which means shipping two frameworks in one page.
   **Neither Music Hub nor anything else in this codebase establishes a precedent for any
   of these.** Phase 4 will be inventing a pattern, not replicating one.

2. **Bundle budget breach (high, verified).** The static export is **5.1 MB**; the
   Angular production budget errors at **1 MB initial**. Any option that bundles the app
   into the Angular build fails the build outright. Options (a) and (b) sidestep this
   because the files are served independently — which is a strong argument for them.

3. **Routing ownership (high).** The site has **zero routes** (`app.routes.ts` is
   `[]`) and navigates by `#anchor`. Tu Combustible RD has 12 file-based routes with
   `typedRoutes`. Hosting it means the site gains its first real router *and* must hand a
   path subtree to a foreign router. The `vercel.json` SPA catch-all
   (`"/(.*)" → "/index.html"`) will swallow every sub-path of the embedded app unless a
   more specific rewrite is added **before** it — `vercel.json` routes are order-sensitive,
   and `"handle": "filesystem"` already sits between the `/api` rule and the catch-all,
   so static files under e.g. `/apps/combustible/` would resolve, but client-side deep
   links would not. This is a real, specific config trap.

4. **CSS collision (medium, one-directional).** `react-native-web` injects atomic classes
   at runtime; those are prefixed and unlikely to hit the site. The reverse is the
   problem: the site's **global, unscoped** selectors (`.container`, `.main-title`,
   `.card`, plus `*`-level rules in `src/styles.css`) would cascade into any
   non-iframed embed. An iframe eliminates this entirely; a same-page mount does not.

5. **TypeScript/toolchain divergence (medium).** TS ~6.0.3 vs ~5.9.2, Metro vs
   `@angular/build`, two `tsconfig` philosophies (the site runs `strict` + Angular's
   strict template flags). Keeping the app's build separate avoids this completely;
   merging them is a multi-day yak shave.

6. **Native-module features silently break on web (medium, verified).** `lib/backup.ts`
   — the only way users get their data out today — depends on `expo-file-system`,
   `expo-sharing`, and `expo-document-picker`. Whatever hosting route is chosen, the
   backup/restore UI on `/(tabs)/mas` needs a web implementation or needs hiding. Note
   the already-built `dist/` export includes `mas.html`, so this is a live defect in the
   existing web build (**inferred** — I did not run it).

7. **Language mismatch (medium, and it collides with Phase 1).** The app is 100% Spanish
   with `es-DO` number/date formatting hardwired in `lib/format.ts`; the site is 100%
   English with no i18n at all. Whatever Phase 1 chooses for the site must account for an
   embedded app that has its own, incompatible, hardcoded localization.

8. **Data model vs. the shared backend (medium, Phase 5).** Client-generated IDs that are
   *not always UUIDs* (§8.3) will not fit a Postgres `uuid` PK. The whole-blob-on-every-
   write persistence model has no per-record timestamps beyond `createdAt` — **there is
   no `updatedAt` on any entity**, so last-write-wins sync has nothing to compare. Adding
   sync means adding a field to all four entity types and a `normalizeData()` migration.

9. **Icon drift (low, but it is the pattern's one manual step).** Same as Music Hub: an
   icon must be hand-copied to `public/assets/apps-imgs/`. Tu Combustible RD's icons are
   at `assets/images/icon.png` (+ adaptive foreground/background/monochrome).

### Stack comparison at a glance

| | Site | Music Hub | Tu Combustible RD |
|---|---|---|---|
| Framework | Angular 21 | Angular 19 | React 19 / RN 0.86 |
| Router | none (empty `Routes`) | Angular Router | expo-router (12 routes) |
| Build | `@angular/build` | Angular CLI + Capacitor | Metro / EAS |
| Styling | plain CSS + vars | (own) | RN StyleSheet |
| Persistence | none | Supabase (x-core) | AsyncStorage, 1 key |
| Auth | none | Supabase Auth | none |
| Language | English | — | Spanish (es-DO) |
| Native shell | — | Capacitor (Android) | Expo/EAS (Android) |
| Web deploy | Vercel | Vercel | none yet (`dist/` built locally only) |

Note that Music Hub being **Angular** is the reason its pattern looked cheap. It is also
why that pattern carries no information about hosting a React app — the link-out worked
regardless of its framework.

---

## 10. PWA readiness

### The site: nothing. Not a PWA.

| Asset | Status | Evidence |
|---|---|---|
| Web app manifest | **Missing** — no `manifest.webmanifest`, no `manifest.json`, no `<link rel="manifest">` | `public/` contains only `assets/`, `favicon.ico`, `xw.ico`; `src/index.html` has no manifest link |
| Service worker | **Missing** — `@angular/service-worker` is not a dependency; no `ngsw-config.json`; no `provideServiceWorker()` in `app.config.ts` | `package.json`, `src/app/app.config.ts` |
| Icons | **Only favicons** (`favicon.ico`, `xw.ico`). No 192/512 PNG set, no maskable icon, no Apple touch icon. | `public/` |
| Offline handling | **None.** | |
| Theme color / meta | **Missing** — `src/index.html` has only charset, viewport, title, base, icon. | `src/index.html` |
| `<html lang>` | `en`, static | `src/index.html:2` |

**To make the site installable, everything is missing:** add `@angular/service-worker`,
an `ngsw-config.json`, `provideServiceWorker()`, a manifest, a full icon set, and
theme-color/apple meta tags.

### The precedent already exists in Music Hub

Music Hub **is** a working PWA and is the template to copy: `@angular/service-worker`
^19.2.25 in `package.json`, `ngsw-config.json` at the repo root, and
`public/manifest.webmanifest` + `public/icons/`. Its `environment.ts` even documents the
update strategy: *"The web app updates itself through the service worker"* while the
Android build checks GitHub releases. **Phase-whichever should lift this setup wholesale
rather than design it.**

### Tu Combustible RD

- `app.json` declares `web.output: "static"` and a `favicon.png`, and `app/+html.tsx`
  provides a custom HTML shell — but there is **no manifest and no service worker** in the
  export. Not installable as a PWA today.
- It *is* installable as a **native Android app** via EAS (`eas.json`, adaptive icons,
  `versionCode: 2`) — but **no APK release exists yet** (see §14 Q3).
- Icon assets available for the site card: `assets/images/icon.png`,
  `android-icon-foreground.png`, `android-icon-background.png`,
  `android-icon-monochrome.png`, `splash-icon.png`, `favicon.png`.
- Ironically the app's existing "installability" story is the *opposite* of Music Hub's:
  Music Hub leads with PWA + Android; this one has native-only, with the `iosHint` copy
  on the site card (which promises "open in Safari → Add to Home Screen") having **no
  PWA to point at** unless one is built.

---

## 11. Placeholder table

**Caveat: the authoritative placeholder table lives in the missing
`TEMPLATE-inventory.md` (§0.1). The following is my reconstruction of the values later
phases plausibly need. Treat the names as provisional.**

| Placeholder | Value |
|---|---|
| `{{SITE_REPO}}` | `/home/xaviel/dev2/xaviel-web-v2` (**not** the `dev/` path given to Phase 0 — §0.2) |
| `{{SITE_FRAMEWORK}}` | Angular 21 (standalone components, no NgModules) |
| `{{SITE_ROUTER}}` | Angular Router, configured but **empty** — single-page anchor scrolling |
| `{{SITE_LANG}}` | TypeScript 5.9.2, strict |
| `{{SITE_STYLING}}` | Plain CSS + CSS custom properties (Tailwind installed, prefix `tw-`, unused) |
| `{{SITE_PKG_MANAGER}}` | npm 10.9.2 |
| `{{SITE_HOST}}` | Vercel (`outputDirectory: dist/portfolio-v2/browser`) |
| `{{SITE_NODE_VERSION}}` | **UNKNOWN — not pinned** (no `engines`, `.nvmrc`, or `.node-version`) |
| `{{SITE_TEST_RUNNER}}` | vitest 4.0.8 via `@angular/build:unit-test` (10 scaffold specs, no CI) |
| `{{SITE_LINTER}}` | **none** |
| `{{APP_CATALOG_FILE}}` | `src/app/app.ts` (the `apps` array field, line 78) |
| `{{APP_CATALOG_MODEL}}` | `src/app/shared/models/app-card.model.ts` (`AppCard`) |
| `{{APP_CATALOG_KIND}}` | Hardcoded TypeScript array literal |
| `{{APP_CARD_COMPONENT}}` | `src/app/shared/components/app-card/app-card.{ts,html,css}` |
| `{{APP_ICON_DIR}}` | `public/assets/apps-imgs/` |
| `{{MUSIC_HUB_PATTERN}}` | **(c) separate deploy, linked out** |
| `{{MUSIC_HUB_URL}}` | `https://music-hub-xaviel.vercel.app` |
| `{{MUSIC_HUB_REPO}}` | `/home/xaviel/dev2/music-hub` (GitHub `XavielT/music-hub`) |
| `{{NAV_FILE}}` | `src/app/components/navbar/navbar.html` |
| `{{SECTION_ANCHOR}}` | `#apps` |
| `{{I18N_LIBRARY}}` | **none — greenfield** |
| `{{I18N_STRING_COUNT}}` | ≈110 (estimate; ~26 inside `app.ts` data arrays) |
| `{{SITE_LOCALE}}` | `en` (static `<html lang="en">`) |
| `{{APP_LOCALE}}` | `es-DO` (hardcoded in `lib/format.ts`) |
| `{{AUTH_PROVIDER_SITE}}` | **none** |
| `{{SUPABASE_PROJECT}}` | **x-core** (shared backend; ref `nakgrkcqyuycadeuenuw`) |
| `{{SUPABASE_CLIENT_LOC}}` | `music-hub/src/shared/services/supabase.service.ts` (site has none) |
| `{{SUPABASE_CONFIG_VARS}}` | `supabaseUrl`, `supabaseAnonKey`, `siteUrl`, `updateRepo` — committed in `environment.ts`, not env vars |
| `{{SUPABASE_TYPES_GENERATED}}` | **No** |
| `{{APP_REPO}}` | `/home/xaviel/dev2/tu-gasolina-rd` |
| `{{APP_NAME}}` | Tu Combustible RD (slug `tu-combustible-rd`) |
| `{{APP_FRAMEWORK}}` | Expo SDK 57 / React Native 0.86.2 / React 19.2.3 |
| `{{APP_ROUTER}}` | `expo-router` ~57.0.14, file-based, `typedRoutes: true` |
| `{{APP_STORAGE_KIND}}` | AsyncStorage (localStorage on web) |
| `{{APP_STORAGE_KEY}}` | `tu-combustible-rd/v1` |
| `{{APP_ROOT_TYPE}}` | `AppData` (`lib/types.ts:81-87`) |
| `{{APP_ENTITIES}}` | `Vehicle`, `FillUp`, `Expense`, `MaintenanceReminder`, `Settings` |
| `{{APP_ID_STRATEGY}}` | `crypto.randomUUID()` **with a non-UUID fallback** `id_<ts>_<rand>` (`lib/format.ts:52`) |
| `{{APP_BACKUP_FORMAT}}` | `{ app:'tu-combustible-rd', version:1, exportedAt, data }` (`lib/backup.ts`) |
| `{{APP_EXTERNAL_DATA}}` | **none** — static MICM price seed, manually edited |
| `{{APP_AUTH}}` | **none** |
| `{{APP_WEB_EXPORT}}` | `expo export` static output, exists at `dist/`, **5.1 MB** |
| `{{APP_ANDROID_PKG}}` | `com.xavieltucombustiblerd.app` (versionCode 2) |
| `{{APP_APK_URL}}` | **UNKNOWN — no release published yet** (see §14 Q3) |
| `{{APP_LIVE_URL}}` | **UNKNOWN — not deployed anywhere** (see §14 Q1) |
| `{{PWA_STATUS_SITE}}` | none (no manifest, no SW, no icons) |
| `{{PWA_REFERENCE_IMPL}}` | `music-hub` (`ngsw-config.json`, `public/manifest.webmanifest`, `public/icons/`) |

---

## 12. Contradictions (in lieu of ADR conflicts)

There are no ADRs to contradict (§0.1). These are assumptions **built into the Phase 0
prompt's own wording** that the code refutes — the nearest useful substitute, and the
things most likely to have been wrong in the missing ADRs too:

1. **"how Music Hub is integrated into the site … a later phase must replicate that
   pattern exactly."** There is no integration pattern to replicate. Music Hub is a link
   in a hardcoded array (§3). Any Phase 4 plan premised on reusing an embedding/mounting
   mechanism is premised on something that does not exist.
2. **The prompt's framework menu — "App Router / Pages / Vite SPA".** All three are
   Next.js/Vite framings. The site is **Angular 21** with an empty router. Any later
   phase assuming React/Next idioms (server components, `app/` directory, MDX content,
   `next-intl`) does not apply.
3. **"Is a Supabase client already configured, and if so where …?"** implies the site has
   one. It does not (§6, §7). Supabase exists only in the *Music Hub* repo, pointed at the
   shared **x-core** project. If an ADR said "the site already talks to x-core", it is
   wrong.
4. **"App catalog — MDX? JSON? A database?"** None of these — a TS array literal in the
   root component (§4).
5. **"Persistence: localStorage? IndexedDB? SQLite?"** — AsyncStorage, one key, whole-blob
   JSON. Note `expo-sqlite` **is installed and registered as a plugin but never imported**
   (§8.3); an ADR written from the dependency list alone would wrongly conclude SQLite.
6. **"Tu Combustible RD … fetch fuel prices from an API, scrape a site"** — it does
   neither. Prices are a static seed the user edits by hand, and the app makes **zero**
   network requests (§8.4).
7. **Implied single working tree.** The designated working directory is 5 commits stale
   and does not contain the Apps section at all (§0.2).

**Per the prompt's own instruction — "the code wins" — `00-context/02-architecture-
decisions.md` should be written (not merely updated) from this document before Phase 1.**

---

## 13. Verification notes

- **Read-only honored.** No application code, config, dependency, or migration was
  touched in either repo. No installs, no builds, no `git fetch`. The only filesystem
  writes are this file and its parent directories.
- Committed on branch `imp-11092026/phase-0-discovery` in
  `/home/xaviel/dev/xaviel-web-v2` as the prompt specified — **note this is the stale
  checkout (§0.2)**; the branch is based on `430b21e`. Since the commit is docs-only this
  is harmless, but the file (and later phases) probably belong in
  `/home/xaviel/dev2/xaviel-web-v2`. Flagged as Q2 in §14.
- **Verified vs. inferred.** Everything above is read directly from files or `git show`
  unless explicitly marked. Items marked inferred: the Vercel Git-integration deploy
  mechanism (no workflow file found, but `.vercel/` exists and `vercel.json` defines the
  build); the ~110 string count (grep-based approximation); the claim that
  backup/restore is broken in the existing web export (deduced from native-module
  dependencies — not executed); whether TS 6.0 falls outside Angular 21's supported range
  (peer ranges not resolved); whether Supabase RLS is actually enforced on x-core (no DB
  access).
- **Not verified:** nothing was run. No `npm run build`, no `expo export`, no browser.

---

## 14. Questions blocking Phase 1

**Q1 — ANSWERED: link out, like Music Hub.** §9's hosting risks are moot. See §0.3.

**Q2 — ANSWERED: `/home/xaviel/dev2/xaviel-web-v2` is canonical.** See §0.3.

**Q3 — OPEN, and now the only thing blocking the card. Where should the two buttons
   point?** Verified 2026-09-11: the repo is `XavielT/tu-combustible-rd` (not
   `tu-gasolina-rd`), release **v1.1.0** exists but has **no APK asset attached**, and the
   web app is **not deployed anywhere**. So today both `url` and `apkUrl` would be empty
   strings. Three ways forward, not mutually exclusive: (a) attach an APK to the existing
   v1.1.0 release, (b) deploy the Expo web export to Vercel to get a `url`, (c) ship the
   card now with both buttons disabled and fill them in later.

**Q4 — Still relevant only if you want cloud sync in the app itself. Is the shared
   x-core Supabase project intended to back Tu Combustible RD too?**
   If so: prod and dev are the same project (`environment.development.ts:2`), and the
   non-UUID ID fallback (§8.3) and the missing `updatedAt` on all four entities need
   decisions before any schema is written.

**Q5 — With link-out chosen, this narrows to the site alone unless you say otherwise.
   Does Phase 1's i18n cover only the site, or the app too?** The site is English
   with no i18n; the app is Spanish with `es-DO` hardcoded in `lib/format.ts`. If the
   goal is a bilingual site, does the embedded/linked app follow the site's locale?

**Q6 — Should the missing `00-context/` documents be reconstructed first?** Per §12 the
   ADRs, if they existed, were likely written against a Next.js-shaped mental model that
   does not match this codebase.
