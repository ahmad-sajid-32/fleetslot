import { CircleNotchIcon } from "@phosphor-icons/react";
import { skeleton } from "@/lib/styles";

export function Spinner({ className = "size-4" }: { className?: string }) {
  return (
    <CircleNotchIcon
      aria-hidden="true"
      className={`${className} shrink-0 animate-spin motion-reduce:animate-none`}
    />
  );
}

export function ScheduleSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading schedule"
      className="space-y-7 p-6 max-sm:p-4"
    >
      <span className="sr-only">Loading your fleet schedule…</span>
      {[0, 1, 2].map((row) => (
        <div
          key={row}
          aria-hidden="true"
          className="grid grid-cols-[12rem_1fr] gap-6 max-lg:grid-cols-1 max-lg:gap-4"
        >
          <div className="flex items-center gap-3">
            <div className={`${skeleton} size-11`} />
            <div className="space-y-2">
              <div className={`${skeleton} h-4 w-28`} />
              <div className={`${skeleton} h-3 w-20`} />
            </div>
          </div>
          <div className="space-y-3">
            {Array.from({ length: row === 0 ? 2 : 1 }, (_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-xl border border-border p-5"
              >
                <div className={`${skeleton} h-10 w-16`} />
                <div className="flex-1 space-y-3">
                  <div className={`${skeleton} h-4 w-2/3`} />
                  <div className={`${skeleton} h-3 w-4/5`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AvailabilitySkeleton({ count }: { count: number }) {
  return (
    <div role="status" aria-label="Finding availability">
      <span className="sr-only">Finding availability…</span>
      <div
        aria-hidden="true"
        className="grid grid-cols-3 gap-2 max-sm:grid-cols-2"
      >
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className={`${skeleton} h-[62px]`} />
        ))}
      </div>
    </div>
  );
}
