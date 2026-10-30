"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HeaderBar } from "./header-bar";
import {
  getHeaderAnchorHref,
  HeaderLanguageSwitch,
  HeaderNavLink,
} from "./header-links";
import { HeaderLogo } from "./header-logo";
import { HEADER_DESKTOP_QUERY, type HeaderNavProps } from "./navigation";

const compactControls = "flex items-center gap-4 max-[23rem]:gap-2 xl:hidden";
const compactCta = "px-6 max-[23rem]:px-3";
const menuButton =
  "bg-transparent text-text-primary ui-enabled:hover:bg-transparent ui-enabled:hover:text-text-primary";

function MenuFrame() {
  const dot =
    "absolute size-[9px] bg-[url('/images/ui/button/dot-secondary.svg')] bg-contain bg-center bg-no-repeat";
  return (
    <div
      data-slot="header-menu-frame"
      className="pointer-events-none absolute inset-2 z-1 border-2 border-brand-identity [clip-path:inset(-6px)] transition-[clip-path] delay-350 duration-350 ease-[ease] group-data-starting-style/sheet:[clip-path:inset(0_75%_50%_0)] group-data-ending-style/sheet:opacity-0 group-data-ending-style/sheet:transition-none"
      aria-hidden="true"
    >
      <span className={cn(dot, "-top-[5.5px] -left-[5.5px]")} />
      <span className={cn(dot, "-right-[5.5px] -bottom-[5.5px]")} />
    </div>
  );
}

export function HeaderMobileMenu({
  locale,
  labels,
  items,
  location,
  desktopLogoRef,
}: HeaderNavProps & {
  desktopLogoRef: RefObject<HTMLAnchorElement | null>;
}) {
  const [open, setOpen] = useState(false);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const ctaHref = getHeaderAnchorHref("/#rfq", locale, location.pathname);

  useEffect(() => {
    const media = window.matchMedia(HEADER_DESKTOP_QUERY);
    const closeOnDesktop = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, []);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className={compactControls}>
      <ButtonLink href={ctaHref} showIcon={false} className={compactCta}>
        {labels.requestShort}
      </ButtonLink>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon-sm" className={menuButton} />
          }
          aria-label={labels.openMenu}
        >
          <span
            className="block h-6 w-[26px] flex-none bg-[url('/images/header/menu.svg')] bg-contain bg-center bg-no-repeat"
            aria-hidden="true"
          />
        </SheetTrigger>
        <SheetContent
          side="top"
          showCloseButton={false}
          overlayClassName="hidden"
          className="group/sheet z-60 gap-0 overflow-hidden bg-surface-default text-base leading-[1.6] text-text-primary shadow-none outline-none transition-opacity duration-350 ease-[ease] data-ending-style:duration-300 data-[side=top]:h-dvh data-[side=top]:border-0 data-[side=top]:data-ending-style:translate-y-0 data-[side=top]:data-starting-style:translate-y-0"
          initialFocus={firstLink}
          finalFocus={() =>
            window.matchMedia(HEADER_DESKTOP_QUERY).matches
              ? (desktopLogoRef.current ?? true)
              : true
          }
          aria-describedby={undefined}
        >
          <SheetTitle className="sr-only">{labels.navigation}</SheetTitle>
          <HeaderBar className="h-16 shrink-0">
            <HeaderLogo label={labels.home} onNavigate={closeMenu} />
            <div className={compactControls}>
              <ButtonLink
                href={ctaHref}
                showIcon={false}
                className={compactCta}
                onClick={closeMenu}
              >
                {labels.requestShort}
              </ButtonLink>
              <SheetClose
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className={menuButton}
                  />
                }
                aria-label={labels.closeMenu}
              >
                <span
                  className="block size-6 flex-none bg-[url('/images/header/close.svg')] bg-contain bg-center bg-no-repeat"
                  aria-hidden="true"
                />
              </SheetClose>
            </div>
          </HeaderBar>
          <div className="relative min-h-0 flex-1">
            <MenuFrame />
            <div
              data-slot="header-menu-scroll"
              className="flex h-full translate-y-0 flex-col overflow-y-auto overscroll-contain px-5 pt-6 pb-[calc(32px+env(safe-area-inset-bottom))] transition-[opacity,translate] duration-350 ease-[ease] group-data-starting-style/sheet:-translate-y-6 group-data-starting-style/sheet:opacity-0 group-data-ending-style/sheet:-translate-y-6 group-data-ending-style/sheet:opacity-0 group-data-ending-style/sheet:duration-300"
            >
              <NavigationMenu
                orientation="vertical"
                className="block max-w-none flex-[1_0_auto]"
                aria-label={labels.navigation}
              >
                <NavigationMenuList className="block w-full">
                  {items.map((item, index) => (
                    <NavigationMenuItem key={item.key}>
                      <HeaderNavLink
                        ref={index === 0 ? firstLink : undefined}
                        item={item}
                        locale={locale}
                        location={location}
                        variant="mobile"
                        onClick={closeMenu}
                      >
                        <span
                          className="w-6 shrink-0 font-mono text-xs leading-[1.6] font-normal tracking-[0.16em] text-text-tertiary group-data-active/navigation-link:text-text-accent"
                          aria-hidden="true"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{item.label}</span>
                      </HeaderNavLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
              <div className="flex flex-wrap items-center gap-4 pt-6 pb-4">
                <span
                  className="font-mono text-xs leading-[1.6] tracking-[0.16em] text-text-tertiary uppercase"
                  aria-hidden="true"
                >
                  {labels.language}
                </span>
                <HeaderLanguageSwitch
                  locale={locale}
                  label={labels.language}
                  location={location}
                  onNavigate={closeMenu}
                />
              </div>
              <ButtonLink
                href={ctaHref}
                size="lg"
                className="w-full shrink-0"
                onClick={closeMenu}
              >
                {labels.request}
              </ButtonLink>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
