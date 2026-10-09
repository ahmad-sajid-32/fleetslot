import { CalendarDotsIcon } from "@phosphor-icons/react";
import { focusStyles, statusDot } from "@/lib/styles";
export function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <a
        href="#main-content"
        className={`${focusStyles} sr-only fixed top-3 left-4 z-50 rounded-lg bg-brand p-3 text-surface focus:not-sr-only`}
      >
        Skip to schedule
      </a>
      <div className="mx-auto flex h-[76px] max-w-workspace items-center justify-between gap-5 px-6 max-sm:h-16 max-sm:px-4">
        <div className="flex items-center gap-7 max-sm:gap-4">
          <a
            className={`${focusStyles} flex items-center gap-2.5 text-xl font-bold tracking-tight`}
            href="/"
            aria-label="FleetSlot home"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-brand text-xl text-surface">
              F
            </span>
            FleetSlot
          </a>
          <span
            className="h-6 w-px bg-border max-sm:hidden"
            aria-hidden="true"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-xs text-text-primary/70 max-sm:hidden">
            <span className={statusDot} />
            Demo workspace
          </span>
          <span
            className="grid size-9 place-items-center rounded-xl border border-border bg-background text-xs font-semibold text-brand"
            aria-label="Operations workspace"
          >
            OP
          </span>
        </div>
      </div>
    </header>
  );
}
