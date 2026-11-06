# Development

## Getting Started

Use Node.js `26.10.0` and npm `11.19.1`, as declared in `.nvmrc` and
`package.json`. With [nvm](https://github.com/nvm-sh/nvm#nvmrc) installed:

```bash
nvm install
nvm use
```

Check `npm --version`. If it differs from `11.19.1`, install the project version
under the selected Node.js installation:

```bash
npm install --global npm@11.19.1
```

Install the locked dependencies and start the development server:

```bash
npm ci
npm run dev
```

Use npm for dependency changes and commit the updated `package-lock.json`.
When upgrading the development tools, keep `.nvmrc`, `engines`, `packageManager`,
and these instructions in sync. The package metadata declares the expected
versions; it does not automatically install or switch Node.js or npm.

`.editorconfig` sets UTF-8, two-space indentation, LF line endings, and a final
newline. Trailing whitespace is preserved in Markdown for explicit line breaks.
`.gitattributes` normalizes text files to LF in Git and on checkout, while
automatically detected binary files are left unchanged.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/[locale]/page.tsx`. The page auto-updates as you edit the file.

## Internationalization

Uses `next-intl` with Czech (`cs`) as the default language. Supported locales:
`cs`, `en`, `de`, `fi`, `pl`. Translation catalogs are in `messages/`.

## Job administration

`/keystatic` manages vacancies with **Keystatic Cloud Free** (up to three team
members, including the technical administrator). Pro, Cloud Images and multiplayer
editing are not used. Configure the public project ID from Cloud settings as
`NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT=hokami/hokami` in the hosting environment.
An unconfigured deployment shows a setup
notice and its Keystatic API returns 503; it never enables filesystem writes.

For local editing, add `NEXT_PUBLIC_KEYSTATIC_LOCAL_MODE=true` to `.env.local`
and run `npm run dev`. Open `http://127.0.0.1:3000/keystatic`. This explicit local
writer is only enabled in development, even if the variable is set in production.
The loopback origin is allowed for Next.js dev resources. Keep the public site's
locale root layout separate from the admin root layout.

The admin uses the shared HOKAMI wordmark, self-hosted IBM Plex Sans / Mono and
Saira fonts, and the palette in `src/app/brand-theme.css`. The website's existing
Tailwind color names map to this palette. `src/app/keystatic/keystatic.css` maps it
to Keystar's tokens and scopes overrides to `data-hokami-admin`, including portal
providers. It keeps the native forms and WYSIWYG, with a fixed light palette and
no theme picker. This bridge targets Keystar 0.10; visually check forms, menus,
focus, validation feedback and the editor when updating Keystatic dependencies.

The `jobs` collection stores one `src/content/jobs/{slug}/index.json` per vacancy.
Keystatic owns these files' JSON formatting, so Prettier leaves them untouched.
`npm run content:check` still validates every record and image before the build.
Its required English fields are title, department, short description and main
text. Each language has a WYSIWYG main text, stored as inline Markdoc and rendered
on `/[locale]/jobs/{slug}`. Empty or whitespace-only English main texts cannot be
saved or built, including drafts. The title's slug is the stable entry identity:
do not regenerate it when editing an existing vacancy.

Cards use a translation only when its title, department and short description are
all present. Otherwise the entire card falls back to English and uses `lang="en"`.
`visibleLocales` independently selects which language versions show the vacancy;
completed translations never enable a language version automatically. All five
languages are selected by default. An empty selection hides the vacancy everywhere.
English content is required even when the English site version is not selected.
Draft entries are omitted. Published entries in the selected language versions
sort by ascending `order`, then slug.
Generic interface copy stays in the `messages/` catalogs. Cards link to their
localized detail page. Their Read more label always uses the page locale, even
when the vacancy text falls back to English; stored legacy `linkLabel` values
do not override it. Four shared subgrid rows align departments, titles,
descriptions and links across neighboring cards without truncating content.
A missing main-text translation independently falls back
to English with `lang="en"`, keeping the translated hero and interface. A disabled
locale, draft or missing entry returns not-found; switching to a disabled locale
from either language menu opens that locale's jobs list, preserving query params
and clearing the detail-page fragment. Only published, enabled URLs appear in SEO
alternates and the sitemap.

Proxy checks only a vacancy's publication metadata before rendering and rewrites
unavailable versions to the localized static not-found route. This preserves a
real HTTP 404 despite App Router streaming. The detail route allows blocking
navigation while resolving URL data; all known published jobs are prerendered.

Detail pages share the standard hero and footer, render rich content at the
site's 1200 px content width and link to the application form via a native anchor.
The form validates locally and retains values when displaying the unavailable
delivery message with the recruitment email. Several optional PDF/DOCX files can
be selected or dropped, up to 4,500,000 bytes in total. Files stay in browser
memory; delivery is not connected. The three original jobs' English main texts
were seeded from their existing English descriptions without adding job claims.

Images can be inserted into the WYSIWYG text. Only PNG, JPG/JPEG and WEBP files
are accepted, each at most **500,000 bytes (0.5 MB)**. Type is checked against the
file signature as well as the extension. Uploaded images get unique filenames
under `public/images/jobs/` and are stored in GitHub, without paid image hosting.
Invalid uploads are rejected by the editor; `npm run content:check` also checks
the image directory to catch files added directly to Git.

Cloud saves commit to the connected GitHub repository. Use its default `main`
branch for normal editing; Vercel's Git integration deploys that branch. A save
reaches the public site after a successful deployment. `npm run build` runs content
validation before Next.js. CI remains a separate process from Vercel deployments.
Before enabling production editing, check the Cloud account's repository access,
branch rules, Vercel commit-author permissions and the project's production branch
with a real save. Keep Cloud within the free three-user limit.

On another Node.js host, preserve the repository content, Cloud project ID and
automatic rebuilds from `main`, and update the authorized site domain in Cloud.
The public website reads its deployed checkout, not the Cloud API. Job files are
included in server traces, and local saves invalidate the job cache. Restore
deleted content from Git history and deploy it again; rolling back only the live
deployment does not restore the source content.

The short [editor guide](docs/editing-jobs.md) covers the day-to-day workflow.

## UI components

Use [shadcn/ui](https://ui.shadcn.com/docs) for most of the project's graphical
interface wherever suitable components are available. Prefer adapting and
composing its components before building custom UI from scratch.

Use Tailwind utilities for styling, layout, breakpoints, interactions, and
decoration. Define reusable variants with CVA in the shadcn components. Extend
Tailwind v4 through `@theme` and `@custom-variant`; keep `globals.css` limited to
shared tokens, states, and base styles. Keep component-specific styling and
motion in Tailwind class strings or CVA definitions beside the component. Use
standard utilities and arbitrary values for one-off settings; avoid component-only
theme aliases and stylesheets. Add colocated custom CSS only when utilities
cannot express the required behavior. Prefer suitable shadcn components.

shadcn/ui is initialized with the `base-nova` style, Base UI primitives, Lucide
icons, and Tailwind CSS v4. Configuration is in `components.json`, UI components
are in `src/components/ui/`, and the shared `cn` utility is in `src/lib/utils.ts`.
The initial `Button` component is available at `@/components/ui/button`.

### Component organization

Extract a shared component when the same UI pattern or typography is used in
two places. Reuse the existing components when adding sections:

- `components/typography/`: `Heading` for section, item, and page titles; `Text`
  for body, lead, and small text; `MonoText` for eyebrows, labels, and metadata.
  Choose the HTML element with `as` independently of its visual variant.
- `components/layout/`: `Section` composes the shared eyebrow, H2, introduction,
  container, and responsive section spacing. `Container` and `PageMain` provide
  shared page layout. `SectionHeader` and `sectionVariants` share heading groups
  and outer spacing with grouped content. Header and footer components live in
  their own subfolders. Parent navigation sections remain active on nested routes
  without marking the parent URL as the current page.
- `components/sections/home/`: homepage sections grouped by feature. Each folder
  keeps its cards, accordion, images, and related types together.
- `components/sections/feature-cards/`: shared icon, title and description cards
  and their responsive grid for Capabilities, Sustainability and SMT. Cards use the
  existing shadcn `feature` variant; one, two and three columns follow the shared
  mobile, tablet and desktop breakpoints. Heights grow with translated content.
- `components/sections/contact-cta/`: shared closing contact section for About,
  Sustainability, Jobs and service details. Page wrappers supply translated copy,
  the action URL and optional contacts; the default is the company phone and email.
- `components/sections/jobs/`: careers page at `/[locale]/jobs` in all five locales.
  `JobsHero` uses the standard hero and animated background; `JobsPositions`
  composes `JobCard` links from the Keystatic collection in `src/content/jobs/`.
  `detail/` renders individual jobs; `application/` owns the application form.
  The detail reader caches serializable content and restores Markdoc ASTs only
  during server rendering. `sharp` supplies intrinsic CMS image dimensions.
  `JobsContact` passes only the recruitment email to the shared contact CTA.
  Navigation and `sitePages.careers` use `/jobs`; old `/career` and `/careers`
  paths redirect permanently, preserving locale and query parameters.
- `components/sections/sustainability/`: sustainability page at
  `/[locale]/sustainability` in all five locales. The content-driven hero uses the
  shared animated background and the explicitly different `layout="section"`.
  Energy and responsible production reuse `Section` with equal columns. Energy
  supplies the original local forest photo, a responsive 3:2 crop and static
  `PhotoTrace` decoration. Responsibility reuses `FeatureCardGrid` with three
  original Figma icons. The closing CTA links to localized `/contact`.
  Translated copy lives in the five `Sustainability*` namespaces and
  `Metadata.sustainability`. Metadata and sitemap use the shared site registry.
- `components/sections/image-accordion/`: shared single-open accordion and photo
  gallery for Industries and Services. Each entry supplies its translated name,
  description, image and optional metadata or native action link. The desktop
  gallery and compact inline photos share one selection. Optional Figma crop
  coordinates scale uniformly with the image frame using CSS container units.
  The list's minimum desktop height is configurable without fixing text height.
  `home/industries/` adapts the existing certification data to this shared view.
- `components/sections/services/`: overview at `/[locale]/services` in all five
  locales. `hero/` uses the shared animated background and links to the
  localized `/contact` page. `overview/` supplies eight services, original local
  Figma photographs, crop coordinates and stable service slugs. Translated text
  lives in `ServicesHero`, `Services` and `Metadata.services` in each locale's
  messages. Service links target `/[locale]/services/{slug}`. The SMT detail at
  `/[locale]/services/smt` is available in all five locales; other service details
  remain separate work. `detail/` provides `ServiceHero`, a content-driven
  `ServiceEquipmentSection` and `EquipmentList` for future services. `smt/` supplies
  SMT content, equipment models and wrappers for the shared statistics, cards and
  contact CTA. Its hero action uses `#equipment`; the closing CTA uses localized
  `/contact#contact-form`. Translations live in `ServiceDetail`, `Smt` and
  `Metadata.smt`. Both routes use the existing metadata and sitemap helpers.
- `components/sections/media-text/`: reusable `MediaTextBlock` combines
  `SectionHeader`, an adaptive 3:2 photo and `PhotoTrace`. Desktop photos can sit
  on either side; compact layouts always show text before the photo. The parent
  group owns outer section spacing. SMT uses it for production and reflow.
- `components/sections/contact/`: contact page at `/[locale]/contact` in all five
  locales, with the shared hero, directions, contact form, regional map and billing
  details. The Google Maps iframe loads immediately from the verified HOKAMI place;
  it needs no API key or map SDK. `content/company.ts` holds shared company details.
  The contact form validates locally and shows the unavailable state without sending
  or storing messages. Delivery is a separate integration. The shared header CTA
  targets `/[locale]/contact#contact-form`, using a native fragment on Contact.
- `components/forms/`: `TextFormField` and its `FormField` wrapper share labels,
  inputs, textareas, traces and errors between the homepage enquiry and Contact.
  `FormError` provides their common error feedback. The enquiry's Select keeps its
  existing adapter. `sections/contact-links/` shares phone and email links with About.
- `components/sections/hero/`: shared `HeroSection` and independent
  `HeroBackground`. The section accepts translated content, actions, a heading
  element, an optional `backLink` before the eyebrow, and an optional background.
  The optional `media` slot follows the content and actions, spans the hero width,
  and stays in normal flow so expanding media increases the hero's height.
  Actions can pass a local icon and responsive width. `home/hero/` supplies homepage content.
  All hero headings use the shared `Heading` hero variant: Saira SemiBold with
  size/tracking of 40/−0.44 px on mobile, 56/−0.84 px on tablet,
  and 104/−1.32 px on desktop, matching Figma's `type/hero/*` modes.
  A shared unitless line-height of 1.15 keeps diacritics and punctuation clear
  of adjacent lines when headings wrap at any breakpoint. Service details use
  `headingClassName` for Figma's 42/58/100 px mobile/tablet/desktop line heights.
  The homepage title uses `t.rich` and a translated `<accent>` range in the
  existing `brand-identity` color so each locale controls its emphasis.
  Hero descriptions default to the shared `Text` lead variant (IBM Plex Sans,
  18 px with 1.6 line-height); the homepage description is also visible on mobile.
  Desktop font families are shared across breakpoints, including Services.
  Descriptions retain their translated content and width constraints.
  The default `size="default"` uses the original responsive minimum heights
  (489 px on mobile and 740 px from `tablet` at 760 px), independent of viewport
  height. The section grows with content when needed.
  Contact uses `size="compact"` to keep its content-driven height.
  Sustainability also uses compact sizing with `layout="section"`: shared
  section spacing (128 px above the content on desktop) and a 32 px desktop
  content gap, following its approved design. Standard heroes keep their
  existing alignment.
  Standard page heroes inherit the homepage's responsive top padding and
  eyebrow-to-heading spacing so their content starts at the same vertical position.
  Customize layout with `className`, `contentClassName`, and `actionsClassName`,
  description typography with `descriptionProps`, and button size/icon per action.
  `HeroBackground` accepts desktop artwork and positioning through props.
  `about/hero/` shares the homepage background, minimum heights, and section padding,
  owns the About content layout, typography, and actions,
  supplies content in each locale, links contact to the homepage enquiry form and
  links `#history` to the history section.
  From the `tablet` breakpoint (760 px), the background follows Figma `751:11080`:
  six traces and seventeen contacts in a centered 1440 × 2320 px artwork stage,
  shifted 30 px above the hero's vertical center, with the original horizon SVG.
  Heroes with media use `sizing="artwork"`: a top-anchored 2220 px desktop canvas
  keeps traces and glow stationary relative to the hero while video expansion
  grows its outer clipping area. On mobile, `useVideoReveal` publishes the fully
  expanded hero height as `--hero-expanded-height`, measured from the stable
  final video stage and section padding. The mobile lines extend beyond the
  hero boundaries without following scroll progress; text and width changes
  refresh the measurement. Before hydration, mobile artwork fills the section.
  Heroes without media retain
  section-based sizing.
  Local assets live in `public/images/hero/wide/`. Smaller screens retain the
  existing three traces, contacts and CSS horizon glow. The desktop path geometry
  and exact keyframes come from the Figma SVGs and motion context; both variants
  use a 30-second CSS timeline. Its small
  client wrapper pauses motion outside the viewport, in hidden tabs, and under
  reduced motion; without browser support it keeps a static background.
- `components/sections/about/awards/`: static, server-rendered awards between
  history and press in all five locales. Two original diplomas sit above
  two logo groups in a two-column desktop grid; below `desktop` they stack in
  reading order. Local JPEG and SVG sources preserve their proportions and
  have translated alternative text. Intrinsic dimensions reserve image space;
  diplomas use responsive Next.js optimization and all images load lazily.
- `components/sections/about/campus/`: server-rendered campus introduction in all
  five locales, placed between the About hero and history. A centered CSS grid
  stacks company logos below `desktop` and arranges them in one row above it.
  Local Figma PNGs retain their proportions at a shared spacing-based height;
  intrinsic image dimensions reserve their space while loading. Native company
  links open in new tabs and include a translated screen-reader announcement.
- `components/sections/about/contact/`: server-rendered closing contact section in
  all five locales, placed after documents and before the footer. Its wrapper
  supplies content to `ContactCta`. Text and actions stack below `desktop`; the
  desktop action column is 384 px wide. Native phone and email links use local
  Figma icons. The contact CTA and About hero CTA link
  to the homepage enquiry form in the current locale.
- `components/sections/about/documents/`: server-rendered certificates and grants
  between press and contact in all five locales. The two lists stack below
  `desktop`; above it, both groups stretch to the taller list and distribute their
  rows evenly without a fixed height. Document names wrap without truncation. Each native link downloads
  one of nine unchanged source PDFs from `public/documents/about/`, with translated
  labels and an accessible download announcement. Local Figma SVGs provide the
  default and hover states; downloads and keyboard navigation work without JavaScript.
- `components/sections/about/press/`: server-rendered media articles between
  awards and documents in all five locales. The grid shows every article in one,
  two or three columns at the existing mobile, tablet and desktop breakpoints.
  From tablet upward, article links align along the bottom of each row; mobile
  cards keep their natural content height.
  Each whole card is one native external link, with a visible keyboard focus and
  a translated new-tab announcement. Headlines and link labels are translated;
  publisher names and original local Figma logos stay unchanged. Logo slots
  reserve their height and load lazily, without recompressing the small PNGs.
  Add entries to `pressArticles` in `data.ts` and add the same article ID under
  `AboutPress.articles` in each locale's messages. Array order is display order;
  new publishers also need an entry in `pressPublishers`, a local logo and a
  translated link label under `AboutPress.publishers`. Articles from the same
  publisher reuse its logo. An empty article list hides the section.
- `components/sections/about/history/`: localized company history with 16
  server-rendered milestones. Cards alternate at the `desktop` breakpoint and
  form one column below it. CSS contacts and leaders follow each card; one
  inline SVG adapts to their measured positions on resize and font loading.
  Its ambient pulse shares the hero's 30-second CSS timeline in
  `components/ui/trace-pulse.css` and uses `useMotionVisibility` for visibility
  and reduced-motion handling. Text remains available without JavaScript.
- `components/sections/trust-strip/`: shared statistics strip. Pass an `items`
  array and the current `locale`; `home/trust-strip/` supplies homepage content.
  Values stay numeric, with `Intl.NumberFormatOptions` controlling precision,
  compact notation, currencies, and percentages (`0.85` means 85%). Translated
  `prefix`/`suffix` strings support surrounding words and qualifiers; resolve
  plural forms against the final value before passing them. `accessibleValue`
  optionally provides a more descriptive spoken value.
  `additionalValues: [{id, value, prefix}]` appends numeric parts, using the same
  locale and format. One visibility trigger starts all parts together, and
  `NumberFlowGroup` synchronizes their animations. Separators and the final
  suffix remain text. SMT board dimensions use this for both 810 and 480.
  Optional `compact: {label, suffix}` moves units into the label below 672 px of
  container width. Its visible number alone participates in width measurement;
  both representations retain the complete accessible value.
  Values and labels stay centered within their cells at every column count.
  Rows balance for any item count, adapt to container width, and reduce their column count for
  long numbers. Empty arrays render nothing. NumberFlow runs once per visible
  number, with final server-rendered text for reduced motion and without JS.
  Formats unsupported by NumberFlow (scientific/engineering notation, non-Latin
  digits, and RTL locales) retain their localized static value.
- `components/sections/video/`: reusable `VideoSection`. Pass `src`, optional
  `mobileSrc` and silent `previewSrc`, `poster`, translated `labels`, and optional
  caption `tracks`. `motion="scroll"` reveals the video from an inline 16:9
  preview, then lets it scroll away normally; `motion="none"` renders a static
  section. The layout slot starts at the preview's height and grows with the
  video, pushing following content down without reserving the full frame in
  advance. The preview stays below the preceding content throughout the reveal.
  Scroll uses paused Web
  Animations driven by one scheduled frame per scroll event, with measurements
  on resize rather than each frame. Its stable artwork stage is separate from
  the growing layout slot, so resizing the slot cannot reset the timeline.
  Scroll anchoring is suspended only during height changes, and native fragment
  navigation accounts for the expanded slot. Artwork scales uniformly; controls and trace
  thickness stay unchanged. Reduced motion and short viewports use a static
  frame. Mobile, reduced motion, and data-saving connections keep a poster until
  the user plays the video. Desktop preview playback pauses outside the viewport,
  in hidden tabs, and while the full player is active. The full source is assigned
  only on click and uses native controls inline. Without JS a direct video link
  remains available. `CompanyVideo` supplies the shared company media and translations
  for Home and Jobs. Both heroes render `<CompanyVideo />` in the shared `media`
  slot, with identical media, geometry and motion. The preview aligns with the
  hero actions, separated by 40 px on mobile and 48 px from tablet. The media
  wrapper uses the same spacing below the video, replacing the hero's bottom
  padding when media is present. The expanded
  frame has 20 px mobile and 40 px tablet/desktop gutters, with a maximum media
  width of 1440 px centered on wider screens. The expanded frame stays 16:9 at
  every breakpoint, including during playback; its height follows its width. Expanding the video grows the hero itself; neither
  hero needs an empty spacer for an overlapping preview.
  Optimized media in `public/video/` is derived from `homepage.mp4`: H.264/yuv420p,
  `faststart`, no metadata/data streams; 1080p CRF 25 with 128 kbps AAC, 720p CRF 26
  with 96 kbps AAC, and a silent 12-second 1920×1080 / 25 fps CRF 28 preview starting
  at 4 seconds, encoded from the 4K original with `preset slow` and Lanczos scaling
  (2.96 MB). The preview retains the source frame rate and enough detail for the
  expanded frame. The WebP poster is a 1280×720 frame from 22 seconds. The original
  4K source is preserved and is not referenced by the page.
- `components/sections/locations/`: reusable locations section. Use `Locations`
  on any localized page for the same branch and regional contact data; `home/locations/`
  connects it to the homepage. `LocationsSection` accepts translated content when
  composing it separately. The map and legend share hover, keyboard-focus, and
  touch selection with the regional cards, using each region's `locationId`.
  The Czech/Western Europe and global cards map to Liberec, Eastern Europe to
  Zawidów, and Scandinavia/the Baltics to Helsinki. Contact links remain native
  links in server-rendered HTML. The pixel map is the only external SVG; exact
  Figma path geometry shares one inline SVG, with CSS dots, halo, vias and label
  leaders. The original 30-second CSS timeline is preserved. `hooks/use-motion-visibility.ts`
  pauses ambient motion in both the map and hero outside the viewport, in hidden
  tabs, and under reduced motion. The map keeps a static fallback without JavaScript
  and for reduced motion. Country labels use ISO 3166-1 alpha-2 codes.
- `components/sections/process/`: reusable `ProcessSection` with a translated
  `steps` array (`id`, `label`, `title`, `description`).
  Nodes are distributed around the ring for any small step count, with four
  seconds per step. Motion plays once when visible and pauses offscreen or in
  hidden tabs, independently of reduced-motion preferences. The completed ring
  and last step remain visible; scrolling back does not replay the animation.
  Without JavaScript all steps remain a readable list. Empty sections are omitted
  and a single step stays static. The diagram uses CSS circles, shadows and an
  animated conic mask; background glows use radial gradients. No process image assets or
  SVG filters are loaded. A registered angle property keeps the progress mask
  synchronized with the orbit; browsers without this API retain the readable
  list. `home/process/` supplies the homepage's four steps.
  `motion="scroll"` selects the homepage's scroll version, with a sticky ring
  below the header and reversible progress over 150svh of native page scrolling.
  `process-scroll.css` uses a local view timeline, a registered angle and shared
  per-step ranges. `use-process-scroll.ts` only drives scroll frames when native
  timelines are unavailable or reduced motion calls for discrete steps. All step
  text stays inside the ring, including compact landscape layouts. Without JS,
  supported browsers keep the CSS timeline; other browsers retain a native radio
  choice of steps in the ring. The time version remains available through the
  default `ProcessSection` variant, while the homepage renders only the scroll
  version at `#process`.
- `components/navigation/`: the shared language switch. Locale options are in
  `i18n/languages.ts`; `hooks/use-site-location.ts` preserves pathname, query,
  and hash for both header and footer.
- `components/ui/icons/`: decorative CSS icons. `ChevronIcon` is shared by the
  industry accordion and both select controls; `CloseIcon` marks file removal.
  Button arrows and trace dots stay in `components/ui/button/`, inherit the
  existing colors, and share the same CSS rendering across buttons and links.
- `components/pages/`: shared layouts for information and legal pages.
  `pages/legal/` also contains `LegalHeading` and `LegalParagraph`, which apply
  shared typography and document spacing to the legal content.
- `components/integrations/`: analytics and cookie-consent components.
- `components/ui/`: shadcn primitives, with the button, link, variants, and
  decoration grouped in `ui/button/`.

Import feature components from their own files. Keep typography styles and
reusable visual variants in their components, and pass page-specific layout
adjustments through `className` rather than duplicating whole style strings.

Import `cn` from `@/lib/utils`; its conflict groups include the shared
`leading-body`, `leading-small`, and semantic tracking utilities. This preserves
local typography overrides. Prettier sorts Tailwind classes in JSX and `cn`/`cva`
calls using `src/app/globals.css` as the theme entry point.

Shared layout measurements live in `globals.css`: `--site-header-height` scales
with the spacing unit, while `--site-sticky-offset` preserves the original pixel
offsets for video and process scenes. `--site-anchor-offset` keeps the separate
88 px anchor offset. Process text
motion parameters live in `process-scroll-layout.ts` and feed both the CSS
timeline and JavaScript fallback. Keep artwork coordinates, gradient masks,
CSS icon geometry, and animation keyframes unchanged during style cleanup.

Add components as needed with the installed CLI:

```bash
npx shadcn add <component>
```

Keep the project's existing fonts and design tokens in `src/app/globals.css`
when updating the theme. The project has one light HOKAMI theme; it does not
switch with system appearance. shadcn variables in `:root` reference HOKAMI tokens
rather than a separate palette:

- Primary actions: `action-primary` (`#CC3700`), with the existing hover and pressed
  tokens. `brand-identity` (`#FE4704`) is reserved for brand graphics.
- Surfaces and text: warm neutral HOKAMI tokens; errors use `feedback-error-text`
  (`#B42318`), inputs use `border-strong`, and focus uses `focus-ring`.
- Heading font: Saira. The base corner radius is zero, as defined in the design.

The dark palette is removed, and the `dark:` variant is disabled for components
added by the CLI. Local inverse sections such as the footer use the existing
`surface-inverse` and `text-on-inverse` tokens within the same theme.
See the [shadcn theming documentation](https://ui.shadcn.com/docs/theming).

## Code quality

Run `npm install` (or `npm ci` after cloning) to install dependencies and activate
the Husky Git hooks automatically.

Before each commit, lint-staged runs ESLint with automatic fixes and then Prettier
on staged JavaScript and TypeScript files. Prettier also formats other supported
staged files. Fixes are automatically added to the commit, and lint-staged
preserves unstaged changes in partially staged files. ESLint warnings and errors
block the commit.

The hook then generates Next.js route types and checks TypeScript across the
whole project. Type errors also block the commit.

```bash
npm run lint          # Check ESLint, including warnings
npm run lint:fix      # Apply ESLint fixes
npm run format       # Format the project
npm run format:check # Check formatting without changing files
npm run typecheck    # Generate route types and check TypeScript
npm run check        # Run all checks without changing source files
npm run build        # Check the production build separately
```

The production build is kept outside the commit hook. When tests are added,
include them in CI alongside `npm run check` and `npm run build`.

## Continuous integration

The GitHub Actions workflow in `.github/workflows/ci.yml` runs on every push and
on pull requests when opened, reopened, or updated, across all branches.
It uses Node.js from `.nvmrc` and the npm version from `packageManager` in
`package.json`, caches npm downloads, and runs these steps in order:

```bash
npm ci
npm run check
npm test
npm run build
```

A failed step fails the job and stops subsequent steps. Husky Git hooks are
disabled in CI because the checks run explicitly. The workflow starts running
after its configuration is pushed to GitHub.

## Analytics and performance

The root layout includes Vercel Web Analytics and Speed Insights on all pages
using their Next.js integrations.

Enable Web Analytics for the project in the Vercel dashboard, then deploy the
updated application. Speed Insights collection routes are included automatically
in Vercel deployments. Visit the deployed site to generate data and view it in
the corresponding dashboard sections. Local checks and builds do not verify
data collection on Vercel.

Setup documentation:

- [Vercel Web Analytics](https://vercel.com/docs/analytics/quickstart)
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights/quickstart)

## Dependency updates

`.github/dependabot.yml` configures weekly npm dependency checks on Mondays at
09:00 in the `Europe/Prague` timezone. Minor and patch version updates are grouped
into one pull request; major version updates are proposed separately. Up to five
npm version-update pull requests can be open at once.

GitHub Actions are checked on the same weekly schedule. All action version
updates are grouped into a single pull request, with at most one open
GitHub Actions version-update pull request at a time.

Dependabot starts using this configuration once it is pushed to the GitHub
repository's default branch. Review updates and run `npm run check` and
`npm run build` before merging them.
