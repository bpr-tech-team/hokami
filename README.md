# HOKAMI

Company website built with Next.js App Router, TypeScript, Tailwind CSS and
shadcn/ui. Vacancies are managed through Keystatic.

The site supports Czech (default), English, German, Finnish and Polish.

## Development

Requires Node.js `26.10.0` and npm `11.19.1`. With nvm installed:

```bash
nvm install
nvm use
npm install --global npm@11.19.1
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). Use npm for dependency changes and
commit `package-lock.json` with them. Environment variables are listed in
[.env.example](.env.example).

## Checks

| Command                 | Purpose                                        |
| ----------------------- | ---------------------------------------------- |
| `npm run check`         | ESLint, formatting and TypeScript              |
| `npm test`              | Tests                                          |
| `npm run content:check` | Validate vacancy records and images            |
| `npm run build`         | Validate content and create a production build |
| `npm start`             | Serve the production build                     |

CI runs checks, tests and the production build. The pre-commit hook formats and
lints staged files, then checks TypeScript.

## Project structure

- `src/app/` — routes, layouts and shared styles.
- `src/components/sections/` — page sections, grouped by feature.
- `src/components/layout/` and `typography/` — shared layout and text components.
- `src/components/ui/` — shadcn/ui components.
- `src/i18n/` — locale routing and helpers; `messages/` — translation catalogs.
- `src/content/jobs/` — vacancy records; `src/lib/jobs/` — schema and content logic.
- `public/` — static assets.

## Vacancy administration

The admin is at `/keystatic`. See the [editor guide](docs/editing-jobs.md) for
creating and publishing vacancies.

For local editing, add this to `.env.local`:

```dotenv
NEXT_PUBLIC_KEYSTATIC_LOCAL_MODE=true
```

Start or restart `npm run dev`, then open
[127.0.0.1:3000/keystatic](http://127.0.0.1:3000/keystatic). Local writes are only
enabled in development.

Production uses Keystatic Cloud. Set the project ID in the hosting environment:

```dotenv
NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT=hokami/hokami
```

Use `main` for editing: Cloud saves create Git commits, and Vercel deploys that
branch. Changes go live after a successful deployment. Without a Cloud project
ID, production admin is disabled.

English content is required. Missing translations fall back to English;
publication status and visible languages are set per vacancy.

## Forms

Contact, enquiry and job application forms validate input, but delivery is not
connected yet.
