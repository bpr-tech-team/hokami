import "./keystatic.css";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ibmPlexMono, ibmPlexSans, saira } from "../fonts";
import KeystaticApp from "./keystatic";

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
      className={`${saira.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
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
