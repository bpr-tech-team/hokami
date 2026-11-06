import { makeRouteHandler } from "@keystatic/next/route-handler";
import { revalidateTag } from "next/cache";
import config, { isLocalKeystatic } from "../../../../../keystatic.config";
import { JOBS_CACHE_TAG } from "@/lib/jobs/cache";

const handlers = config ? makeRouteHandler({ config }) : null;

async function handle(request: Request, method: "GET" | "POST") {
  const response = handlers
    ? await handlers[method](request)
    : new Response("Keystatic Cloud is not configured.", { status: 503 });

  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");

  if (isLocalKeystatic && method === "POST" && response.ok) {
    revalidateTag(JOBS_CACHE_TAG, { expire: 0 });
  }

  return response;
}

export async function GET(request: Request) {
  return handle(request, "GET");
}

export async function POST(request: Request) {
  return handle(request, "POST");
}
