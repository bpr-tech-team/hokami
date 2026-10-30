"use client";

import { Suspense, useRef, useSyncExternalStore } from "react";
import { usePathname } from "@/i18n/navigation";
import { HeaderBar } from "./header-bar";
import { HeaderDesktopNav } from "./header-desktop-nav";
import { HeaderLogo } from "./header-logo";
import { HeaderMobileMenu } from "./header-mobile-menu";
import type { HeaderNavProps, HeaderProps } from "./navigation";
import { useHeaderLocation } from "./use-header-location";

function subscribeScroll(notify: () => void) {
  window.addEventListener("scroll", notify, { passive: true });
  return () => window.removeEventListener("scroll", notify);
}

function readScrolled() {
  return window.scrollY > 0;
}

function serverScrolled() {
  return false;
}

function HeaderView({ locale, labels, items, location }: HeaderNavProps) {
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    readScrolled,
    serverScrolled,
  );
  const desktopLogoRef = useRef<HTMLAnchorElement>(null);
  const navigationProps = { locale, labels, items, location };

  return (
    <>
      <a
        href="#main-content"
        className="fixed top-2 left-2 z-100 -translate-y-[200%] bg-surface-default px-4 py-2 text-text-accent focus:translate-y-0"
      >
        {labels.skip}
      </a>
      <header
        className="sticky top-0 z-40 bg-surface-default transition-[background-color,box-shadow] duration-150 data-scrolled:bg-surface-default/50 data-scrolled:shadow-[0_1px_3px_rgb(17_16_14/4%),0_1px_2px_rgb(17_16_14/6%)] data-scrolled:backdrop-blur-[15px]"
        data-scrolled={scrolled || undefined}
      >
        <HeaderBar className="h-16 xl:h-18 xl:gap-6 xl:px-20 min-[90rem]:gap-8">
          <HeaderLogo ref={desktopLogoRef} label={labels.home} />
          <HeaderDesktopNav {...navigationProps} />
          <HeaderMobileMenu
            {...navigationProps}
            desktopLogoRef={desktopLogoRef}
          />
        </HeaderBar>
      </header>
    </>
  );
}

function HeaderWithLocation(props: HeaderProps) {
  const location = useHeaderLocation();
  return <HeaderView {...props} location={location} />;
}

function HeaderFallback(props: HeaderProps) {
  const pathname = usePathname();
  return (
    <HeaderView {...props} location={{ pathname, search: "", hash: "" }} />
  );
}

export function SiteHeaderClient(props: HeaderProps) {
  return (
    <Suspense fallback={<HeaderFallback {...props} />}>
      <HeaderWithLocation {...props} />
    </Suspense>
  );
}
