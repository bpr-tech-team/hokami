"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Heading } from "@/components/typography/heading";
import { MonoText } from "@/components/typography/mono-text";
import { Button } from "@/components/ui/button";
import { TraceDot } from "@/components/ui/button/trace-dot";
import { CloseIcon } from "@/components/ui/icons/close-icon";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { watchAnnouncement } from "./announcement";
import "./announcement-motion.css";

function AnnouncementPhoto() {
  const t = useTranslations("Announcement");

  return (
    <div className="relative aspect-[4/3] max-h-full min-h-0 min-w-0 overflow-clip desktop:aspect-[9/10]">
      <Image
        src="/images/announcements/electronica-2026/stand.png"
        alt={t("photoAlt")}
        fill
        sizes="(min-width: 1080px) 28rem, (min-width: 640px) 36rem, calc(100vw - 2rem)"
        className="object-cover desktop:object-[56%_center]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-6 desktop:inset-x-auto desktop:inset-y-0 desktop:right-0 desktop:h-auto desktop:w-6"
      >
        <span className="absolute inset-0 bg-[url('/images/announcements/electronica-2026/mobile-edge.svg')] bg-[length:100%_100%] bg-no-repeat desktop:bg-[url('/images/announcements/electronica-2026/desktop-edge.svg')]" />
        <span className="absolute inset-x-0 -inset-y-[0.75px] animate-[announcement-trace-x_1.2s_0.6s_both] bg-brand-identity mask-[url('/images/announcements/electronica-2026/mobile-trace.svg')] [mask-size:100%_100%] motion-reduce:animate-none desktop:-inset-x-[0.75px] desktop:inset-y-0 desktop:animate-[announcement-trace-y_1.2s_0.6s_both] desktop:mask-[url('/images/announcements/electronica-2026/desktop-trace.svg')]" />
        <span className="absolute -inset-x-1.5 -inset-y-[7px] animate-[announcement-pulse-x_6s_linear_infinite] bg-brand-identity mask-[url('/images/announcements/electronica-2026/mobile-pulse.svg')] [mask-size:100%_100%] motion-reduce:hidden desktop:-inset-x-[7px] desktop:-inset-y-1.5 desktop:animate-[announcement-pulse-y_6s_linear_infinite] desktop:mask-[url('/images/announcements/electronica-2026/desktop-pulse.svg')]" />
      </span>
    </div>
  );
}

export function SiteAnnouncement() {
  const t = useTranslations("Announcement");
  const [open, setOpen] = useState(false);
  const continueButton = useRef<HTMLButtonElement>(null);

  useEffect(() => watchAnnouncement(() => setOpen(true)), []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        data-slot="site-announcement"
        showCloseButton={false}
        initialFocus={continueButton}
        aria-describedby={undefined}
        className="flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl flex-col gap-0 border border-brand-identity bg-surface-default p-0 text-text-primary shadow-[0_4px_12px_rgb(17_16_14/0.06),0_24px_48px_-12px_rgb(17_16_14/0.2)] sm:max-w-xl desktop:max-w-5xl"
      >
        <div className="grid max-h-[calc(100dvh-2rem-2px)] min-h-0 grid-rows-[minmax(0,1fr)_auto] desktop:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] desktop:grid-rows-[minmax(0,1fr)]">
          <AnnouncementPhoto />
          <div className="relative -mt-px flex min-w-0 flex-col items-start justify-center gap-5 bg-surface-default px-5 py-5 desktop:mt-0 desktop:gap-6 desktop:px-12 desktop:py-16">
            <div className="flex min-w-0 flex-col gap-3 desktop:gap-4">
              <MonoText variant="eyebrow">{t("eyebrow")}</MonoText>
              <DialogTitle
                render={<Heading as="h2" variant="subsection" />}
                className="text-[clamp(1rem,4.5dvh,1.375rem)] leading-[1.3] font-semibold wrap-anywhere tablet:text-[clamp(1rem,4.5dvh,1.5rem)] tablet:leading-[1.3] desktop:text-[28px] desktop:leading-[1.22]"
              >
                {t("title")}
              </DialogTitle>
            </div>
            <DialogClose
              render={
                <Button
                  ref={continueButton}
                  className="h-auto min-h-12 w-full py-3 whitespace-normal desktop:w-auto"
                />
              }
            >
              {t("continue")}
            </DialogClose>
          </div>
        </div>
        <DialogClose
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-3 right-3 z-10 bg-surface-default desktop:top-4 desktop:right-4 ui-enabled:hover:bg-surface-subtle"
            />
          }
          aria-label={t("close")}
        >
          <CloseIcon className="size-6" />
        </DialogClose>
        <TraceDot className="-top-[5px] -left-[5px]" />
        <TraceDot className="-right-[5px] -bottom-[5px]" />
      </DialogContent>
    </Dialog>
  );
}
