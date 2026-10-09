import { buttonStyles } from "@/lib/styles";
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
    <div
      className="grid grid-cols-3 gap-2 max-sm:grid-cols-2"
      role="group"
      aria-label="Available time windows"
    >
      {slots.map((s) => (
        <button
          type="button"
          key={s.startTime}
          disabled={!s.available}
          aria-pressed={value === s.startTime}
          className={`${buttonStyles} flex flex-col items-center rounded-[7px] border border-border bg-surface px-[5px] py-2 text-xs leading-normal text-text-primary aria-pressed:border-brand aria-pressed:bg-selected aria-pressed:text-brand aria-pressed:ring-1 aria-pressed:ring-brand disabled:bg-background`}
          onClick={() => onChange(s.startTime)}
        >
          <span>
            {s.startTime} – {s.endTime}
          </span>
          <small className="mt-[3px] text-[9px] text-text-secondary">
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
