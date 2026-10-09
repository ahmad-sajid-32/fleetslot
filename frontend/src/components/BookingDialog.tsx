"use client";
import { buttonStyles, eyebrow } from "@/lib/styles";
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
      className="m-auto max-h-[calc(100dvh-60px)] w-[760px] max-w-[calc(100vw-40px)] overflow-auto rounded-2xl border border-border bg-surface p-0 text-text-primary shadow-modal backdrop:bg-backdrop backdrop:backdrop-blur-[3px] max-sm:max-h-[calc(100dvh-12px)] max-sm:w-full max-sm:max-w-[calc(100vw-12px)] max-sm:rounded-panel"
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
      <div className="flex justify-between border-b border-border px-7 pt-[25px] pb-5 max-sm:px-[18px] max-sm:pt-5">
        <div>
          <span className={eyebrow}>VEHICLE OPERATIONS</span>
          <h2
            id="dialog-title"
            className="my-[5px] text-[25px] tracking-[-0.7px] max-sm:text-[22px]"
          >
            {booking ? "Edit operation" : "Schedule an operation"}
          </h2>
          <p className="text-xs leading-normal text-text-secondary">
            Find the right window. Keep your fleet moving.
          </p>
        </div>
        <button
          aria-label="Close dialog"
          className={`${buttonStyles} size-8 shrink-0 rounded-full bg-background text-[22px] text-text-secondary`}
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
