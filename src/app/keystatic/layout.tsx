import "./keystatic.css";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ibmPlexMono, ibmPlexSans, saira } from "../fonts";
import KeystaticApp from "./keystatic";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "HOKAMI — správa volných pozic",
  robots: { index: false, follow: false },
};

export default function KeystaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="cs"
      data-hokami-admin
      className={cn(
        `${saira.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`,
        // Keystar 0.10 wraps required indicators in two spans after the label.
        // Scope their appearance at the admin root so portal dialogs match
        // the small gray indicators in our fields and editor labels.
        "[&_:is(label[id],span[id])>span>span[aria-hidden=true]]:ps-1! [&_:is(label[id],span[id])>span>span[aria-hidden=true]]:font-mono! [&_:is(label[id],span[id])>span>span[aria-hidden=true]]:text-xs! [&_:is(label[id],span[id])>span>span[aria-hidden=true]]:leading-body! [&_:is(label[id],span[id])>span>span[aria-hidden=true]]:font-normal! [&_:is(label[id],span[id])>span>span[aria-hidden=true]]:text-text-secondary!",
      )}
    >
      <body>
        <Suspense fallback={<p>Načítání administrace…</p>}>
          <KeystaticApp />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
