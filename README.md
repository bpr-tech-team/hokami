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

### Header and navigation

The shared locale layout includes the Figma header on every page. It uses the
original SVG wordmark and menu icons from `public/images/header/`. The bar is
sticky, 72 px high on desktop and 64 px in the compact layout. After scrolling it
uses the Figma translucent white background, 15 px blur, and subtle shadow.
The header and its mobile-menu bar have no bottom border.
Full navigation is shown from 1280 px; narrower screens use the compact header to
leave room for all five locales' labels. At 1440 px, content aligns to the
1200 px page container and the gaps match the desktop Figma layout.

Navigation uses shadcn NavigationMenu, NavigationMenuList, NavigationMenuItem,
and NavigationMenuLink, with `header` and `mobile` CVA variants. The desktop
divider uses shadcn Separator. Responsive layout and appearance use Tailwind
utilities, including the standard `xl:` breakpoint (80rem / 1280 px). Background,
blur, shadow, and motion are expressed in the header components with Tailwind
utilities and arbitrary values. The header needs no separate stylesheet or global
theme aliases.

`SiteHeaderClient` composes the shared bar, logo, `HeaderDesktopNav`, and
`HeaderMobileMenu`. The mobile component owns its Sheet state, focus restoration,
and desktop-resize dismissal. Shared links and the language switch are in
`header-links.tsx`; URL state is isolated in `useHeaderLocation`.

Menu entry/exit use 350/300 ms transitions with `ease`, driven by the Sheet's
Base UI `data-starting-style` and `data-ending-style` attributes. Its frame
reveals via a `clip-path` transition over 350 ms after a 350 ms delay; it hides
immediately on closing. The shared reduced-motion rules remove transition delays
and shorten durations. Follow the same approach for component-only styling and
simple entry/exit motion; see the [Base UI animation guide](https://base-ui.com/react/handbook/animation).

The mobile menu uses the standard shadcn SheetContent / Base UI Dialog for scroll locking, focus
containment, Escape dismissal, and focus restoration. It closes after choosing
a link or expanding the viewport to desktop. Its content scrolls independently
on short screens. The labels and accessibility text are in `messages/` for all
five locales. Language links retain the pathname, complete query string
(including repeated keys and encoded values), and hash. For example,
`/cs/quality?tag=a&tag=b#details` switches to `/de/quality?tag=a&tag=b#details`.
Homepage anchors and enquiry CTAs use native fragment links on the homepage,
preserving its query string; links from other pages target the localized homepage.
Active navigation compares the pathname and hash independently of query params.

`useHeaderLocation` combines the localized `usePathname` with Next.js
`useSearchParams` and a `useSyncExternalStore` subscription to `hashchange` and
`popstate`. Its snapshot reader also checks the hash after App Router commits a
new URL, since client navigation can change it without firing `hashchange`.
Keep query updates reactive through the router APIs, and preserve
search-param multiplicity with `toString()`. A local `Suspense` boundary renders
the same header shell while query params are unavailable during prerendering.
See the [Next.js search params documentation](https://nextjs.org/docs/app/api-reference/functions/use-search-params)
and [next-intl navigation APIs](https://next-intl.dev/docs/routing/navigation).

Navigation destinations are defined in `src/components/site-header/navigation.ts`:

- Industries, capabilities, and process link to `/#industries`, `/#capabilities`,
  and `/#process` on the localized homepage.
- Quality, about, and careers use `/quality`, `/about`, and `/careers`. These
  routes currently contain only localized page headings, ready for their content.
- The enquiry CTA links to `/#rfq`. Homepage sections and the enquiry form have
  not been implemented yet; add those IDs when building the corresponding content.

Header CTAs use `ButtonLink`, which shares `ButtonContent`, the original Figma
decoration, and `buttonVariants` with Button. Navigation remains a native link
rather than a Base UI button with an anchor tag. The bar CTAs hide the arrow as
in Figma; the large CTA in the mobile menu keeps it.

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
