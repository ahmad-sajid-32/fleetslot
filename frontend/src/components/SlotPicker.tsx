import { CheckCircleIcon } from "@phosphor-icons/react";
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
          className={`${buttonStyles} flex min-h-[62px] flex-col items-center justify-center gap-1 rounded-lg border border-border bg-surface px-1 py-2 text-xs tabular-nums text-text-primary enabled:hover:border-brand aria-pressed:border-brand aria-pressed:bg-selected aria-pressed:text-brand aria-pressed:ring-1 aria-pressed:ring-brand disabled:bg-background`}
          onClick={() => onChange(s.startTime)}
        >
          <span className="font-medium">
            {s.startTime} – {s.endTime}
          </span>
          <span className="flex items-center gap-1 text-[10px]">
            {s.available && value === s.startTime && (
              <CheckCircleIcon size={12} weight="fill" aria-hidden="true" />
            )}
            {!s.available
              ? "Unavailable"
              : value === s.startTime
                ? "Selected"
                : "Available"}
          </span>
        </button>
      ))}
    </div>
  );
}
