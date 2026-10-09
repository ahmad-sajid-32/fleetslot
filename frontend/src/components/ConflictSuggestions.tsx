import type { AvailabilitySlot } from "@/types";
export function ConflictSuggestions({
  suggestions,
  onSelect,
}: {
  suggestions: Pick<AvailabilitySlot, "startTime" | "endTime">[];
  onSelect: (s: string) => void;
}) {
  return (
    <div className="conflict-box" role="alert">
      <strong>This window was just booked.</strong>
      <p>
        {suggestions.length
          ? "Choose an alternative below, then save again."
          : "No alternative windows remain. Choose another date or duration."}
      </p>
      <div className="suggestion-chips">
        {suggestions.map((s) => (
          <button
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
