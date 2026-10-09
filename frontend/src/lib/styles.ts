// Shared, statically discoverable Tailwind utilities for repeated controls.
export const focusStyles =
  "outline-offset-4 focus-visible:outline-2 focus-visible:outline-brand";
export const buttonStyles = `${focusStyles} cursor-pointer transition-colors duration-150 motion-reduce:transition-none enabled:hover:brightness-[0.96] disabled:cursor-not-allowed disabled:opacity-50`;
export const primaryButton = `${buttonStyles} inline-flex items-center justify-center gap-[9px] rounded-lg bg-brand px-[18px] py-3 font-semibold whitespace-nowrap text-surface enabled:hover:bg-brand-hover`;
export const secondaryButton = `${buttonStyles} rounded-lg border border-border bg-surface px-4 py-[11px] text-text-primary`;
export const fieldLabel =
  "flex flex-col gap-[7px] text-[11px] font-semibold text-text-secondary";
export const fieldControl = `${focusStyles} min-h-[42px] min-w-0 w-full rounded-[7px] border border-border bg-surface px-3 py-2.5 text-[13px] font-normal text-text-primary placeholder:text-placeholder`;
export const eyebrow =
  "text-[10px] font-bold tracking-[1.8px] text-text-secondary";
export const statusDot =
  "inline-block size-1.5 shrink-0 rounded-full bg-success";
export const emptyPanel =
  "rounded-panel border border-dashed border-border px-6 py-[65px] text-center text-text-secondary";
