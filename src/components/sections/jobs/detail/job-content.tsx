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
import { isJobImagePath } from "@/lib/jobs/content-layout";
import {
  FactListGrid,
  type FactListGridGroup,
} from "@/components/sections/fact-list/fact-list-grid";
import { JobColumn, jobColumnsVariants } from "./content-layout";
import { JobPhoto } from "./job-photo";
import { ContentEmbed } from "./content-embed";
import { readIframeEmbed } from "@/lib/jobs/embed";
import { site } from "@/lib/site";

export function safeContentHref(href: string) {
  try {
    return ["https:", "http:", "mailto:", "tel:"].includes(
      new URL(href, site.url).protocol,
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
      variant={level === 2 ? "section" : level === 3 ? "subsection" : "item"}
      className={
        level === 2
          ? "mt-12 mb-6 first:mt-0 desktop:mb-8"
          : "mt-8 mb-3 first:mt-0"
      }
    >
      {children}
    </Heading>
  );
}

function ContentParagraph(props: ComponentProps<"p">) {
  return <Text {...props} className="my-5 first:mt-0 last:mb-0" />;
}

function paragraphText(node: Node): string | null {
  if (node.type === "text") return String(node.attributes.content ?? "");
  if (node.type === "softbreak") return "\n";
  if (!["paragraph", "inline"].includes(node.type)) return null;
  const parts = node.children.map(paragraphText);
  return parts.some((part) => part === null) ? null : parts.join("");
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
  if (!isJobImagePath(src)) return null;
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

function ContentSection({
  tone = "default",
  children,
}: {
  tone?: "default" | "subtle";
  children: ReactNode;
}) {
  const columns = React.Children.count(children) === 2 ? 2 : 1;
  return (
    <section className={sectionVariants({ tone })}>
      <Container className={jobColumnsVariants({ columns })}>
        {children}
      </Container>
    </section>
  );
}

function ContentPhoto({ src, alt }: { src: string; alt: string }) {
  if (!isJobImagePath(src)) return null;
  return <JobPhoto src={src} alt={alt} />;
}

function ContentFactSection({
  id,
  tone = "default",
  groups,
}: {
  id?: string;
  tone?: "default" | "subtle";
  groups: readonly FactListGridGroup[];
}) {
  return (
    <section id={id} className={sectionVariants({ tone })}>
      <Container>
        <RichText className="leading-body">
          <FactListGrid groups={groups} columns={2} />
        </RichText>
      </Container>
    </section>
  );
}

function checklistItems(checklist: Node, config: Config) {
  return checklist.children.flatMap((list, listIndex) =>
    list.children.map((item, index) => ({
      id: `${listIndex}-${index}`,
      content: new Markdoc.Tag(
        "ContentFragment",
        {},
        item.transformChildren(config),
      ),
    })),
  );
}

function checklistColumn(column: Node, index: number, config: Config) {
  const position = column.children.findIndex(
    (node) => node.tag === "JobChecklist",
  );
  if (
    position < 0 ||
    column.children.some(
      (node, childIndex) =>
        childIndex !== position &&
        !["heading", "paragraph"].includes(node.type),
    )
  )
    return null;

  const after = column.children.slice(position + 1);
  return {
    id: `column-${index + 1}`,
    header: column.children
      .slice(0, position)
      .map((node) => node.transform(config)),
    items: checklistItems(column.children[position], config),
    after: after.length
      ? new Markdoc.Tag(
          "ContentFragment",
          {},
          new Markdoc.Ast.Node("document", {}, after).transformChildren(config),
        )
      : undefined,
  };
}

const config: Config = {
  tags: {
    JobEmbed: {
      render: "ContentEmbed",
      selfClosing: true,
      attributes: {
        src: { type: String, required: true },
        title: { type: String, required: true },
      },
    },
    JobSection: {
      render: "ContentSection",
      attributes: {
        id: { type: String },
        tone: {
          type: String,
          default: "default",
          matches: ["default", "subtle"],
        },
      },
      transform(node: Node, config: Config) {
        const groups = node.children.map((column, index) =>
          checklistColumn(column, index, config),
        );
        const attributes = node.transformAttributes(config);
        return groups.length && groups.every((group) => group !== null)
          ? new Markdoc.Tag("ContentFactSection", { ...attributes, groups })
          : new Markdoc.Tag(
              "ContentSection",
              attributes,
              node.transformChildren(config),
            );
      },
    },
    JobColumn: { render: "JobColumn" },
    JobChecklist: {
      transform(node: Node, config: Config) {
        return new Markdoc.Tag("FactListGrid", {
          items: checklistItems(node, config),
        });
      },
    },
    JobPhoto: {
      render: "ContentPhoto",
      selfClosing: true,
      attributes: {
        src: { type: String, required: true },
        alt: { type: String, required: true },
      },
    },
  },
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
    paragraph: {
      ...Markdoc.nodes.paragraph,
      transform(node: Node, config: Config) {
        const embed = readIframeEmbed(paragraphText(node) ?? "");
        return embed
          ? new Markdoc.Tag("ContentEmbed", embed)
          : new Markdoc.Tag(
              "ContentParagraph",
              {},
              node.transformChildren(config),
            );
      },
    },
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

function renderDocument(document: Node) {
  return Markdoc.renderers.react(Markdoc.transform(document, config), React, {
    components: {
      ContentFragment: React.Fragment,
      ContentHeading,
      ContentParagraph,
      ContentTable,
      ContentImage,
      ContentSection,
      ContentFactSection,
      JobColumn,
      FactListGrid,
      ContentPhoto,
      ContentEmbed,
    },
  });
}

export function renderJobContent(body: string) {
  return renderDocument(deserializeJobContent(body));
}

export function JobContent({ body, locale }: { body: string; locale: string }) {
  const root = deserializeJobContent(body);
  const groups: Node[][] = [];
  for (const node of root.children) {
    if (
      node.tag === "JobSection" ||
      groups.at(-1)?.[0]?.tag === "JobSection" ||
      !groups.length
    )
      groups.push([node]);
    else groups.at(-1)!.push(node);
  }
  return (
    <div lang={locale}>
      {groups.map((nodes, index) => {
        const document = new Markdoc.Ast.Node("document", {}, nodes);
        const rendered = renderDocument(document);
        return nodes[0].tag === "JobSection" ? (
          <React.Fragment key={index}>{rendered}</React.Fragment>
        ) : (
          <section key={index} className={sectionVariants()}>
            <Container>
              <RichText className="leading-body">{rendered}</RichText>
            </Container>
          </section>
        );
      })}
    </div>
  );
}
