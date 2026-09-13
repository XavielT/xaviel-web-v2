# INVENTORY — xaviel-web-v2 & tu-gasolina-rd

> Filled in by Phase 0. Every later prompt reads this file.
> Each claim is marked `[verified]` (read directly from a file) or `[inferred]`.

**Completed:** 2026-09-13
**By:** Phase 0 discovery (re-run)

---

## 0. Read this first — four findings that change the plan

### 0.1 The stack is Angular, not Next.js

The site is **Angular 21**, a client-rendered SPA on Vercel. `02-architecture-decisions.md`
is written throughout in Next.js vocabulary — `next-intl`, `next-i18next`, "Next App
Router", `NEXT_PUBLIC_ADMIN_EMAIL`, "route middleware", "runs server-side only". None of
those exist here. There is no server rendering, no middleware layer, and one serverless
function in total (`api/contact.ts`). See §1, §9.4. `[verified]`

### 0.2 Music Hub is not integrated. It is a link.

Pattern **(c)** — a separate repository, separately deployed, reachable only by an
`<a href>` to another origin. There is no Music Hub code, route, asset, build step or
config entry inside this repo. The entire "integration" is one object in a TypeScript
array. See §3. `[verified]`

### 0.3 G1 (integrate Tu Combustible RD) has already shipped on `main`

Three commits on `main` predating this discovery pass already added the app to the
catalog, marked it installable and gave it its real icon:

```
bfb177a feat: use the app's real icon on the Tu Combustible RD card
c9cbdbf feat: mark Tu Combustible RD as installable
3c3ccc4 feat: add Tu Combustible RD to the Apps section
```

`src/app/app.ts:93-104` holds the entry. Phase 4 as written has nothing left to do beyond
verification. See §3, §4. `[verified]`

### 0.4 Tu Combustible RD's local store cannot support ADR-02 as it stands

ADR-02 requires client-generated UUIDs, `updated_at` on every row, and soft deletes. The
app has the first, and has neither of the other two. It also does not store rows — it
stores one JSON blob under one AsyncStorage key, so there is no row to attach a version
to. See §8.3, §9. `[verified]`

---

## Placeholder resolution

| Placeholder | Value | Notes |
|---|---|---|
| `{{FRAMEWORK}}` | Angular 21.0.x | `package.json:22-27`; builder `@angular/build:application` |
| `{{ROUTER}}` | `@angular/router` provided but **zero routes** | `app.routes.ts:3` is `export const routes: Routes = []`. Navigation is in-page anchor scrolling |
| `{{LANG}}` | TypeScript ~5.9.2, `strict: true` | `package.json:44`, `tsconfig.json:6` |
| `{{STYLING}}` | Hand-written CSS per component + CSS custom properties, with Tailwind 3.4.19 (prefix `tw-`) used sparingly | `src/styles.css:1-21`, `tailwind.config.js:6` |
| `{{PKG_MANAGER}}` | npm 10.9.2 | `package.json:19` `"packageManager": "npm@10.9.2"` |
| `{{ROUTES_DIR}}` | `src/app/app.routes.ts` (empty) — **no routes directory exists** | |
| `{{COMPONENTS_DIR}}` | `src/app/components/` (page sections), `src/app/shared/components/` (reusable), `src/app/shared/ui/` (primitives) | |
| `{{APP_CATALOG_PATH}}` | `src/app/app.ts:78-105` — the `apps: AppCardModel[]` field | Shape in `src/app/shared/models/app-card.model.ts` |
| `{{MUSICHUB_PATTERN}}` | **(c)** separate deploy, merely linked to | §3 |
| `{{MUSICHUB_CODE_PATH}}` | `/home/xaviel/dev2/music-hub` — a **different repo** (`git@github.com:XavielT/music-hub.git`). Nothing in `xaviel-web-v2` | |
| `{{MUSICHUB_ROUTE}}` | None on this site. External: `https://music-hub-xaviel.vercel.app` | `src/app/app.ts:85` |
| `{{I18N_LIB}}` | None present. **Recommended: port Music Hub's in-house `I18nService` + `t` pipe** (§5) | Not `next-intl` (§0.1) |
| `{{SUPABASE_CLIENT_PATH}}` | `none` | §7 |
| `{{TUCOMB_STACK}}` | Expo SDK ~57.0.14 / React Native 0.86.2 / React 19.2.3 / expo-router ~57.0.14 | `/home/xaviel/dev2/tu-gasolina-rd/package.json` |
| `{{TUCOMB_STORAGE}}` | `@react-native-async-storage/async-storage` — **one key**, `tu-combustible-rd/v1`, whole-app JSON blob (localStorage on web) | `lib/storage.ts:6` |
| `{{HOSTING}}` | Vercel (project `xaviel-web-v2`) | `vercel.json`, `.vercel/project.json` |
| `{{TEST_RUNNER}}` | Vitest 4.0.8 via `@angular/build:unit-test` | `package.json:45`, `angular.json:66-68`, `tsconfig.spec.json:7` |

---

## 1. Site stack

| Aspect | Value | Evidence |
|---|---|---|
| Framework + version | Angular `^21.0.0`, CLI/build `^21.0.5` `[verified]` | `package.json:22-27,38-40` |
| Router type | `provideRouter(routes)` wired, `routes` is `[]`. A `<router-outlet>` is imported in `App` but the page is one static template. Effectively **no routing**. `[verified]` | `app.config.ts:9`, `app.routes.ts:3`, `app.ts:22` |
| Language | TypeScript ~5.9.2, `strict`, `strictTemplates`, `noPropertyAccessFromIndexSignature` `[verified]` | `tsconfig.json:5-30` |
| Styling | Per-component `.css` files + a global `src/styles.css` (CSS custom-property palette, `@font-face` blocks). Tailwind 3.4.19 is installed and enabled with the `tw-` prefix, used in 3 templates only. `[verified]` | `styles.css:1-21`, `tailwind.config.js`, `progress-bar-card.html:1` |
| Component library | None. All components hand-written, all `standalone: true`. `[verified]` | `app.ts:21`, `app-card.ts:8` |
| State management | Angular signals (`signal()`), local to components. No store library. `[verified]` | `app.ts:27,30-31`, `navbar.ts` |
| Data fetching | One `fetch()` from `ContactForm` to `/api/contact`. No HttpClient, no `provideHttpClient`. `[verified]` | `contact-form.ts:89` |
| Package manager | npm 10.9.2 (declared), npm 11.12.1 installed locally `[verified]` | `package.json:19`; `npm -v` |
| Node version | v24.15.0 locally. **No `engines` field, no `.nvmrc`** — Vercel picks its own default. `[verified]` | `node -v`; `package.json` has no `engines` |
| Test setup | Vitest 4.0.8 + jsdom 27.1.0, run through `@angular/build:unit-test` (`npm test` → `ng test`). 10 `.spec.ts` files, all CLI-generated smoke tests. **Not executed during this phase.** `[verified]` | `package.json:41,45`, `angular.json:66-68` |
| Lint / format | **No linter.** No ESLint config, no `lint` script, `@angular-eslint` not installed. Prettier config only, inline in `package.json` (printWidth 100, singleQuote) with no `format` script. `[verified]` | `package.json:8-18`; no eslint files in repo root |
| Hosting + deploy | Vercel, project `xaviel-web-v2`. `buildCommand: npm run build`, output `dist/portfolio-v2/browser`, SPA rewrite of everything to `/index.html`, `/api/*` to serverless functions. **No `.github/` directory** — deploy is Vercel's Git integration. `[inferred — no workflow file, but `.vercel/` and `vercel.json` are present]` | `vercel.json`, `.vercel/project.json` |

**Notable dependencies:** `@vercel/analytics` ^2.0.1 (called at bootstrap,
`main.ts:4,6`), `@vercel/node` ^5.6.15 and `resend` ^6.9.3 (the contact function),
`rxjs` ~7.8.0 (transitive Angular need; no observables in app code).

**Unusual / worth flagging:**

- `api/` is a second, nested npm project with its **own** `package.json` pinning
  `resend: ^4.0.0` while the root pins `^6.9.3`, and its own `tsconfig.json` with
  `"strict": false` and `"outDir": "."` `[verified: api/package.json, api/tsconfig.json]`.
- `src/app/app.component` exists as an **empty directory** `[verified]`.
- A leftover debug modal is live in the shipped template — `"Hola 👋 soy un modal"` with
  "Abrir" / "Cerrar" buttons `[verified: app.html]`. Observed, not fixed.
- `src/index.html` sets `<title>PortfolioV2</title>` and `lang="en"` `[verified]`.

## 2. Site structure

```
xaviel-web-v2/
├── angular.json              build/serve/test targets (single project "portfolio-v2")
├── vercel.json               build command, output dir, SPA + /api rewrites
├── tailwind.config.js        prefix "tw-", content ./src/**/*.{html,ts}
├── postcss.config.js
├── proxy.conf.json           dev: /api → https://xavielweb.vercel.app
├── tsconfig{,.app,.spec}.json
├── api/
│   ├── contact.ts            the only serverless function (Resend email)
│   ├── package.json          nested project, resend ^4.0.0
│   └── tsconfig.json
├── public/                   copied wholesale to the build output
│   ├── assets/apps-imgs/     music-hub.png, tu-combustible-rd.svg
│   ├── assets/{icons,img,fonts,textures,skills-icons,projects-imgs,...}
│   ├── favicon.ico, xw.ico
└── src/
    ├── index.html            lang="en", <app-root>
    ├── main.ts               bootstrapApplication + Vercel analytics inject()
    ├── styles.css            global palette, @font-face, @tailwind directives
    └── app/
        ├── app.ts            ← THE WHOLE SITE'S DATA: apps, projects, skills, certificates
        ├── app.html          171 lines, every section of the page
        ├── app.css
        ├── app.config.ts     providers: error listeners + provideRouter([])
        ├── app.routes.ts     export const routes: Routes = []
        ├── app.component/    (empty directory)
        ├── components/       navbar/ footer/ xlogo/ contact-form/
        └── shared/
            ├── components/   app-card/ card/ certificate-card/ maintenance/ progress-bar-card/
            ├── ui/           badge/
            └── models/       app-card.model.ts certificate.model.ts
                              project-card.model.ts skill.model.ts
```

- **Routes live in:** nowhere. `app.routes.ts` is empty; the site is one scrolling page
  with anchor links (`#home`, `#about`, `#main-projects`, `#apps`, `#skills`,
  `#certificates`, `#contact`) in `navbar.html:13-38`. `[verified]`
- **Shared components in:** `src/app/shared/components/` and `src/app/shared/ui/`.
  Page-section components in `src/app/components/`. `[verified]`
- **Config in:** repo root (`angular.json`, `vercel.json`, `tailwind.config.js`,
  `tsconfig*.json`, `proxy.conf.json`). No `src/environments/` at all. `[verified]`
- **Static assets in:** `public/`, mapped by `angular.json:19-24` as `{glob: "**/*",
  input: "public"}`, so `public/assets/x` is served at `/assets/x`. `[verified]`
- **Observations:** every component pairs `.ts` / `.html` / `.css` / `.spec.ts` in its own
  folder — the Angular CLI default, followed consistently. All content data is hardcoded
  in `app.ts` as typed arrays; there is no CMS, no JSON, no fetch for content.

## 3. Music Hub integration — THE CRITICAL SECTION

**Pattern:** **(c) — a separate deploy that's merely linked to.**

**Evidence.** Exhaustive: `grep -rni "music.?hub"` over `src/`, `api/`, `angular.json`,
`vercel.json`, `package.json` and `tailwind.config.js` returns **two** matches, both inside
one object literal at `src/app/app.ts:79-92`, plus one image file
`public/assets/apps-imgs/music-hub.png`. There is no Music Hub route, component, module,
lazy chunk, iframe, workspace, submodule, local package dependency, proxy rule, rewrite or
build step anywhere in this repository. `[verified]`

Music Hub's actual code lives in an unrelated repository,
`/home/xaviel/dev2/music-hub` → `git@github.com:XavielT/music-hub.git`, with its own
`angular.json` (Angular **19**, not 21), its own `vercel.json`, its own Supabase client,
its own service worker, and a Capacitor Android target. `[verified]`

### End-to-end trace

1. Visitor scrolls to, or clicks, `Apps` in the navbar —
   `src/app/components/navbar/navbar.html:25-26`, an anchor to `#apps`.
2. `src/app/app.html:122` renders `<section id="apps">`, and line 129 loops the catalog:
   `<app-app-card *ngFor="let app of apps" [app]="app">`.
3. `apps` is the hardcoded array at `src/app/app.ts:78`; Music Hub is its first entry
   (`app.ts:79-92`), typed by `src/app/shared/models/app-card.model.ts`.
4. `src/app/shared/components/app-card/app-card.ts` receives it as `@Input() app` and
   exposes `hasWebApp` / `hasApk` getters that are just truthiness checks on the URLs.
5. `app-card.html:4` renders the icon from `app.icon` →
   `/assets/apps-imgs/music-hub.png`, served straight from `public/`.
6. `app-card.html:16-17` renders `<a [href]="app.url" target="_blank"
   rel="noopener noreferrer">Open app</a>`.
7. Clicking it leaves the site entirely for `https://music-hub-xaviel.vercel.app`, a
   different Vercel project serving a different Angular application.
8. `app-card.html:20-21` offers a second link to the GitHub releases page for the APK;
   `app-card.html:25` prints the iOS "Add to Home Screen" hint.

**The trace ends at step 7. Music Hub never renders inside this site.**

### Details

| Question | Answer | Evidence |
|---|---|---|
| Entry point from listing | An `<a href target="_blank">` on the app card | `app-card.html:16-17` |
| Routes it owns | **None on this site.** Owns all of `music-hub-xaviel.vercel.app` | `app.routes.ts:3` is empty |
| Where its code lives | Separate repo `/home/xaviel/dev2/music-hub`, GitHub `XavielT/music-hub` | `git remote -v` in that repo |
| Asset handling | One PNG icon copied by hand into `public/assets/apps-imgs/music-hub.png`. Nothing else. | `public/` listing |
| Own build step? | None in this repo. In its own repo: `ng build` → `dist/music-hub/browser`, deployed separately. | `music-hub/vercel.json:3-5` |
| Styling relative to site | Completely independent. Different palette, different global CSS, different Angular major (19 vs 21). Nothing shared, nothing to collide. | `music-hub/package.json:9-16` |
| Shares layout/nav? | **No.** Different origin, its own shell, its own navigation. | — |
| Stores data? Where? | Yes, but entirely on its own: Supabase project `x-core` (`nakgrkcqyuycadeuenuw.supabase.co`), plus localStorage for the auth session. **The site touches none of it.** | `music-hub/src/environments/environment.ts:5-9`, `supabase.service.ts:34-44` |
| How registered in catalog | One object literal appended to the `apps` array | `app.ts:79-92` |
| Registration hardcoded or data-driven? | **Hardcoded** — a TypeScript array compiled into the bundle. Changing it requires an edit, a build and a deploy. | `app.ts:78` |
| Auth involved? | **None on the site side.** Music Hub runs its own Supabase Auth behind its own origin. | §6, §7 |

### Friction in the pattern

Per ADR-01's instruction to flag problems rather than silently fix them:

1. **It is not an integration.** It is a bookmark with a picture. Nothing about it
   constrains, teaches or scaffolds a real integration, so ADR-01's premise ("mirror
   whatever pattern exists") resolves to "add an array entry" — which is a five-minute
   job, not a phase.
2. **Icons are copied by hand** into `public/assets/apps-imgs/`. No pipeline, no
   size/format convention, no check that the file exists — a typo in `icon` yields a
   broken `<img>` with no build error. Music Hub's is a 1-file PNG; Tu Combustible RD's
   is an SVG. Formats already diverge.
3. **The catalog is compiled in.** Every app addition, description tweak or dead-link fix
   is a code change plus a redeploy of the whole site.
4. **Links are unverified.** `hasWebApp`/`hasApk` only test for a non-empty string
   (`app-card.ts:18-24`). A rotted URL renders as a live, confident button.
5. **Cross-repo version drift is invisible.** The site is Angular 21, Music Hub Angular
   19. Nothing surfaces this, and nothing needs to — but equally, nothing shared can ever
   be reused between them.
6. **Duplicated platform work.** Music Hub built its own i18n, its own PWA config, its own
   Supabase auth. Tu Combustible RD built its own PWA and service worker independently.
   The site is about to build all three again. This is the real cost of pattern (c), and
   it is the thing worth raising before Phases 1, 2 and 7.

### Reproduction checklist

The exact ordered steps to integrate a second app this way:

1. Deploy the app somewhere with a public HTTPS URL (its own Vercel project).
2. Drop a square icon into `public/assets/apps-imgs/<slug>.<ext>`.
3. Append one object to the `apps` array in `src/app/app.ts`, satisfying `AppCard`:
   `icon`, `name`, `description`, `badges[]`, `url`, `apkUrl`, optional `iosHint`.
4. Build and deploy the site.

That is the whole pattern. **All four steps have already been performed for Tu Combustible
RD** on `main` — see §0.3.

## 4. App catalog

- **Location:** `src/app/app.ts:78-105`, field `apps` on the `App` component class.
- **Format:** a hardcoded TypeScript array literal, typed `AppCardModel[]`, compiled into
  the main bundle. Not MDX, not JSON, not a database, not a CMS. `[verified]`
- **Entry shape:** `src/app/shared/models/app-card.model.ts`

```ts
export interface AppCard {
  icon: string;          // path under /assets, e.g. '/assets/apps-imgs/music-hub.png'
  name: string;
  description: string;
  badges: string[];      // rendered as <app-badge variant="tech" size="sm">
  /** Live web app. Empty string renders the button as "coming soon". */
  url: string;
  /** Android APK. Empty string renders the button as "coming soon". */
  apkUrl: string;
  /** Shown under the buttons for iPhone users. */
  iosHint?: string;
}
```

Example — the Tu Combustible RD entry already on `main` (`app.ts:93-104`):

```ts
{
  icon: '/assets/apps-imgs/tu-combustible-rd.svg',
  name: 'Tu Combustible RD',
  description:
    'Fuel and running-cost tracker for Dominican drivers: log every fill-up, see your real km/gal and cost per kilometre, and keep expenses and maintenance per vehicle. Prices use the weekly MICM reference. Everything stays on your device.',
  badges: ['React Native', 'Expo', 'TypeScript', 'PWA'],
  url: 'https://tu-combustible-rd.vercel.app',
  apkUrl: 'https://github.com/XavielT/tu-combustible-rd/releases/latest',
  iosHint: 'On iPhone: open the app in Safari, then Share → Add to Home Screen.',
}
```

- **To add an app you must edit:** `src/app/app.ts` (one array entry) and add one file
  under `public/assets/apps-imgs/`. Nothing else. There is no separate registry, route
  table or config to keep in sync. `[verified]`

**Note:** the site has a *second*, parallel catalog — `projects: ProjectCard[]`
(`app.ts:108-141`, model `project-card.model.ts`) with a different shape
(`image`/`title`/`variant`, no `apkUrl`). Apps and projects are deliberately distinct;
the comment at `app.ts:76-77` states the intent: "Apps you can actually install and use,
as opposed to source-code projects." `[verified]`

## 5. Existing i18n

| Question | Answer |
|---|---|
| Any i18n library? | **No.** `@angular/localize` is not installed, no `i18n` block in `angular.json`, no third-party library. `grep -rniE "i18n\|locale\|translate"` over `src/`, `api/` and `angular.json` returns **one** hit. `[verified]` |
| Locale config anywhere? | None. No `LOCALE_ID` provider, no locale files, no `angular.json` `i18n` section. `[verified]` |
| `lang` attribute set? | Yes — `src/index.html:2`, `<html lang="en">`, static. `[verified]` |
| Where do user-facing strings live? | Two places: literal text in the 11 component templates, and the four data arrays in `src/app/app.ts` (`apps`, `projects`, `skills`, `certificates`). `[verified]` |
| Rough string count | **≈100 translatable strings.** 77 in templates (69 text nodes + 8 `placeholder`/`title`/`alt` attributes), plus ~23 in `app.ts` data (6 app `name`/`description`/`iosHint`, 8 project `title`/`description`, plus section labels). Server-side: 19 more literals in `api/contact.ts` (HTTP error messages + email body). `[inferred — grep-based count, ±10]` |
| Hardcoded strings inside components? | Yes, everywhere. Concentrations: `app.html` (23 text + 4 attrs), `contact-form.html` (16 + 7), `navbar.html` (7), `footer.html` (5), `app-card.html` (4 + 3). Also in TS: `contact-form.ts:22,99,155` (`'Select an option'`). `[verified]` |

**The site is currently English**, with one Spanish string already mixed in —
`footer.html:5`, `"© 2026 Xaviel Web. Todos los derechos reservados."` `[verified]`. G3
makes Spanish the default, so Phase 1 is a translation *and* a default-flip.

### Recommended library for this stack, with reasoning

**Port Music Hub's in-house i18n service.** Not `next-intl` (§0.1), and not
`@angular/localize`.

`/home/xaviel/dev2/music-hub/src/shared/` already contains a complete, working solution
for exactly this problem on exactly this framework:

- `services/i18n.service.ts` — a `@Injectable({providedIn:'root'})` holding
  `signal<Lang>`, a `t(key, params)` method with `{name}` interpolation, English fallback
  for missing keys, `localStorage` persistence under one key, and browser-language
  seeding that a stored choice overrides. `[verified]`
- `i18n/en.ts`, `i18n/es.ts` — plain TS dictionaries, statically imported. The file
  comment records the reasoning: two dictionaries of a few hundred short strings cost a
  few KB, and paying that avoids both a flash of raw keys on first paint and extra
  service-worker configuration — which matters directly for ADR-06.
- `i18n/t.pipe.ts` — the template-side pipe.
- `i18n/renders-in-spanish.spec.ts` — a regression test for the default locale.
- A `TranslationKey` union type gives the "typed key surface" ADR-05 asks for.

Reasons to prefer it over the alternatives:

1. **`@angular/localize` is the wrong tool here.** It compiles one bundle *per locale* at
   build time and needs a distinct deploy path per language. Switching locale means a full
   page load from a different bundle, and it is awkward to combine with a runtime selector
   whose choice persists.
2. **It is already proven on this exact problem**, in the same language pair, by the same
   author, and it is the site's regression canary anyway.
3. **Zero new dependencies**, which conventions rule 3 asks for.
4. ~100 strings is well inside what a plain dictionary handles comfortably.

**The original ADR-05 required routed locales (`/es/...`, `/en/...`) and this site has no
router at all** (`app.routes.ts:3`). Routed locales would mean inventing a routing layer
for a single-page anchor-scroll site purely to carry a locale segment.

> **RESOLVED 2026-09-13 — the runtime selector was chosen.** ADR-05 has been rewritten
> accordingly ("Runtime language selector for i18n"), and `PROMPT-01-i18n.md` rewritten to
> match. Locale is application state persisted in `localStorage`; no routing, no
> `hreflang`, no per-locale paths. See §9.4.1.

## 6. Existing auth

| Question | Answer |
|---|---|
| Auth today? | **None.** `grep -rniE "auth\|login\|signin\|session\|jwt"` over `src/` and `api/` returns **zero** matches. `[verified]` |
| Provider | None. No Supabase, NextAuth, Clerk, Auth0, Firebase — none installed, none referenced. `[verified]` |
| Session handling | None. No cookies set, no tokens stored, no `localStorage`/`sessionStorage` use anywhere in `src/`. `[verified]` |
| Protected routes today? | None — there are no routes (§1). Every byte the site serves is public. `[verified]` |
| User/profile table? | None. The site has no database of any kind. `[verified]` |

Phase 2 starts from absolute zero on this site. Music Hub's `auth.service.ts`,
`admin.service.ts`, `invites.service.ts` and `guards/admin.guard.ts` are a usable
reference implementation against the same `x-core` project — see §7.

## 7. Supabase / x-core

| Question | Answer |
|---|---|
| Client library + version | **None installed in `xaviel-web-v2`.** `@supabase/supabase-js` is absent from `package.json`. `[verified]` |
| Client init location(s) | None. `[verified]` |
| Env var names (redacted) | Only `RESEND_API_KEY` (and Vercel's own `VERCEL_OIDC_TOKEN`) in `.env` / `.env.local`. No Supabase vars. `[verified]` |
| Which project is it pointed at? | N/A — the site has no Supabase connection. `[verified]` |
| SSR / middleware session handling? | N/A, and **not possible as built** — the site is a client-rendered SPA with no server layer beyond `api/contact.ts`. `[verified]` |
| Generated types? | None, in either repo. `[verified]` |
| Migrations directory? | **None.** `music-hub/supabase/` contains only `functions/link-metadata/` and `functions/admin-users/`. There is no `supabase/migrations/`; the `x-core` schema is managed outside version control (dashboard or manual SQL). `[verified]` |

**Every Supabase reference found in `xaviel-web-v2`:** exactly two, both prose in the
Music Hub card — `app.ts:83` (the word "Supabase" in the description) and `app.ts:84`
(the string `'Supabase'` in `badges`). Neither is code. `[verified]`

### What is known about `x-core`, from the Music Hub repo

This is the only source of truth available; it is second-hand for this cycle.

- **Project ref:** `nakgrkcqyuycadeuenuw`, URL `https://nakgrkcqyuycadeuenuw.supabase.co`.
  `music-hub/src/environments/environment.ts:6` `[verified]`
- **Confirmed to be `x-core`** by the file's own comment: *"Project: x-core (shared
  backend for all personal apps)"* (`environment.ts:3`). This directly confirms the brief's
  assumption that `x-core` is one shared project. `[verified]`
- **Dev and prod are the same project** — `environment.development.ts:2`: *"Same x-core
  project as production — there is no separate dev project."* `[verified]`
- **Credentials are committed on purpose**, URL and anon key in plain source, with the
  comment *"The anon key is public-safe (RLS protects the data), so these files stay
  committed"* and *"Never paste the service_role key here."* This matches the conventions
  table. `[verified]`
- **Client config** (`supabase.service.ts:34-44`): single root-injected `SupabaseClient`,
  `persistSession`, `autoRefreshToken`, `detectSessionInUrl`, `storage: localStorage`,
  `storageKey: 'music-hub-auth'`, and `flowType: 'implicit'` — chosen deliberately over
  PKCE because PKCE breaks password-reset links opened outside the requesting browser.
  The trade-off is documented at length in the file. `[verified]`
- **Admin authorization already follows ADR-04.** `admin.service.ts:24-30`: the listing is
  a `security definer` function `admin_user_overview()` that checks `is_admin()` itself,
  and the four privileged actions go through the `admin-users` Edge Function, which
  re-checks the caller before using the service-role key — *"That key never reaches this
  app."* RPCs seen: `admin_user_overview`, `list_invites`, `add_invite`, `remove_invite`,
  `my_upload_allowance`, `replace_playlist_songs`, `provision_worker`,
  `claim_download_request`. A `profiles` table carries `is_admin`, `role`, `disabled`,
  `language`, `onboarded_at` (`auth.service.ts:21`, `models/profile.model.ts:18`).
  `[verified]`
- **Schema namespacing:** Music Hub uses the default `public` schema — no
  `db: { schema: ... }` in its client config. ADR-03's dedicated-schema approach would be
  **new** for `x-core`, not a continuation. `[verified]`
- **Not verified:** whether RLS is actually enabled on those tables, what the full schema
  is, or whether a `tu_combustible` schema exists. No database access in this phase.

## 8. Tu Combustible RD

Repo: `/home/xaviel/dev2/tu-gasolina-rd` → `git@github.com:XavielT/tu-combustible-rd.git`,
branch `main`, version 1.1.0. Note the **directory name and the app/repo name differ**
(`tu-gasolina-rd` vs `tu-combustible-rd`). `[verified]`

### Stack

| Aspect | Value |
|---|---|
| Framework + version | Expo SDK ~57.0.14, React Native 0.86.2, React 19.2.3, React DOM 19.2.3, react-native-web ~0.21.0 `[verified]` |
| Language | TypeScript ~6.0.3 `[verified]` |
| Styling | `StyleSheet.create()` — 12 occurrences across `app/` and `components/`. A shared token file `constants/theme.ts` defines `colors` (canopy `#0B1F1C`, receipt `#F3EFE4`, led `#F0B429`, nozzle `#E85D4C`, teal `#3C9A8A`…) and `fonts` (Syne / Figtree / IBM Plex Mono via `@expo-google-fonts`). No CSS, no Tailwind. `[verified]` |
| Build tool | Metro (`"bundler": "metro"`, `"output": "static"`). `npm run build` = `expo export -p web && node tools/finalize-web.mjs` `[verified]` |
| Package manager | npm (`package-lock.json`) `[verified]` |
| Router | `expo-router` ~57.0.14, file-based, `main: "expo-router/entry"`, `experiments.typedRoutes: true` `[verified]` |

Deployed separately to Vercel: `outputDirectory: "dist"`, `cleanUrls: true`, a rewrite for
`/carga/:id`, long-cache headers for `/_expo/static/` and `/assets/`, and security headers
including `X-Frame-Options: DENY`. `[verified: vercel.json]`

### Features / screens

| Screen or route | What it does |
|---|---|
| `app/_layout.tsx` | Root Stack. Loads fonts, mounts `StoreProvider`, declares all non-tab screens. |
| `app/onboarding.tsx` | First-run flow — creates the first vehicle. |
| `app/(tabs)/_layout.tsx` | Five-tab bar (Ionicons): Inicio, Cargar, Historial, Cifras, Más. |
| `app/(tabs)/index.tsx` — "Inicio" | Dashboard for the active vehicle. |
| `app/(tabs)/cargar.tsx` — "Cargar" | Log a fill-up (`FillUpForm`). |
| `app/(tabs)/historial.tsx` — "Historial" | List of past fill-ups; tap to edit. |
| `app/(tabs)/cifras.tsx` — "Cifras" | Economy figures — km/gal, cost per km (largest screen, 241 lines). |
| `app/(tabs)/mas.tsx` — "Más" | Vehicle switch/add/remove, MICM reference prices, JSON backup export/import, reset-all. |
| `app/vehiculo.tsx` — "Nuevo vehículo" | Modal; create/edit a vehicle (`VehicleForm`). |
| `app/gastos.tsx` — "Gastos y mantenimiento" | Expenses and maintenance reminders (176 lines). |
| `app/precios.tsx` — "Precios MICM" | View and hand-edit the six reference prices. |
| `app/carga/[id].tsx` — "Editar carga" | Edit or delete one fill-up. |
| `app/+not-found.tsx`, `app/+html.tsx` | 404; web HTML shell. |

UI is **entirely in Spanish, hardcoded**. There is no i18n layer — `components/T.tsx` is a
*typography* wrapper (font-face selection), not a translation component. `lib/format.ts`
hardcodes `es-DO`. `[verified]`

### Persistence — extra care here

- **Mechanism:** `@react-native-async-storage/async-storage` 2.2.0. **Not** SQLite, not
  IndexedDB. On the web build AsyncStorage is backed by `localStorage`. `[verified:
  lib/storage.ts:1]`
- **⚠ `expo-sqlite` ~57.0.1 is installed and registered as an Expo plugin
  (`app.json` plugins) but is never imported** — `grep -rn "expo-sqlite\|SQLite" app lib
  components` returns nothing. Anyone reading the dependency list alone would wrongly
  conclude the app uses SQLite. `[verified]`
- **Keys / stores / tables:** exactly **one** key — `'tu-combustible-rd/v1'`
  (`lib/storage.ts:6`). Its value is the *entire* `AppData` object serialised with
  `JSON.stringify` (`storage.ts:48`). There are no per-entity keys and no rows.
- **How are IDs generated:** `lib/format.ts:53` —
  `globalThis.crypto?.randomUUID?.() ?? \`id_${Date.now()}_${Math.random().toString(16).slice(2)}\``.
  Client-generated, which satisfies ADR-02 — **but the fallback branch is not a UUID** and
  will not fit a Postgres `uuid` column. `[verified]`
- **Are timestamps stored:** `createdAt` only, on all four entities, ISO-8601 via
  `new Date().toISOString()`. **There is no `updatedAt` anywhere.** An edit
  (`upsertFillUp` etc.) mutates the object in place and leaves `createdAt` untouched, so
  after an edit there is *no record at all* of when it changed. `[verified: store.tsx:104-113]`
- **Deletes: HARD.** Every delete is `Array.prototype.filter` — `deleteFillUp`
  (`store.tsx:116`), `deleteExpense` (`:135`), `deleteReminder` (`:154`). `deleteVehicle`
  (`store.tsx:86-98`) additionally **cascades**, hard-deleting all the vehicle's fill-ups,
  expenses and reminders, then reassigning `activeVehicleId`. No `deletedAt` field exists
  on any type. `[verified]`
- **Write cadence:** `store.tsx:42-45` — a `useEffect` on `[data, ready]` re-serialises
  and rewrites the whole blob after *every* mutation, with errors swallowed
  (`.catch(() => {})`).

Data model, field by field — reproduced verbatim from `lib/types.ts`:

```ts
// lib/types.ts:1-10
export const FUEL_TYPES = ['premium','regular','gasoil_regular','gasoil_optimo','glp','gnv'] as const;
export type FuelType = (typeof FUEL_TYPES)[number];
export type FuelGroup = 'gasolina' | 'gasoil' | 'glp' | 'gnv';

// lib/types.ts:14-21
export type Vehicle = {
  id: string;                 // crypto.randomUUID() (see fallback caveat above)
  name: string;
  plate: string;
  defaultFuelType: FuelType;
  tankVolume: number | null;
  createdAt: string;          // ISO-8601
};

// lib/types.ts:23-36
export type FillUp = {
  id: string;
  vehicleId: string;          // → Vehicle.id  (no FK enforcement; cascade is manual)
  occurredAt: string;         // ISO-8601, user-chosen
  odometerKm: number;
  volume: number;             // gal, or m³ for gnv
  pricePerUnit: number;       // RD$
  totalDop: number;           // RD$
  fuelType: FuelType;
  isFullTank: boolean;
  station: string;            // free text, seeded from STATIONS in lib/fuel.ts
  notes: string;
  createdAt: string;
};

// lib/types.ts:38-49
export const EXPENSE_CATEGORIES =
  ['maintenance','repair','insurance','tax','toll','parking','wash','other'] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

// lib/types.ts:51-60
export type Expense = {
  id: string;
  vehicleId: string;
  occurredAt: string;
  odometerKm: number | null;
  amountDop: number;
  category: ExpenseCategory;
  description: string;
  createdAt: string;
};

// lib/types.ts:62-71
export type MaintenanceReminder = {
  id: string;
  vehicleId: string;
  title: string;
  dueDate: string | null;
  dueOdometerKm: number | null;
  completedAt: string | null;   // completion is a timestamp, not a delete
  notes: string;
  createdAt: string;
};

// lib/types.ts:73-79
export type ReferencePrices = Record<FuelType, number>;   // 6 numeric keys
export type Settings = {
  activeVehicleId: string | null;
  referencePrices: ReferencePrices;
  priceWeekLabel: string;       // e.g. '15–21 ago 2026 (MICM)'
};

// lib/types.ts:81-87  — THIS is what the single AsyncStorage key holds
export type AppData = {
  vehicles: Vehicle[];
  fillups: FillUp[];
  expenses: Expense[];
  reminders: MaintenanceReminder[];
  settings: Settings;
};

// lib/types.ts:89-96 — derived at runtime, never persisted
export type EconomyPoint = {
  fillUpId: string; occurredAt: string; distanceKm: number;
  volume: number; kmPerUnit: number; costPerKm: number | null;
};
```

Relationships: `Vehicle 1—N FillUp | Expense | MaintenanceReminder`, joined by
`vehicleId`, enforced only by convention in `store.tsx`. `Settings.activeVehicleId` is a
soft pointer into `vehicles` with a fallback to `vehicles[0]` (`store.tsx:169-172`).

**Existing migration surface — useful for Phase 5.** `lib/backup.ts` already implements a
versioned JSON export/import:

```ts
type BackupFile = {
  app: 'tu-combustible-rd';
  version: number;      // BACKUP_VERSION = 1
  exportedAt: string;   // ISO-8601
  data: AppData;
};
```

`exportBackup` writes to cache and hands off to `expo-sharing`; `importBackup` reads via
`expo-document-picker` and accepts either the wrapped shape or a bare `AppData`
(`backup.ts:50-51`). `normalizeData` (`storage.ts:20-35`) already defensively fills
missing collections and merges `referencePrices` over defaults — the natural hook for a
schema migration. `[verified]`

⚠ `backup.ts` depends on `expo-file-system`, `expo-sharing` and `expo-document-picker`,
which are native modules. Whether export/import works in the deployed **web** build is
**UNKNOWN — not executed in this read-only phase**; `Sharing.isAvailableAsync()` is
checked (`backup.ts:32`) so it degrades rather than crashes, but the import path is
unguarded. `[inferred]`

### External data

| Source | What it provides | Shape | Frequency |
|---|---|---|---|
| **None** | — | — | — |

The app makes **zero network requests**. `grep -rn "fetch(\|axios\|https://"` over `app/`,
`lib/`, `components/` and `tools/` returns one match, and it is a URL inside a code comment
(`components/Themed.tsx:3`). `[verified]`

Fuel prices are **static constants the user edits by hand**:
`DEFAULT_REFERENCE_PRICES` in `lib/fuel.ts:87-94` (premium 341.1, regular 307.5,
gasoil_regular 259.8, gasoil_optimo 293.1, glp 135.2, gnv 43.97 RD$) with
`DEFAULT_PRICE_WEEK = '15–21 ago 2026 (MICM)'`. The file comment is explicit: *"MICM week
of 15–21 Aug 2026 — reference only, not a live feed."* They seed `Settings.referencePrices`
and are editable in `app/precios.tsx`. **There is no MICM API and no scraper.** The site's
card description ("Prices use the weekly MICM reference") is accurate but could be read as
implying a live feed. `[verified]`

### Dependencies

| Dependency | Version | Conflicts with site? |
|---|---|---|
| `react` | 19.2.3 | **Yes, fundamentally** — the site is Angular. Cannot share a runtime. |
| `react-dom` | 19.2.3 | Same. |
| `react-native` | 0.86.2 | Same. |
| `react-native-web` | ~0.21.0 | Same. |
| `expo` | ~57.0.14 | Needs Metro; site uses `@angular/build` (esbuild/Vite). Irreconcilable bundlers. |
| `expo-router` | ~57.0.14 | **Yes** — owns the URL. Site has no router but does own `/`. |
| `react-native-reanimated` | 4.5.1 | Needs a Babel plugin + worklets; no Babel in the site's build. |
| `react-native-worklets` | 0.10.1 | Same. |
| `react-native-screens` / `-safe-area-context` | ~4.26.0 / ~5.7.0 | Native modules; web shims only. |
| `@react-native-async-storage/async-storage` | 2.2.0 | localStorage on web. No direct conflict, but the key namespace would be shared if co-hosted. |
| `expo-sqlite` | ~57.0.1 | **Dead weight — declared, never imported.** |
| `expo-file-system` / `-sharing` / `-document-picker` | ~57.x | Native; web support partial. Powers backup/restore. |
| `expo-font` + `@expo-google-fonts/{figtree,ibm-plex-mono,syne}` | ^0.4.x | Site self-hosts its own fonts from `public/assets/fonts/`. Would double the font payload if merged. |
| `@expo/vector-icons` | ^15.0.2 | Site uses hand-made SVGs from `public/assets/icons/`. |
| `expo-constants`, `-linking`, `-splash-screen`, `-status-bar`, `-symbols`, `-web-browser` | ~57.x | Expo-runtime-only. |
| `typescript` (dev) | ~6.0.3 | **Version skew** — site is ~5.9.2. Only matters if the repos ever merge. |

The two dependency sets share **nothing**. That is not a problem for pattern (c), and it
is a hard blocker for any pattern that is not (c).

## 9. Conflict analysis

ADR-01 says to mirror the Music Hub pattern. Because that pattern is (c) — link out — and
because §0.3 shows it has already been applied, most of the risk this section was written
to surface has evaporated. What is left is listed honestly, with the genuine risks first.

| Risk | Severity | Why | Possible mitigation |
|---|---|---|---|
| **Phase 4 has no work left** | High (process) | `main` already contains the card, icon, live URL, APK link and iOS hint (§0.3). Running Phase 4 as written risks a second, divergent implementation. | Re-scope Phase 4 to verification only: confirm both URLs resolve, confirm the icon renders, confirm the card matches Music Hub's presentation. |
| **ADR-02 is not satisfiable without changing the app's store** | High | No `updatedAt` on any entity → last-write-wins by `updated_at` has nothing to compare. Hard deletes → any offline delete is resurrected on the next pull. One blob, not rows → nothing to version per record. (§8.3) | Phase 5 must first restructure `AppData` (add `updatedAt` + `deletedAt` to all four types, write a `normalizeData` migration backfilling `updatedAt = createdAt`), *then* build sync. Budget this as its own step. |
| **The non-UUID ID fallback** | Medium | `lib/format.ts:53` falls back to `id_<ms>_<hex>` when `crypto.randomUUID` is unavailable (older WebViews, non-secure contexts). Those IDs will be rejected by a Postgres `uuid` column and will break idempotent re-push. | Replace the fallback with a real v4 generator, or make the cloud PK `text`. Decide before writing the schema. |
| **Cloud sync lands in a repo the site does not control** | Medium | ADR-02/ADR-03 describe work inside Tu Combustible RD — a separate repo with a separate deploy and a separate release cycle (incl. an APK). Phases 2 and 5 therefore span two repos and two deploys, which no prompt currently accounts for. | Decide explicitly which repo Phase 5 branches in, and how the APK gets rebuilt and re-released afterwards. |
| **ADR-03's dedicated schema is new ground for `x-core`** | Medium | Music Hub uses `public` with no `db.schema` override (§7). ADR-03 itself flags the silent-404 failure mode: the schema must be added to the exposed list in Project Settings → API *and* passed as `db: { schema }`. Nobody has done this on `x-core` before. | Verify with a throwaway table before building against it, as ADR-03 instructs. |
| **Spanish app inside an English site** | Low | The site is English (§5) and the app is Spanish-only with `es-DO` hardcoded. G3 flips the site to Spanish-default, which converges them — but the *app* still has no `en`. | Confirm whether the app is in scope for i18n at all (Q4). |
| CSS collisions | **None** | Different origins. `StyleSheet.create` vs global CSS never meet. | — |
| Routing conflicts | **None** | Different origins. The site has no router; expo-router owns its own origin's paths. | — |
| Build incompatibility | **None (as linked)** | Metro and `@angular/build` never run in the same build. Would be fatal under pattern (a), (b) or (d). | — |
| Bundle size | **None** | Nothing of the app ships in the site's bundle. The site's only cost is one 29-line SVG. The site's production budget (500 kB warn / 1 MB error, `angular.json:31-40`) is untouched. | — |

### Stack comparison

| Aspect | Site | Tu Combustible | Compatible? |
|---|---|---|---|
| Framework | Angular 21 | React 19.2.3 / React Native 0.86.2 | **No** — but irrelevant while linked |
| Language | TypeScript 5.9.2 | TypeScript 6.0.3 | Skew only; independent compilations |
| Styling | CSS + CSS vars + Tailwind (`tw-`) | `StyleSheet.create` + `constants/theme.ts` | **No** — no shared design tokens |
| Build | `@angular/build` (esbuild) | Metro (`expo export -p web`) | **No** |
| Router | none (`routes: []`) | expo-router, file-based | N/A while separate |
| Hosting | Vercel, `dist/portfolio-v2/browser` | Vercel, `dist` | Yes — two independent projects |
| Storage | none | AsyncStorage (localStorage on web) | Yes — different origins, different namespaces |
| PWA | **none** | manifest + hand-written `sw.js` + full icon set | App is ahead of the site |
| i18n | none (English) | none (Spanish, hardcoded `es-DO`) | Neither has a layer |
| Package manager | npm | npm | Yes |

### 9.4 ADR conflicts — what the code contradicts

Per the prompt's closing instruction ("the ADRs were written from the domain, not from the
code, and the code wins").

> **Acted on 2026-09-13.** `00-context/02-architecture-decisions.md` has been rewritten
> against this section. ADR-05 reversed its decision; ADR-01 through ADR-04 and ADR-06 kept
> their decisions and had their Next.js vocabulary and stale premises corrected. The four
> downstream documents that contradicted the new ADR-05 were corrected too — see §9.5.

1. **ADR-05 assumed a router that does not exist.** It mandated `/es/...` / `/en/...` URL
   segments. `app.routes.ts:3` is `[]` and the site navigates by anchor. Routed locales
   would require building a routing layer first, for a single page. Its stated rationale
   (indexability, shareable per-language URLs) also assumed server rendering — this SPA
   serves one `index.html` for every path via `vercel.json`, so crawlers see whatever the
   client renders regardless. **RESOLVED: the runtime selector was chosen**, ADR-05 was
   rewritten, and the cost (no per-language shareable or independently indexable URLs) is
   recorded in the new ADR.
2. **ADR-05's library suggestions were all Next.js.** `next-intl`, `next-i18next`,
   `react-i18next` — none applies. See §5. **RESOLVED: no library; Music Hub's
   `I18nService` is ported instead.**
3. **ADR-04's mechanisms are partly unavailable.** "Route middleware" and "runs
   server-side only" presuppose Next.js middleware and server actions. This site has
   neither; the only server surface is `api/contact.ts` as a Vercel function. The RLS-first
   principle survives intact and is *already* how Music Hub does it (§7) — but the
   defense-in-depth layer above it must be an Angular route guard plus a Vercel function,
   not middleware. `NEXT_PUBLIC_*` naming is moot; Angular has no such convention (and
   Music Hub commits its config to `src/environments/` rather than using env vars at all).
4. **ADR-01's premise is thinner than it reads.** "Mirror the Music Hub pattern" sounds
   like an architectural constraint; in practice it means "add an array entry and an
   icon." ADR-01 asks Phase 0 to flag problems rather than silently improve them — §3's
   *Friction* list is that flag, with item 6 (duplicated platform work across three repos)
   as the one worth a decision.
5. **ADR-02 conflicts with the app as built** — see the table above and §8.3.
6. **ADR-03 is unprecedented on `x-core`**, not a continuation — see §7.
7. **ADR-06's iOS-install caveat is already handled**, in the app and on the card
   (`iosHint`, `app.ts:103`). No conflict; noted so Phase 7 does not redo it.
8. **The brief's assumption "Tu Combustible RD currently persists locally
   (localStorage/IndexedDB/SQLite)" is correct in spirit and wrong in specifics** — it is
   AsyncStorage over localStorage, as a *single blob*, and the `expo-sqlite` dependency is
   a decoy (§8.3). The brief marks this the highest-impact assumption; §8.3 answers it.
9. **Path error in the Phase 0 prompt.** It names the main site as
   `/home/xaviel/dev/xaviel-web-v2`, which **does not exist**. The canonical checkout is
   `/home/xaviel/dev2/xaviel-web-v2` (this one). Likewise, the context package is not at
   `docs/imp-11092026/00-context/` in the repo but at
   `/home/xaviel/improvements/imps xaviel-web/september 2026/imp 11092026/`. `[verified]`

### 9.5 Documents changed by the ADR revision (2026-09-13)

The ADR-05 reversal, and ADR-04's correction from Next.js middleware to an Angular guard,
both propagate beyond the ADR file. These documents mandated the opposite and were
corrected, so no phase prompt now contradicts its own ADR. None of these files is under
version control; a pre-edit copy of `00-context/`, `02-prompts/` and `04-tracking/` was
taken first.

| Document | What changed |
|---|---|
| `00-context/02-architecture-decisions.md` | All six ADRs revised. ADR-05 rewritten (decision reversed). ADR-01 records the real pattern and that G1 shipped; ADR-02 gains the data-model precondition; ADR-03 notes it is new ground for `x-core`; ADR-04 swaps Next.js middleware for an Angular guard + Edge/Vercel function; ADR-06 records the site's zero-baseline and the app's finished PWA |
| `02-prompts/PROMPT-01-i18n.md` | Rewritten. Removed locale routing, the cookie, `hreflang` and per-locale metadata; added the Music Hub port, the `app.ts` data arrays as a second extraction source, storage-failure handling, and corrected verification steps |
| `02-prompts/PROMPT-02-supabase-auth.md` | Dropped the browser/server/middleware client trio and cookie sessions (no server exists) for one root-provided service with `localStorage` persistence; points at Music Hub's client as reference and flags its `flowType: 'implicit'` as a choice not to copy blindly |
| `02-prompts/PROMPT-03-admin-shell.md` | Dropped the `/es/admin` reconciliation and the "protect server-side" mitigation (no server exists); the middleware stop-condition became a guard stop-condition; added that Phase 3 must stand up the router for the first time |
| `02-prompts/PROMPT-07-pwa.md` | One Spanish manifest instead of a locale-aware one; language must not become a cache key; lint expectations corrected |
| `00-context/03-conventions.md` | Example commit messages; two new anti-patterns (locale in the URL; assuming a Next.js-shaped stack) |
| `04-tracking/PROGRESS.md` | Phase 1 notes capture the localStorage key and data-array keying instead of routing shape; Phase 2 notes capture flowType and config location instead of server client and middleware; final regression checklist drops the `/en/` URL and `hreflang` rows and adds detection, persistence and storage-blocked rows |

Two things deliberately **not** changed: `01-project-brief.md` (its G3 and its definition
of done never required URLs — a runtime selector satisfies them as written), and the "both
locales" phrasing in PROMPT-04 and PROMPT-06, which remains true when read as "both
languages".

## 10. PWA readiness

### The site — `xaviel-web-v2`

| Item | Present? | Notes |
|---|---|---|
| `manifest.json` | **No** | No `manifest.json` / `manifest.webmanifest` in `public/` or `src/`; no `<link rel="manifest">` in `index.html`. `[verified]` |
| Service worker | **No** | `@angular/service-worker` not installed, no `ngsw-config.json`, no `provideServiceWorker`, no hand-written `sw.js`. `grep -rniE "manifest\|service-?worker\|ngsw"` over `src/ public/ api/ angular.json package.json` returns **zero** hits. `[verified]` |
| Icon set | **Partial** | `public/favicon.ico`, `public/xw.ico`, `public/assets/img/xaviel-web.ico`. **No PNGs at 192/512, no maskable variants, no apple-touch-icon.** `[verified]` |
| Offline handling | **No** | Nothing cached; the site is unusable offline. `[verified]` |
| HTTPS in production | **Yes** | Vercel-hosted. `[verified]` |
| Installability today | **No** | Chrome requires a manifest with icons *and* a fetch handler. Both absent. `[verified]` |

**Missing for G5/ADR-06:** a `manifest.webmanifest` (name, short_name, start_url, scope,
display, theme/background colour, `lang: es`), PNG icons at 192 and 512 in both `any` and
`maskable`, an apple-touch-icon, a service worker with an offline shell, a `<link
rel="manifest">` and `<meta name="theme-color">` in `src/index.html`, and cache headers in
`vercel.json` for the SW and manifest. Angular's own `@angular/service-worker` +
`ngsw-config.json` is the natural fit and is what Music Hub uses — but note that
`@angular/build:application` is the modern builder and the service-worker integration
must be enabled on that target.

Also worth fixing while there: `src/index.html:2` says `lang="en"` and line 6 says
`<title>PortfolioV2</title>`.

### Tu Combustible RD — already a PWA

Ahead of the site on every line. `[verified]`

| Item | Present? | Notes |
|---|---|---|
| `manifest.webmanifest` | **Yes** | `public/manifest.webmanifest` — name, short_name "Combustible", `lang: "es-DO"`, `start_url: "/"`, `scope: "/"`, `display: "standalone"`, `orientation: "portrait"`, theme + background `#0B1F1C`, categories. |
| Service worker | **Yes** | Hand-written `public/sw.js`, `CACHE = 'tu-combustible-rd-v1'`, `skipWaiting()` + `clients.claim()`, old-cache cleanup on activate, cache-first for hashed `/_expo/` and `/assets/`. Its header comment explicitly notes Music Hub gets this from `@angular/service-worker` and Expo has no equivalent. |
| Icon set | **Yes, complete** | 192/512 `any`, 192/512 `maskable`, `apple-touch-icon-180`, `favicon.png`. |
| Offline handling | **Yes** | Deliberate: *"so a driver at a pump with no signal still gets the app."* |
| HTTPS in production | **Yes** | Vercel. |
| Installability today | **Yes** | Manifest + icons + fetch handler all present. Android APK also published to GitHub Releases. |

Its `sw.js` is a ready-made reference for Phase 7, including the ADR-06 caching discipline
(only same-origin GETs; hashed assets cache-first) — and since the site has no
authenticated API today, ADR-06's "never cache authenticated Supabase responses" is a
forward-looking constraint for after Phase 2, not a current one.

---

## Summary for the operator

### Music Hub pattern, in three sentences

Music Hub is **not integrated into this site in any technical sense** — it is a separate
Angular 19 repository (`XavielT/music-hub`) on its own Vercel deployment with its own
Supabase connection, PWA and Android build, and the site contains none of its code,
routes, assets or config. The entire "integration" is one object literal in the hardcoded
`apps` array at `src/app/app.ts:79-92` plus one hand-copied icon at
`public/assets/apps-imgs/music-hub.png`, rendered by `app-card.html` as an
`<a target="_blank">` that navigates the visitor off-site. Reproducing it means deploying
the app, dropping in an icon, and appending an array entry — four steps, no build changes,
which is exactly what **already happened for Tu Combustible RD on `main`** in commits
`3c3ccc4`, `c9cbdbf` and `bfb177a`.

### Top three risks for the Tu Combustible integration

1. **Phase 4 is already done, and re-running it will create divergence.** The card, the
   real SVG icon, the live URL, the APK link and the iOS hint are all on `main`. Phase 4
   should be re-scoped to verification, or skipped.
2. **The app's local store cannot support ADR-02's sync contract.** No `updatedAt` on any
   entity, hard deletes everywhere (cascading on vehicle delete), and one JSON blob rather
   than rows. Phase 5 needs a preliminary data-model migration inside `tu-gasolina-rd` —
   add `updatedAt`/`deletedAt`, backfill via `normalizeData` — before any sync code is
   written, and that work lives in a **second repository with its own deploy and APK
   release cycle** that no prompt currently accounts for.
3. **The ADRs were written for Next.js and this is an Angular SPA with no router.** ADR-05
   (routed locales) and parts of ADR-04 (middleware, server-only execution) describe
   machinery that does not exist here. Phase 1 cannot start until the locale-routing
   question is settled.

### Findings that contradict the ADRs

Nine, listed in full in §9.4. The material ones: ADR-05's routed locales and its library
list (§9.4.1–2); ADR-04's middleware/server-side layers (§9.4.3); ADR-02 vs the app's
actual store (§9.4.5, §8.3); ADR-03's dedicated schema being new to `x-core` rather than a
continuation of it (§9.4.6, §7); and ADR-01's premise being thinner than it reads
(§9.4.4). Plus two factual errors in the Phase 0 prompt itself: the main-site path and the
context-package location (§9.4.9).

**All nine have been acted on.** The ADR file was rewritten on 2026-09-13, along with the
four downstream documents that contradicted it — see §9.5 for the change list.

### Questions needing an answer before Phase 1

**Q1 — ANSWERED: the runtime selector.** *(no longer blocking)*
ADR-05 has been rewritten as "Runtime language selector for i18n": locale is application
state persisted in `localStorage`, implemented by porting Music Hub's `I18nService` + `t`
pipe + `es.ts`/`en.ts`. No routing, no `hreflang`, no locale paths. The cost — no
per-language shareable or independently indexable URLs, and no way back without adding SSR
or prerendering — is recorded in the ADR itself. `PROMPT-01-i18n.md` has been rewritten to
match, so Phase 1 can start.

**Q2 — Should Phase 4 be re-scoped to verification only?** Given §0.3, my proposal is:
confirm both links resolve, confirm the SVG icon renders at card size, confirm parity with
the Music Hub card — then close it. Anything else risks a second implementation.

**Q3 — Which repo does Phase 5 branch in, and who rebuilds the APK?** Cloud sync is code
inside `tu-gasolina-rd`, not this site. Conventions say one phase per branch; that phase's
branch would live in a different repository, and shipping it means a new web deploy *and*
a new APK release.

**Q4 — Does i18n cover the app, or only the site?** The site is English (with one stray
Spanish string in the footer) and flips to Spanish-default under G3. The app is
Spanish-only with `es-DO` hardcoded and no i18n layer. If the app is in scope, that is a
second, larger i18n job in the other repo.

**Q5 — Confirm the schema decision for `x-core`.** ADR-03 wants a dedicated Postgres
schema; Music Hub — the only existing tenant — uses `public`. Adopting a schema means
exposing it in Project Settings → API and setting `db: { schema }`, and leaves `x-core`
with two conventions. Still the right call, but confirm it is a deliberate change rather
than an assumed continuation.

**Q6 — Should `02-architecture-decisions.md` be rewritten before Phase 1?** Per the
prompt's own "the code wins", at minimum ADR-05, ADR-04 and ADR-02 need revising against
§9.4.

---

## Verification notes

- **Read-only honoured.** No application code, config, dependency or migration was touched
  in any of the three repositories. No installs, no builds, no `git fetch`, no network
  access. `git status` was clean at the start of this phase, and the only file added is
  this one.
- **Nothing was executed.** No `npm run build`, no `npm test`, no `expo export`, no
  browser. Every claim is read from source. Consequently these remain unverified: that the
  site builds; that the 10 spec files pass; that either deployed URL currently resolves;
  that `x-core`'s RLS is enforced; that Tu Combustible RD's backup/import works in the web
  build (§8.3).
- **Marked `[inferred]`:** the Vercel Git-integration deploy mechanism (no workflow file
  exists, but `.vercel/project.json` and `vercel.json` are present); the ≈100 string count
  (grep-based, ±10); the web-build behaviour of `lib/backup.ts`'s native modules.
- **Branch note.** A prior Phase 0 pass exists at `imp-11092026/phase-0-discovery` (commit
  `33549ac`), written from the now-stale `/home/xaviel/dev/xaviel-web-v2` checkout and
  without access to the `00-context/` documents. It has since diverged from `main`, whose
  Tu Combustible RD commits supersede its code changes. This pass therefore branches from
  `main` as `imp-11092026/phase-0-discovery-2` rather than rewriting shared history; the
  earlier document remains retrievable via
  `git show imp-11092026/phase-0-discovery:docs/imp-11092026/01-discovery/INVENTORY.md`.
