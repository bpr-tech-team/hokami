import React, { type ComponentProps, type ReactNode } from "react";
import Markdoc, { type Config, type Node } from "@markdoc/markdoc";
import Image from "next/image";
import sharp from "sharp";
import { join } from "node:path";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { RichText } from "@/components/typography/rich-text";
import { Container } from "@/components/layout/container";
import { sectionVariants } from "@/components/layout/section-variants";
import { deserializeJobContent } from "@/lib/jobs/content";

export function safeContentHref(href: string) {
  try {
    return ["https:", "http:", "mailto:", "tel:"].includes(
      new URL(href, "https://hokami.cz").protocol,
    )
      ? href
      : undefined;
  } catch {
    return undefined;
  }
}

function ContentHeading({
  level,
  children,
}: {
  level: number;
  children: ReactNode;
}) {
  const as = level === 2 ? "h2" : level === 3 ? "h3" : "h4";
  return (
    <Heading
      as={as}
      variant={level === 2 ? "article" : "article-subheading"}
      className={level === 2 ? "mt-12 mb-5 first:mt-0" : "mt-8 mb-3"}
    >
      {children}
    </Heading>
  );
}

function ContentParagraph(props: ComponentProps<"p">) {
  return (
    <Text {...props} variant="article" className="my-5 first:mt-0 last:mb-0" />
  );
}

function ContentTable(props: ComponentProps<"table">) {
  return (
    <div className="my-8 overflow-x-auto" tabIndex={0}>
      <table {...props} />
    </div>
  );
}

async function ContentImage({
  src,
  alt,
  title,
}: {
  src: string;
  alt: string;
  title?: string;
}) {
  if (!/^\/images\/jobs\/[a-z0-9/_-]+\.(png|jpe?g|webp)$/i.test(src))
    return null;
  const metadata = await sharp(join(process.cwd(), "public", src)).metadata();
  const { width, height } = metadata.autoOrient ?? metadata;
  if (!width || !height) return null;
  return (
    <Image
      src={src}
      alt={alt}
      title={title}
      width={width}
      height={height}
      unoptimized
      className="block h-auto w-auto max-w-full"
    />
  );
}

const config: Config = {
  nodes: {
    document: { ...Markdoc.nodes.document, render: "ContentFragment" },
    heading: {
      ...Markdoc.nodes.heading,
      transform(node: Node, config: Config) {
        return new Markdoc.Tag(
          "ContentHeading",
          { level: Math.min(4, Math.max(2, Number(node.attributes.level))) },
          node.transformChildren(config),
        );
      },
    },
    paragraph: { ...Markdoc.nodes.paragraph, render: "ContentParagraph" },
    table: { ...Markdoc.nodes.table, render: "ContentTable" },
    image: { ...Markdoc.nodes.image, render: "ContentImage" },
    fence: {
      ...Markdoc.nodes.fence,
      transform(node: Node) {
        return new Markdoc.Tag(
          "pre",
          { "data-language": node.attributes.language },
          [
            new Markdoc.Tag("code", {}, [
              String(node.attributes.content ?? ""),
            ]),
          ],
        );
      },
    },
    link: {
      ...Markdoc.nodes.link,
      transform(node: Node, config: Config) {
        const attrs = node.transformAttributes(config);
        const href =
          typeof attrs.href === "string"
            ? safeContentHref(attrs.href)
            : undefined;
        const children = node.transformChildren(config);
        return href
          ? new Markdoc.Tag("a", { href, title: attrs.title }, children)
          : children;
      },
    },
  },
};

export function renderJobContent(body: string) {
  return Markdoc.renderers.react(
    Markdoc.transform(deserializeJobContent(body), config),
    React,
    {
      components: {
        ContentFragment: React.Fragment,
        ContentHeading,
        ContentParagraph,
        ContentTable,
        ContentImage,
      },
    },
  );
}

export function JobContent({ body, locale }: { body: string; locale: string }) {
  return (
    <section className={sectionVariants()}>
      <Container>
        <RichText lang={locale}>{renderJobContent(body)}</RichText>
      </Container>
    </section>
  );
}
