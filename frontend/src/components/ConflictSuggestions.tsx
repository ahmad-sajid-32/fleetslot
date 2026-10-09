import { ArrowRightIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { buttonStyles } from "@/lib/styles";
import type { AvailabilitySlot } from "@/types";
export function ConflictSuggestions({
  suggestions,
  onSelect,
}: {
  suggestions: Pick<AvailabilitySlot, "startTime" | "endTime">[];
  onSelect: (s: string) => void;
}) {
  return (
    <div
      className="mt-[18px] rounded-lg border border-warning-border bg-warning-surface p-[15px] text-xs leading-normal text-warning"
      role="alert"
    >
      <strong className="flex items-center gap-2">
        <WarningCircleIcon size={18} aria-hidden="true" />
        This window was just booked.
      </strong>
      <p className="mt-1 mb-2.5">
        {suggestions.length
          ? "Choose an alternative below, then save again."
          : "No alternative windows remain. Choose another date or duration."}
      </p>
      <div className="flex flex-wrap gap-[7px]">
        {suggestions.map((s) => (
          <button
            className={`${buttonStyles} inline-flex min-h-11 items-center gap-2 rounded-lg border border-warning-button-border bg-surface px-2.5 py-[7px] text-[11px] text-warning`}
            type="button"
            key={s.startTime}
            onClick={() => onSelect(s.startTime)}
          >
            {s.startTime} – {s.endTime}
            <ArrowRightIcon size={15} aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
