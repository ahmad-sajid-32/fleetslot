"use client";
import { useEffect, useRef, useState } from "react";
import type { Booking, Vehicle, CreateBookingInput } from "@/types";
import { BookingForm } from "./BookingForm";
export function BookingDialog({
  booking,
  vehicles,
  date,
  onSave,
  onClose,
}: {
  booking?: Booking;
  vehicles: Vehicle[];
  date: string;
  onSave: (input: CreateBookingInput, id?: string) => Promise<void>;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="booking-dialog"
      aria-labelledby="dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current && !busy) {
          const rect = ref.current.getBoundingClientRect();
          if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
          )
            onClose();
        }
      }}
    >
      <div className="dialog-header">
        <div>
          <span className="eyebrow">VEHICLE OPERATIONS</span>
          <h2 id="dialog-title">
            {booking ? "Edit operation" : "Schedule an operation"}
          </h2>
          <p>Find the right window. Keep your fleet moving.</p>
        </div>
        <button
          aria-label="Close dialog"
          className="icon-button"
          disabled={busy}
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <BookingForm
        booking={booking}
        vehicles={vehicles}
        date={date}
        onSave={onSave}
        onClose={onClose}
        onBusy={setBusy}
      />
    </dialog>
  );
}
