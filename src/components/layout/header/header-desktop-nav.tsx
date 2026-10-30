import { HeaderRequestLink } from "./header-request-link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { HeaderLanguageSwitch, HeaderNavLink } from "./header-links";
import type { HeaderNavProps } from "./navigation";

export function HeaderDesktopNav({
  locale,
  labels,
  items,
  location,
}: HeaderNavProps) {
  return (
    <div
      data-slot="header-desktop"
      className="hidden min-w-0 flex-1 items-center gap-6 xl:flex min-[90rem]:gap-8"
    >
      <NavigationMenu
        className="max-w-none justify-end"
        aria-label={labels.navigation}
      >
        <NavigationMenuList className="justify-end gap-5 min-[90rem]:gap-8">
          {items.map((item) => (
            <NavigationMenuItem key={item.key}>
              <HeaderNavLink
                item={item}
                locale={locale}
                location={location}
                variant="header"
              >
                {item.label}
              </HeaderNavLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <Separator
        orientation="vertical"
        aria-hidden="true"
        className="h-5 data-vertical:self-center"
      />
      <HeaderLanguageSwitch
        locale={locale}
        label={labels.language}
        location={location}
      />
      <HeaderRequestLink locale={locale} location={location} showIcon={false}>
        {labels.request}
      </HeaderRequestLink>
    </div>
  );
}
