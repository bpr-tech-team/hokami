import { keystaticUiText } from "@/i18n/keystatic-ui";
import { parseDocument } from "htmlparser2";

const invalidSource = keystaticUiText(
  "Enter an HTTPS address or a single iframe with an HTTPS source.",
);

function httpsSource(value: string) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password)
    throw new Error(invalidSource);
  return url.href;
}

export function readIframeEmbed(
  value: string,
): { src: string; title: string } | null {
  if (!/^\s*<iframe\b/i.test(value) || !/<\/iframe\s*>\s*$/i.test(value))
    return null;
  try {
    const nodes = parseDocument(value).children.filter(
      (node) => node.type !== "text" || node.data.trim(),
    );
    const frame = nodes[0];
    if (
      nodes.length !== 1 ||
      frame.type !== "tag" ||
      frame.name !== "iframe" ||
      "srcdoc" in frame.attribs ||
      frame.children.some((child) => child.type !== "text" || child.data.trim())
    )
      return null;
    return {
      src: httpsSource(frame.attribs.src ?? ""),
      title: frame.attribs.title?.trim() || "Vložený obsah",
    };
  } catch {
    return null;
  }
}

export function jobEmbedSource(value: string) {
  const source = value.trim();
  try {
    if (source.startsWith("<")) {
      const frame = readIframeEmbed(source);
      if (!frame) throw new Error(invalidSource);
      return frame.src;
    }
    return httpsSource(source);
  } catch {
    throw new Error(invalidSource);
  }
}

export function jobEmbedSandbox(src: string) {
  const host = new URL(src).hostname;
  const mediaProviders = [
    "youtube.com",
    "youtube-nocookie.com",
    "vimeo.com",
    "google.com",
    "google.cz",
  ];
  const media = mediaProviders.some(
    (domain) => host === domain || host.endsWith(`.${domain}`),
  );
  return media
    ? "allow-scripts allow-same-origin allow-presentation"
    : "allow-scripts allow-presentation";
}
