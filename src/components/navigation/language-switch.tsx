import type { Locale } from "next-intl";
import { cva, type VariantProps } from "class-variance-authority";
import { languages } from "@/i18n/languages";
import { Link } from "@/i18n/navigation";

const switchVariants = cva("flex", {
  variants: {
    variant: {
      header: "shrink-0 items-center",
      footer: "-my-2.5 flex-wrap justify-center",
    },
  },
  defaultVariants: { variant: "header" },
});

const linkVariants = cva("inline-flex min-h-11 items-center justify-center", {
  variants: {
    variant: {
      header:
        "relative px-2 font-mono text-xs leading-[1.6] tracking-[0.16em] text-text-secondary hover:text-text-primary aria-current:text-text-primary after:absolute after:right-2 after:bottom-2 after:left-2 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand-identity after:transition-transform after:duration-250 after:content-[''] hover:after:scale-x-100 aria-current:after:right-0 aria-current:after:scale-x-100 aria-current:after:bg-text-accent",
      footer:
        "min-w-11 underline-offset-2 hover:underline aria-current:underline",
    },
  },
  defaultVariants: { variant: "header" },
});

type LanguageSwitchProps = VariantProps<typeof switchVariants> & {
  locale: Locale;
  label: string;
  href: string;
  onNavigate?: () => void;
};

export function LanguageSwitch({
  locale,
  label,
  href,
  variant,
  onNavigate,
}: LanguageSwitchProps) {
  return (
    <nav
      data-slot="language-switch"
      className={switchVariants({ variant })}
      aria-label={label}
    >
      {languages.map((language) => (
        <Link
          key={language.locale}
          href={href}
          locale={language.locale}
          lang={language.locale}
          hrefLang={language.locale}
          aria-label={language.name}
          aria-current={language.locale === locale ? "true" : undefined}
          className={linkVariants({ variant })}
          onClick={onNavigate}
        >
          {language.code}
        </Link>
      ))}
    </nav>
  );
}
