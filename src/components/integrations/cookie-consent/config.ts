import type { Locale } from "next-intl";
import type { CookieConsentConfig, Translation } from "vanilla-cookieconsent";
import { getPathname } from "@/i18n/navigation";

type CookieMessages =
  (typeof import("../../../../messages/cs.json"))["Cookies"];

const catalogs = {
  cs: () => import("../../../../messages/cs.json"),
  en: () => import("../../../../messages/en.json"),
  de: () => import("../../../../messages/de.json"),
  fi: () => import("../../../../messages/fi.json"),
  pl: () => import("../../../../messages/pl.json"),
};

function createTranslation(
  messages: CookieMessages,
  locale: Locale,
): Translation {
  const privacyLink = `<a href="${getPathname({ locale, href: "/gdpr" })}">${messages.privacy}</a>`;

  return {
    consentModal: {
      title: messages.bannerTitle,
      description: messages.bannerDescription,
      acceptAllBtn: messages.acceptAll,
      acceptNecessaryBtn: messages.necessaryOnly,
      showPreferencesBtn: messages.customize,
      footer: privacyLink,
    },
    preferencesModal: {
      title: messages.title,
      acceptAllBtn: messages.acceptAll,
      acceptNecessaryBtn: messages.necessaryOnly,
      savePreferencesBtn: messages.save,
      closeIconLabel: messages.close,
      sections: [
        { description: messages.preferencesDescription },
        {
          title: messages.necessaryTitle,
          description: messages.necessaryDescription,
          linkedCategory: "necessary",
          cookieTable: {
            caption: messages.cookieTableCaption,
            headers: {
              name: messages.cookieName,
              duration: messages.cookieDuration,
              purpose: messages.cookiePurpose,
            },
            body: [
              {
                name: "hokami_consent",
                duration: messages.consentDuration,
                purpose: messages.consentPurpose,
              },
            ],
          },
        },
        {
          title: messages.analyticsTitle,
          description: messages.analyticsDescription,
          linkedCategory: "analytics",
        },
        {
          title: messages.moreTitle,
          description: `${messages.moreDescription} ${privacyLink}.`,
        },
      ],
    },
  };
}

export function createConsentConfig(locale: Locale): CookieConsentConfig {
  return {
    mode: "opt-in",
    disablePageInteraction: true,
    // Increase when changes to purposes/services require renewed consent.
    revision: 1,
    cookie: {
      name: "hokami_consent",
      path: "/",
      sameSite: "Lax",
      expiresAfterDays: 180,
    },
    guiOptions: {
      consentModal: {
        layout: "box wide",
        position: "middle center",
        equalWeightButtons: true,
      },
      preferencesModal: { layout: "box", equalWeightButtons: true },
    },
    categories: {
      necessary: { enabled: true, readOnly: true },
      analytics: {
        enabled: false,
        // Register future services and their cookie cleanup here. React
        // integrations use the same service IDs through useServiceConsent.
        services: {
          vercelAnalytics: { label: "Vercel Web Analytics" },
          speedInsights: { label: "Vercel Speed Insights" },
        },
      },
    },
    language: {
      default: locale,
      translations: Object.fromEntries(
        Object.entries(catalogs).map(([language, load]) => [
          language,
          async () =>
            createTranslation((await load()).Cookies, language as Locale),
        ]),
      ),
    },
  };
}
