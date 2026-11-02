export function HeroHorizonGlow() {
  return (
    <div
      aria-hidden="true"
      data-slot="hero-horizon-glow"
      className="absolute bottom-[-230.2px] left-1/2 size-[593px] -translate-x-1/2 overflow-hidden [--glow-center-y:70.2px] [--glow-radius:592.094px] tablet:bottom-[-839.2px] tablet:size-[2168px] tablet:[--glow-center-y:259.2px] tablet:[--glow-radius:2186.19px]"
    >
      {/* SVG interpolates color and opacity separately; keep that behavior with a mask.
          The 4 px inset leaves the original room for blur. */}
      <div className="absolute inset-1 rounded-[50%] blur-[2px] before:absolute before:inset-0 before:rounded-[50%] before:bg-[radial-gradient(circle_var(--glow-radius)_at_50%_var(--glow-center-y)_in_srgb,#fe4704_0%,#fe8c5a_32%,#ffece2_58%)] before:mask-[radial-gradient(circle_var(--glow-radius)_at_50%_var(--glow-center-y),rgb(0_0_0/0.22)_0%,rgb(0_0_0/0.16)_32%,rgb(0_0_0/0.95)_58%,transparent_70%)] after:absolute after:inset-0 after:rounded-[50%] after:border after:border-brand-identity/50 after:mask-[linear-gradient(#000_12%,transparent_22%)] tablet:after:hidden" />
    </div>
  );
}
