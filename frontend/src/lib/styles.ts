// Complete utility strings keep every shared style discoverable by Tailwind.
export const focusStyles =
  "scroll-m-2 outline-offset-4 focus-visible:outline-2 focus-visible:outline-brand";
export const buttonStyles = `${focusStyles} cursor-pointer transition-[color,background-color,border-color,transform] duration-200 motion-safe:enabled:active:scale-[0.98] motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50`;
export const primaryButton = `${buttonStyles} inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-surface enabled:hover:bg-brand-hover`;
export const secondaryButton = `${buttonStyles} inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary enabled:hover:bg-background`;
export const iconButton = `${buttonStyles} inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-text-primary enabled:hover:bg-icon-surface`;
export const fieldLabel =
  "flex min-w-0 flex-col gap-2 text-xs font-semibold text-text-primary";
export const fieldControl = `${focusStyles} min-h-11 min-w-0 w-full rounded-lg border border-border-strong bg-surface px-3 py-2.5 text-sm font-normal text-text-primary transition-colors hover:border-text-secondary focus:border-brand placeholder:text-text-secondary motion-reduce:transition-none`;
export const eyebrow = "text-xs font-medium tracking-wide text-brand";
export const statusDot =
  "inline-block size-1.5 shrink-0 rounded-full bg-success";
export const emptyPanel = "px-6 py-16 text-center text-text-secondary";
export const skeleton =
  "animate-pulse rounded bg-border/70 motion-reduce:animate-none";
