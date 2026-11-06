import { notFound } from "next/navigation";

// This route intentionally terminates rendering rather than supplying a page shell.
export const instant = false;

export function generateStaticParams() {
  return [{ rest: ["not-found"] }];
}

export default function UnknownPage() {
  notFound();
}
