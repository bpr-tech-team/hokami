# Dependency patches

## Keystatic shared images

`@keystatic/core` is pinned to `0.6.9`. Its entry serializer emits an image once
for each content field that references it. Copying an unsaved image between job
languages therefore produces duplicate `fileChanges.additions` paths, which
[GitHub rejects](https://docs.github.com/en/graphql/reference/git#filechanges).

The patch in `patches/@keystatic+core+0.6.9.patch` fixes the entry serializer,
before it computes additions, deletions, hashes or local writes:

- Emit each repository path once when all copies contain identical bytes.
- Reject conflicting bytes at the same path instead of silently choosing a file.
- Preserve serialization order and the existing JSON, image paths and editor data.

Images remain shared across languages. Removing one reference keeps an image
that is still used by another language; removing every reference allows the
existing save flow to delete it.

`npm ci` and `npm install` apply the patch through `postinstall` using
[`patch-package`](https://github.com/ds300/patch-package). Patch failures stop
installation, including outside CI. Keep `patches/` in the build context and
include it in the cache key if caching `node_modules` directly. The current CI
uses `npm ci` and caches npm's download cache only.

Run `node --import tsx --test tests/keystatic-saving.test.ts` to exercise the
installed entry serializer after copying native images and `JobPhoto` blocks
through the real clipboard into all five job languages. The test also checks
reopening, remaining references and conflicting image contents.

When upgrading Keystatic, first check the
[upstream changelog](https://github.com/Thinkmill/keystatic/blob/main/packages/keystatic/CHANGELOG.md)
and serializer implementation. Remove this patch once the upstream serializer
enforces the same invariant, then run the regression test, project checks, tests
and production build. If the defect remains, review and regenerate the patch for
the new pinned version. Do not bypass a failed patch application.
