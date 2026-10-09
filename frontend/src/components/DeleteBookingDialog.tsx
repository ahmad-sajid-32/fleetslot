"use client";
import { useRef, useState } from "react";
import {
  CalendarBlankIcon,
  ClockIcon,
  TrashIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { Modal } from "./Modal";
import { Spinner } from "./LoadingStates";
import { buttonStyles, secondaryButton } from "@/lib/styles";
import { errorMessage } from "@/lib/api";
import { dateLabel } from "@/lib/date";
import { endTime, vehicleLabel, type Booking, type Vehicle } from "@/types";

export function DeleteBookingDialog({
  booking,
  vehicle,
  onDelete,
  onClose,
}: {
  booking: Booking;
  vehicle?: Vehicle;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  async function remove() {
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError("");
    try {
      await onDelete(booking.id);
      returnFocusRef.current = document.getElementById("schedule-operation");
      onClose();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  return (
    <Modal
      compact
      alert
      labelledBy="delete-title"
      describedBy="delete-description"
      busy={busy}
      onClose={onClose}
      returnFocusRef={returnFocusRef}
    >
      <div className="p-7 max-sm:p-5">
        <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-error/10 text-error">
          <TrashIcon size={24} aria-hidden="true" />
        </div>
        <h2 id="delete-title" className="text-2xl font-semibold tracking-tight">
          Delete this operation?
        </h2>
        <p
          id="delete-description"
          className="mt-2 text-sm leading-relaxed text-text-primary/75"
        >
          This will free up its time window. This action cannot be undone.
        </p>
        <div className="my-5 rounded-xl border border-border bg-background p-4">
          <p className="font-semibold wrap-anywhere">{booking.title}</p>
          {vehicle && (
            <p className="mt-1 text-sm text-text-primary/75">
              {vehicleLabel(vehicle)} · {vehicle.plateNumber}
            </p>
          )}
          <div className="mt-4 flex flex-col gap-2 text-xs text-text-primary/75">
            <span className="flex items-center gap-2">
              <CalendarBlankIcon size={16} aria-hidden="true" />
              {dateLabel(booking.date)}
            </span>
            <span className="flex items-center gap-2 tabular-nums">
              <ClockIcon size={16} aria-hidden="true" />
              {booking.startTime} – {endTime(booking)} ·{" "}
              {booking.durationMinutes} min
            </span>
          </div>
        </div>
        {error && (
          <p
            role="alert"
            className="mb-4 flex items-start gap-2 rounded-lg bg-error/10 p-3 text-sm text-error"
          >
            <WarningCircleIcon
              size={18}
              className="shrink-0"
              aria-hidden="true"
            />
            {error}
          </p>
        )}
        <div className="flex justify-end gap-3 max-sm:flex-col-reverse">
          <button
            autoFocus
            className={secondaryButton}
            disabled={busy}
            onClick={onClose}
          >
            Keep operation
          </button>
          <button
            className={`${buttonStyles} inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-error px-4 py-2.5 text-sm font-semibold text-surface enabled:hover:bg-error/90`}
            disabled={busy}
            onClick={remove}
          >
            {busy ? <Spinner /> : <TrashIcon size={18} aria-hidden="true" />}
            {busy ? "Deleting…" : "Delete operation"}
          </button>
        </div>
        <span role="status" className="sr-only">
          {busy ? "Deleting operation. Please wait." : ""}
        </span>
      </div>
    </Modal>
  );
}
