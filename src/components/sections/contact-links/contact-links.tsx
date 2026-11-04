import Image from "next/image";
import { companyContacts } from "@/content/company";
import { cn } from "@/lib/utils";

type ContactLinksProps = {
  contacts?: readonly { label: string; href: string; icon: string }[];
  className?: string;
  linkClassName?: string;
};

export function ContactLinks({
  contacts = companyContacts,
  className,
  linkClassName,
}: ContactLinksProps) {
  return (
    <ul className={cn("flex min-w-0 flex-col gap-4", className)}>
      {contacts.map(({ label, href, icon }) => (
        <li key={href} className="min-w-0">
          <a
            href={href}
            className={cn(
              "flex min-h-11 items-center gap-2 text-text-accent underline decoration-from-font underline-offset-auto transition-colors hover:text-text-accent-hover",
              linkClassName,
            )}
          >
            <Image
              src={icon}
              alt=""
              width={20}
              height={20}
              unoptimized
              className="shrink-0"
            />
            <span className="min-w-0 wrap-anywhere">{label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
