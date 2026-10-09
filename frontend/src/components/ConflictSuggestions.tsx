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
      <strong>This window was just booked.</strong>
      <p className="mt-1 mb-2.5">
        {suggestions.length
          ? "Choose an alternative below, then save again."
          : "No alternative windows remain. Choose another date or duration."}
      </p>
      <div className="flex flex-wrap gap-[7px]">
        {suggestions.map((s) => (
          <button
            className={`${buttonStyles} rounded-[20px] border border-warning-button-border bg-surface px-2.5 py-[7px] text-[11px] text-warning`}
            type="button"
            key={s.startTime}
            onClick={() => onSelect(s.startTime)}
          >
            {s.startTime} – {s.endTime} ↗
          </button>
        ))}
      </div>
    </div>
  );
}
