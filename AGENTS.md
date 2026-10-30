<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## UI implementation

Use shadcn/ui for most of the graphical interface wherever possible. Prefer
adapting and composing suitable shadcn/ui components before creating custom UI.
Check the official documentation at https://ui.shadcn.com/docs before adding or
configuring components. Initialize shadcn before adding the first component;
installing the CLI alone does not configure the UI.
