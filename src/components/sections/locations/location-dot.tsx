import { cn } from "cn";

export function LocationDot({
  active,
  variant = "legend",
}: {
  active: boolean;
  variant?: "legend" | "map";
}) {
  if (variant === "legend") {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "block size-[11px] shrink-0 rounded-[50%] bg-action-primary transition-shadow duration-250",
          active
            ? "shadow-[0_0_0_4px_#fe470433,0_0_12px_4px_#fe470480]"
            : "shadow-[0_0_0_3px_#fe47041a,0_0_9px_3px_#fe47044d]",
        )}
      />
    );
  }

  // Gradient rings preserve subpixel stroke widths; CSS borders round tiny widths
  // to device pixels. Explicit 50% radii avoid oversized rounded-full radii.
  return (
    <span aria-hidden="true" className="relative block aspect-square w-full">
      <span className="absolute inset-[6.25%] opacity-55">
        <span className="block size-full origin-center animate-[hokami-location-halo_30s_infinite] rounded-[50%] bg-[radial-gradient(circle_closest-side,transparent_0_85.7143%,#cc3700_87%_97%,transparent_100%)] [animation-play-state:paused] group-data-[motion=running]/locations:[animation-play-state:running] motion-reduce:animate-none" />
      </span>
      <span className="absolute inset-0 rounded-[50%] bg-[radial-gradient(circle_closest-side,#cc3700_0_42.5%,white_44%_82.5%,#cc3700_84%_97%,transparent_100%)]" />
      <span
        className={cn(
          "absolute -inset-[7.5%] rounded-[50%] bg-[radial-gradient(circle_closest-side,#cc3700_0_36.9565%,white_38.5%_73.9%,#cc3700_75%_97%,transparent_100%)] shadow-[0_0_1.2cqw_0.5cqw_#fe470466] transition-opacity duration-250",
          !active && "opacity-0",
        )}
      />
    </span>
  );
}
