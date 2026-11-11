# Legacy WordPress URL migration

Audited on 2026-11-11. The former WordPress site was read over HTTPS by resolving
`hokami.cz` to its previous server, `185.8.237.11`, without changing public DNS.
The new public site already runs on Vercel.

## Sources

- Old sitemap index: `https://hokami.cz/wp-sitemap.xml` on the previous server.
- Four child sitemaps: posts, pages, categories, and authors.
- Sitemap copies and the complete list of 23 URLs: [legacy-sitemaps](legacy-sitemaps/urls.json).
- Czech homepage and English, German, Finnish, and Polish homepages: their menus
  confirm that translated versions used the same Czech slugs after locale prefixes.
- Public WordPress pages/posts API confirms the three vacancy identities and
  page ID `176` as GDPR. The old footer links to `/?page_id=176`.

These sources establish known legacy URLs; they do not establish the complete
set of URLs indexed by Google. Search Console page/link exports and access logs
can reveal additional historic addresses, attachments, or query-based URLs.

## Redirect map

The following paths work under `/cs`, `/en`, `/de`, `/fi`, and `/pl`, retaining
the locale. Unprefixed versions go directly to Czech replacements. The campus
destination is an existing section on the new company page.

| Old path (after locale)                              | New path (after locale)         |
| ---------------------------------------------------- | ------------------------------- |
| `/o-hokami`                                          | `/about`                        |
| `/kontakt`                                           | `/contact`                      |
| `/udrzitelnost`                                      | `/sustainability`               |
| `/kariera`                                           | `/jobs`                         |
| `/kampus`                                            | `/about#campus`                 |
| `/sluzby`                                            | `/services`                     |
| `/osazovani`                                         | `/services/smt`                 |
| `/pajeni`                                            | `/services/tht`                 |
| `/cisteni`                                           | `/services/cleaning`            |
| `/testovani`                                         | `/services/testing`             |
| `/lakovani`                                          | `/services/coating`             |
| `/kompletace`                                        | `/services/mechanical-assembly` |
| `/desky-plosnych-spoju`                              | `/services/pcb`                 |
| `/sablony`                                           | `/services/smt-stencils`        |
| `/delnik-delnice-v-elektronice`                      | `/jobs/production`              |
| `/konstrukter-testeru-elektroniky-vyvoj-sw-aplikaci` | `/jobs/test-engineer`           |
| `/nakupci`                                           | `/jobs/buyer`                   |
| `/category/kariera`                                  | `/jobs`                         |
| `/author/111`                                        | `/jobs`                         |
| `/author/josef-suska`                                | `/jobs`                         |

Both author archives contain recruitment posts, so they lead to the vacancy list.
The homepage, `/cs/gdpr`, and `/cs/whistleblowing` retain their existing paths.
Unprefixed `/gdpr` and `/whistleblowing`, and the observed root query link
`?page_id=176` (with or without a locale), lead to Czech legal content.

All migration redirects use HTTP 308 and retain query parameters. Next.js first
normalizes a trailing slash, so old URLs ending in `/` may take two redirects.
Unknown paths remain eligible for genuine 404 responses.

## Verification and rollout

- Configuration tests exercise 240 legacy path variants, six GDPR query links,
  and ten current/unknown paths, using Next.js's routing test utility.
- Real local HTTP responses confirm the campus fragment and campaign query are
  retained together: `/cs/kampus?utm_source=google` redirects to
  `/cs/about?utm_source=google#campus`.
- All 82 unique destination pages return HTTP 200 on the public Vercel site.
- Type checking, scoped lint, and formatting checks pass.

The changes are prepared locally. They take effect after deployment. After
deployment, check representative old URLs on the public domain and submit the
current `https://hokami.cz/sitemap.xml` in Search Console. Keep redirects for at
least one year, preferably as long as old links still receive traffic.

Official guidance:
[Next.js redirects](https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects),
[Google site migrations](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).
