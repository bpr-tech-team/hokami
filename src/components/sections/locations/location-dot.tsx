import { cn } from "@/lib/utils";

export function LocationDot({
  active,
  variant = "legend",
}: {
  active: boolean;
  variant?: "legend" | "map";
}) {
  if (variant === "legend") {
    // Retain the original 8-bit alpha values instead of rounding percentages.
    return (
      <span
        aria-hidden="true"
        className={cn(
          "block size-[11px] shrink-0 rounded-[50%] bg-action-primary transition-shadow duration-250",
          active
            ? "shadow-[0_0_0_4px_rgb(from_var(--color-brand-identity)_r_g_b/calc(51/255)),0_0_12px_4px_rgb(from_var(--color-brand-identity)_r_g_b/calc(128/255))]"
            : "shadow-[0_0_0_3px_rgb(from_var(--color-brand-identity)_r_g_b/calc(26/255)),0_0_9px_3px_rgb(from_var(--color-brand-identity)_r_g_b/calc(77/255))]",
        )}
      />
    );
  }

  // Gradient rings preserve subpixel stroke widths; CSS borders round tiny widths
  // to device pixels. Explicit 50% radii avoid oversized rounded-full radii.
  return (
    <span aria-hidden="true" className="relative block aspect-square w-full">
      <span className="absolute inset-[6.25%] opacity-55">
        <span className="block size-full origin-center animate-[hokami-location-halo_30s_infinite] rounded-[50%] bg-[radial-gradient(circle_closest-side,transparent_0_85.7143%,var(--color-action-primary)_87%_97%,transparent_100%)] [animation-play-state:paused] group-data-[motion=running]/locations:[animation-play-state:running] motion-reduce:animate-none" />
      </span>
      <span className="absolute inset-0 rounded-[50%] bg-[radial-gradient(circle_closest-side,var(--color-action-primary)_0_42.5%,var(--color-surface-default)_44%_82.5%,var(--color-action-primary)_84%_97%,transparent_100%)]" />
      <span
        className={cn(
          "absolute -inset-[7.5%] rounded-[50%] bg-[radial-gradient(circle_closest-side,var(--color-action-primary)_0_36.9565%,var(--color-surface-default)_38.5%_73.9%,var(--color-action-primary)_75%_97%,transparent_100%)] shadow-[0_0_1.2cqw_0.5cqw_rgb(from_var(--color-brand-identity)_r_g_b/calc(102/255))] transition-opacity duration-250",
          !active && "opacity-0",
        )}
      />
    </span>
  );
}
