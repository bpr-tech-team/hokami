"use client";

import { makePage } from "@keystatic/next/ui/app";
import config from "../../../keystatic.config";

const KeystaticPage = config ? makePage(config) : null;

export default function KeystaticApp() {
  if (!KeystaticPage) {
    return (
      <main>
        <h1>HOKAMI — správa volných pozic</h1>
        <p>
          Keystatic Cloud zatím není připojený. Obraťte se prosím na správce
          webu.
        </p>
      </main>
    );
  }

  return <KeystaticPage />;
}
