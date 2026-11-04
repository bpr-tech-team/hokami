import Image from "next/image";
import type { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function FormError({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Alert
      variant="destructive"
      className="flex items-start gap-3 rounded-none border-feedback-error-text bg-feedback-error-surface p-4"
    >
      <Image
        src="/images/reques-for-quote/alert.svg"
        width={20}
        height={20}
        alt=""
        className="mt-0.5 shrink-0"
      />
      <div>
        <AlertTitle className="font-display text-base font-semibold uppercase">
          {title}
        </AlertTitle>
        <AlertDescription className="mt-1 text-feedback-error-text">
          {children}
        </AlertDescription>
      </div>
    </Alert>
  );
}
