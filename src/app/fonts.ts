import { IBM_Plex_Mono, IBM_Plex_Sans, Saira } from "next/font/google";

export const saira = Saira({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-saira",
});

export const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-ibm-plex-sans",
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
});
