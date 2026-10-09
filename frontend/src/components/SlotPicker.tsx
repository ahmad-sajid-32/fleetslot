import type { AvailabilitySlot } from "@/types";
export function SlotPicker({
  slots,
  value,
  onChange,
}: {
  slots: AvailabilitySlot[];
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <div className="slot-grid" role="group" aria-label="Available time windows">
      {slots.map((s) => (
        <button
          type="button"
          key={s.startTime}
          disabled={!s.available}
          aria-pressed={value === s.startTime}
          className={value === s.startTime ? "slot selected" : "slot"}
          onClick={() => onChange(s.startTime)}
        >
          <span>
            {s.startTime} – {s.endTime}
          </span>
          <small>
            {!s.available
              ? "Unavailable"
              : value === s.startTime
                ? "Selected"
                : "Available"}
          </small>
        </button>
      ))}
    </div>
  );
}
