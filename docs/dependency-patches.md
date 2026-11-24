# Dependency patches

## Keystatic entry saving

`@keystatic/core` is pinned to `0.6.9`. Its entry serializer emits an image once
for each content field that references it. Copying an unsaved image between job
languages therefore produces duplicate `fileChanges.additions` paths, which
[GitHub rejects](https://docs.github.com/en/graphql/reference/git#filechanges).

The patch in `patches/@keystatic+core+0.6.9.patch` changes how Keystatic
serializes, opens and validates entries.

- The serializer emits each path once when the copies contain identical bytes
  and rejects conflicting bytes at the same path.
- The entry parser tracks existing files for deletion. A missing asset lookup
  used to add the requested path to the deletion list, which GitHub rejects.
- Form validation displays a localized error summary with field labels and
  messages. This includes fields in hidden translations.

Images remain shared across languages. Removing one reference keeps an image
that is still used by another language; removing every reference allows the
existing save flow to delete it.

Photos referenced by a job belong in `public/images/jobs/<slug>/`. Keystatic
loads photos from that directory when it opens the job.

`npm ci` and `npm install` apply the patch through `postinstall` using
[`patch-package`](https://github.com/ds300/patch-package). Patch failures stop
installation, including outside CI. Keep `patches/` in the build context and
include it in the cache key if caching `node_modules` directly. The current CI
uses `npm ci` and caches npm's download cache only.

Run `node --import tsx --test tests/keystatic-saving.test.ts` to exercise the
installed entry serializer after copying native images and `JobPhoto` blocks
through the real clipboard into all five job languages. The test also checks
reopening, remaining references, conflicting image contents, and how a missing
photo is handled when parsing and validating an entry.

When upgrading Keystatic, first check the
[upstream changelog](https://github.com/Thinkmill/keystatic/blob/main/packages/keystatic/CHANGELOG.md)
and check the affected code. Remove changes covered upstream, regenerate any
remaining patch for the new pinned version, and run the regression test, project
checks, tests and production build.
