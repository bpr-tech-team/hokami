export function FieldTrace() {
  const horizontal =
    "absolute h-0.5 w-1/4 bg-brand-identity transition-[width] duration-250 group-hover/control:w-full group-focus-within/control:w-full group-has-[[data-popup-open]]/control:w-full";
  const vertical =
    "absolute h-1/2 w-0.5 bg-brand-identity transition-[height] duration-250 group-hover/control:h-full group-focus-within/control:h-full group-has-[[data-popup-open]]/control:h-full";

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 group-has-[:disabled]/control:hidden group-has-[[aria-invalid=true]]/control:hidden"
    >
      <span className={`${horizontal} -top-px left-0`} />
      <span className={`${vertical} top-0 -left-px`} />
      <span className={`${horizontal} right-0 -bottom-px`} />
      <span className={`${vertical} -right-px bottom-0`} />
    </span>
  );
}
