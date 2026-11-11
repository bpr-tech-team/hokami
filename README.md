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

Keystatic's shared-image save fix is maintained as a versioned dependency patch.
See [dependency patches](docs/dependency-patches.md) before upgrading Keystatic.

## Forms

Enquiries, contact messages and job applications use server-side validation,
reCAPTCHA v3 and the Mailtrap Transactional API. They send to `info@hokami.cz`
by default, with the visitor's email in Reply-To. Job applications also check
the vacancy's current publication status and visible languages.

Configure the variables in [.env.example](.env.example), following the
[Mailtrap setup guide](docs/mailtrap-setup.md). Unconfigured services return an
unavailable message; errors preserve input and files. Success is shown only
after Mailtrap accepts the message.

All form attachments have a total limit of 4,000,000 bytes (4 MB). Enquiries
accept up to 10 nonempty files; job applications accept optional PDF/DOCX files.
The attachment hints show the total limits in all five languages and stay visible
alongside file errors.
