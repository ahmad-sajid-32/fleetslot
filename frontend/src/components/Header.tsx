import { focusStyles, statusDot } from "@/lib/styles";
export function Header() {
  return (
    <header className="flex h-[82px] items-center justify-between border-b border-border bg-surface px-[max(32px,calc((100vw-var(--layout-width))/2))] max-sm:h-[66px] max-sm:px-5">
      <a
        className={`${focusStyles} flex items-center gap-3 text-[22px] font-bold tracking-[-0.8px] max-sm:text-xl`}
        href="/"
        aria-label="FleetSlot home"
      >
        <span className="flex size-[34px] items-center justify-center rounded-[9px] bg-brand text-[23px] text-surface">
          F
        </span>
        FleetSlot
        <span className="mx-2 h-[22px] w-px bg-border max-lg:hidden" />
        <span className="text-[10px] font-medium tracking-[1.5px] text-text-secondary max-lg:hidden">
          OPERATIONS WORKSPACE
        </span>
      </a>
      <div className="flex items-center gap-[9px] text-xs leading-normal text-text-secondary">
        <span className={statusDot} />
        Demo fleet{" "}
        <span className="ml-[18px] grid size-[34px] place-items-center rounded-full border border-border bg-background text-[10px] font-bold text-brand max-sm:ml-[3px]">
          OP
        </span>
      </div>
    </header>
  );
}
