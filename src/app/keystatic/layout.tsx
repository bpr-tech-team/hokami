import type { Metadata } from "next";
import { Suspense } from "react";
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
    <html lang="cs">
      <body>
        <Suspense fallback={<p>Načítání administrace…</p>}>
          <KeystaticApp />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
