<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## UI implementation

Use shadcn/ui for most of the graphical interface wherever possible. Prefer
adapting and composing suitable shadcn/ui components before creating custom UI.
Check the official documentation at https://ui.shadcn.com/docs before adding or
configuring components. shadcn is initialized with the base-nova style and Base UI
primitives; use `npx shadcn add <component>` to add components under
`src/components/ui`. Preserve the existing project fonts and design tokens in
`src/app/globals.css` when adjusting the theme.

Use Tailwind utility classes for layout, typography, responsive behavior, states,
and decoration. Keep reusable visual variants in CVA definitions on the shadcn
components. Prefer the standard shadcn compositions (NavigationMenu,
SheetContent, Separator, Button) over custom replacements or unstyled bypasses.
Do not add component selectors when Tailwind utilities can express the styles.
Keep `globals.css` limited to shared theme tokens, variants, and base styles.
Keep component-specific styling and motion in Tailwind class strings or CVA
definitions next to that component. Use standard utilities and arbitrary values
for one-off settings; avoid component-only theme aliases and stylesheets. Prefer
Tailwind transitions driven by Base UI `data-starting-style` and
`data-ending-style` attributes for entry/exit motion. Add custom CSS only when
utilities cannot express the required behavior, and keep it with the component.

HOKAMI has one light theme, independent of system appearance. Keep shadcn CSS
variables mapped to HOKAMI semantic tokens; do not add a dark palette or a theme
switcher. The `dark:` variant is intentionally disabled for generated components.
Use action-primary for primary actions and its hover/pressed tokens for their
states; reserve brand-identity for graphics. Use existing inverse tokens for local
dark surfaces. Keep the default corner radius at zero, following the design.

## Navigation

Header navigation uses homepage anchors `industries`, `capabilities`, `process`,
and the enquiry target `rfq`. Add these IDs when implementing those sections.
Quality, about, and careers have separate localized routes `/quality`, `/about`,
and `/careers`. Use `ButtonLink` for navigation CTAs; it shares the existing
Button styling and decoration while preserving native link semantics.
The header has no bottom border or divider; keep the bar 72 px high on desktop
and 64 px high in the compact layout.
Use Tailwind's default `xl:` breakpoint (80rem / 1280 px) for full navigation.
Keep the menu's entry/exit transitions at 350/300 ms with `ease`; reveal its
frame over 350 ms after a 350 ms delay. Respect reduced-motion preferences.

Keep the header shell, `HeaderDesktopNav`, and `HeaderMobileMenu` separate; the
mobile component owns modal state and focus behavior. Use `useHeaderLocation` for
pathname, query, and hash. Language switching must preserve all three, including
duplicate query keys and encoded values. Use native fragment links for anchors
on the current page so query params survive hash navigation. Keep URL-dependent
active states independent of query params. `useSearchParams` requires the header's
local `Suspense` boundary with the existing header shell as its prerender fallback.
