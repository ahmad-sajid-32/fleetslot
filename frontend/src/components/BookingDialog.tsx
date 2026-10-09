"use client";
import {
  CalendarPlusIcon,
  PencilSimpleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { iconButton } from "@/lib/styles";
import { useState } from "react";
import type { Booking, Vehicle, CreateBookingInput } from "@/types";
import { BookingForm } from "./BookingForm";
import { Modal } from "./Modal";
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
  const [busy, setBusy] = useState(false);
  const Icon = booking ? PencilSimpleIcon : CalendarPlusIcon;
  return (
    <Modal
      labelledBy="dialog-title"
      describedBy="dialog-description"
      busy={busy}
      onClose={onClose}
    >
      <div className="flex shrink-0 items-start gap-3 border-b border-border p-6 max-sm:p-5">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-selected text-brand max-sm:hidden">
          <Icon size={23} aria-hidden="true" />
        </span>
        <div className="flex-1">
          <h2
            id="dialog-title"
            className="text-2xl font-semibold tracking-tight max-sm:text-xl"
          >
            {booking ? "Edit operation" : "Schedule an operation"}
          </h2>
          <p
            id="dialog-description"
            className="mt-1 text-sm text-text-primary/65"
          >
            Choose a vehicle and an available time window.
          </p>
        </div>
        <button
          aria-label="Close dialog"
          className={iconButton}
          disabled={busy}
          onClick={onClose}
        >
          <XIcon size={20} aria-hidden="true" />
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
    </Modal>
  );
}
