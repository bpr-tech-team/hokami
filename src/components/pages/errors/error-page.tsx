import type { Locale } from "next-intl";
import { Container } from "@/components/layout/container";
import { PageMain } from "@/components/layout/page-main";
import { Heading } from "@/components/typography/heading";
import { MonoText } from "@/components/typography/mono-text";
import { Text } from "@/components/typography/text";
import { ButtonLink } from "@/components/ui/button/button-link";
import { errorMessages } from "@/i18n/error-messages";

export type ErrorStatus = 404 | 500;

export function ErrorPage({
  locale,
  status,
}: {
  locale: Locale;
  status: ErrorStatus;
}) {
  const messages = errorMessages[locale];
  const content = status === 404 ? messages.notFound : messages.serverError;

  return (
    <PageMain>
      <title>{`${status} — ${content.title} | HOKAMI`}</title>
      <meta name="robots" content="noindex, nofollow" />
      <section
        aria-labelledby="error-heading"
        className="relative isolate overflow-hidden bg-surface-accent-subtle px-5 py-18 tablet:px-10 tablet:py-24 desktop:px-20 desktop:py-32"
      >
        <Container className="grid items-center gap-12 desktop:min-h-[420px] desktop:grid-cols-[1.2fr_1fr] desktop:gap-16">
          <div className="flex min-w-0 flex-col items-start gap-6">
            <MonoText variant="eyebrow">
              {messages.eyebrow} / {status}
            </MonoText>
            <Heading
              as="h1"
              id="error-heading"
              variant="section"
              className="w-full wrap-anywhere"
            >
              {content.title}
            </Heading>
            <Text
              variant="lead"
              tone="secondary"
              className="max-w-copy wrap-anywhere"
            >
              {content.description}
            </Text>
            <ButtonLink
              href={`/${locale}`}
              size="lg"
              className="mt-2 h-auto min-h-14 w-full py-4 whitespace-normal tablet:w-auto"
            >
              {messages.home}
            </ButtonLink>
          </div>
          <div
            aria-hidden="true"
            className="relative flex min-w-0 flex-col items-center justify-center border-y border-border-brand-subtle py-10 select-none tablet:py-12 desktop:min-h-[360px]"
          >
            <svg
              viewBox="0 0 480 280"
              fill="none"
              focusable="false"
              className="absolute inset-0 size-full text-brand-identity"
            >
              <g stroke="currentColor" strokeWidth="1" opacity="0.35">
                <path d="M0 36h76l28 28h42M480 244h-76l-28-28h-42M0 226h44l26-26h32M480 54h-44l-26 26h-32" />
                <path d="M164 0v32l24 24M316 280v-32l-24-24M0 140h60m360 0h60" />
              </g>
              <g stroke="currentColor" strokeWidth="1.5">
                <path d="M0 260h114l26-26h36M480 20H366l-26 26h-36" />
                <circle cx="180" cy="234" r="4" />
                <circle cx="300" cy="46" r="4" />
                <circle cx="64" cy="140" r="4" />
                <circle cx="416" cy="140" r="4" />
              </g>
            </svg>
            <Heading
              as="span"
              variant="hero"
              className="relative text-[clamp(7rem,32vw,12rem)] leading-none tracking-[-0.06em] text-brand-identity tablet:text-[14rem] desktop:text-[clamp(10rem,17vw,15rem)]"
            >
              {status}
            </Heading>
            <MonoText
              as="span"
              tone="secondary"
              variant="meta"
              className="absolute right-0 bottom-3"
            >
              HOKAMI / HTTP {status}
            </MonoText>
          </div>
        </Container>
      </section>
    </PageMain>
  );
}
