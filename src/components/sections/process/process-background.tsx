import { cn } from "cn";

function ProcessGlow({ className }: { className: string }) {
  return (
    <div
      data-slot="process-glow"
      className={cn(
        "absolute h-[974px] w-[1012px] bg-radial-[ellipse_closest-side_at_center] from-brand-identity/70 from-30% via-brand-identity/50 via-60% to-brand-identity/0",
        className,
      )}
    />
  );
}

export function ProcessBackground({
  placement = "section",
}: {
  placement?: "section" | "scene";
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -z-10 desktop:opacity-50",
        placement === "scene"
          ? "inset-x-0 top-[calc(-1*var(--process-heading-offset,0px))] h-[calc(var(--process-scene-height)+var(--process-distance,0px)+var(--process-controls-space)+var(--process-heading-offset,0px))]"
          : "inset-0",
      )}
    >
      <ProcessGlow className="top-1/4 left-0 -translate-1/2 scale-55 opacity-30 tablet:scale-50 desktop:top-[290px] desktop:scale-75 desktop:opacity-100" />
      <ProcessGlow className="top-3/4 right-0 hidden translate-x-1/2 -translate-y-1/2 scale-35 tablet:scale-50 desktop:top-[682px] desktop:block desktop:scale-75" />
    </div>
  );
}
