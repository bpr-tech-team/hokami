import type { Messages } from "next-intl";

export type PressPublisher = {
  name: string;
  logo: string;
  width: number;
  height: number;
};

export const pressPublishers = {
  denik: {
    name: "Liberecký deník",
    logo: "/images/about/press/liberecky-denik.png",
    width: 370,
    height: 124,
  },
  hn: {
    name: "Hospodářské noviny",
    logo: "/images/about/press/hospodarske-noviny.png",
    width: 740,
    height: 138,
  },
  echo24: {
    name: "Echo24",
    logo: "/images/about/press/echo24.png",
    width: 300,
    height: 91,
  },
} as const satisfies Record<string, PressPublisher>;

export type PressArticle = {
  id: keyof Messages["AboutPress"]["articles"];
  publisherId: keyof typeof pressPublishers;
  href: string;
};

// Display order is editorial: insert new articles where they should appear.
export const pressArticles: readonly PressArticle[] = [
  {
    id: "denikBestCompany",
    publisherId: "denik",
    href: "https://liberecky.denik.cz/zpravy/nestaci-jen-chtit-pracovat-v-nejlepsi-firme-si-musite-zaslouzit/",
  },
  {
    id: "hnSpace",
    publisherId: "hn",
    href: "https://archiv.hn.cz/c1-65547800-plosne-spoje-z-liberce-miri-i-do-vesmiru-jsou-i-v-satelitech-a-vozitku-na-marsu",
  },
  {
    id: "echoCompany2016",
    publisherId: "echo24",
    href: "https://www.echo24.cz/a/wUdEj/firmou-roku-2016-je-liberecky-vyrobce-elektroniky-hokami-cz",
  },
];
