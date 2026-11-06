import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { hasLocale } from "next-intl";
import { NextResponse, type NextRequest } from "next/server";
import { readJobAvailability } from "./lib/jobs/availability";
import { isJobAvailable } from "./lib/jobs/resolve-job";

const localize = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const match = /^\/([^/]+)\/jobs\/([^/]+)\/?$/.exec(request.nextUrl.pathname);
  if (match && hasLocale(routing.locales, match[1])) {
    const entry = await readJobAvailability(match[2]);
    if (!entry || !isJobAvailable(entry, match[1])) {
      // Resolve not-found before a job page can start streaming a 200 response.
      return NextResponse.rewrite(new URL(`/${match[1]}/404`, request.url));
    }
  }
  return localize(request);
}

export const config = {
  matcher: [
    "/((?!api|trpc|_next|_vercel|keystatic(?:/|$)|.*\\..*).*)",
    "/:locale(cs|en|de|fi|pl)/jobs/:job",
    "/jobs/:job",
  ],
};
