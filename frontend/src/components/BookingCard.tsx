import { buttonStyles } from "@/lib/styles";
import { useState } from "react";
import { TYPE_LABELS, endTime, type Booking, type BookingType } from "@/types";
import { errorMessage } from "@/lib/api";
// Complete utility names let Tailwind discover every operation color at build time.
const operationStyles: Record<BookingType, { border: string; badge: string }> =
  {
    PICKUP_HANDOFF: {
      border: "border-t-pickup",
      badge: "bg-pickup/9 text-pickup",
    },
    RETURN_HANDOFF: {
      border: "border-t-return",
      badge: "bg-return/9 text-return",
    },
    INSPECTION: {
      border: "border-t-inspection",
      badge: "bg-inspection/9 text-inspection",
    },
    CLEANING: {
      border: "border-t-cleaning",
      badge: "bg-cleaning/9 text-cleaning",
    },
    MAINTENANCE: {
      border: "border-t-maintenance",
      badge: "bg-maintenance/9 text-maintenance",
    },
  };
export function BookingCard({
  booking,
  onEdit,
  onDelete,
}: {
  booking: Booking;
  onEdit: (b: Booking) => void;
  onDelete: (id: string) => Promise<void>;
}) {
  const [confirm, setConfirm] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function remove() {
    setBusy(true);
    setError("");
    try {
      await onDelete(booking.id);
    } catch (e) {
      setError(errorMessage(e));
      setBusy(false);
    }
  }
  return (
    <article
      className={`rounded-[9px] border border-border border-t-[3px] bg-surface px-5 pt-[19px] shadow-card ${operationStyles[booking.type].border}`}
    >
      <div className="mb-3.5 flex items-center justify-between">
        <span className="text-lg leading-normal font-medium tracking-[-0.6px]">
          {booking.startTime}
          <span className="mx-2 text-[13px] text-text-secondary">—</span>
          {endTime(booking)}
        </span>
        <span className="rounded bg-background px-1.5 py-[3px] text-[10px] text-text-secondary">
          {booking.durationMinutes} min
        </span>
      </div>
      <span
        className={`inline-block rounded px-[7px] py-1 text-[10px] font-semibold ${operationStyles[booking.type].badge}`}
      >
        {TYPE_LABELS[booking.type]}
      </span>
      <h3 className="mt-[13px] mb-1.5 text-sm leading-normal font-semibold wrap-anywhere">
        {booking.title}
      </h3>
      <p className="min-h-9 text-xs leading-normal whitespace-pre-wrap text-text-secondary wrap-anywhere">
        {booking.description || "No additional notes."}
      </p>
      <div className="mt-[18px] flex items-center justify-between gap-2 border-t border-border py-3">
        {confirm ? (
          <>
            <span className="text-[10px]">Delete operation?</span>
            <button
              className={`${buttonStyles} bg-transparent py-[3px] text-[11px] font-semibold text-error`}
              onClick={remove}
              disabled={busy}
            >
              {busy ? "Deleting…" : "Confirm delete"}
            </button>
            <button
              className={`${buttonStyles} bg-transparent py-[3px] text-[11px] font-semibold text-brand`}
              onClick={() => setConfirm(false)}
              disabled={busy}
            >
              Keep
            </button>
          </>
        ) : (
          <>
            <button
              className={`${buttonStyles} bg-transparent py-[3px] text-[11px] font-semibold text-brand`}
              onClick={() => onEdit(booking)}
            >
              Edit
            </button>
            <button
              className={`${buttonStyles} bg-transparent py-[3px] text-[11px] text-text-secondary`}
              onClick={() => setConfirm(true)}
            >
              Delete
            </button>
          </>
        )}
      </div>
      {error && (
        <p role="alert" className="py-2.5 text-xs leading-normal text-error">
          {error}
        </p>
      )}
    </article>
  );
}
