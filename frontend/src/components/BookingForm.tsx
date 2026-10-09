"use client";
import {
  fieldLabel,
  fieldControl,
  primaryButton,
  secondaryButton,
} from "@/lib/styles";
import { useState } from "react";
import { useAvailability } from "@/hooks/useAvailability";
import { ApiError, errorMessage } from "@/lib/api";
import { localDate } from "@/lib/date";
import {
  BOOKING_TYPES,
  TYPE_LABELS,
  vehicleLabel,
  type Booking,
  type Vehicle,
  type CreateBookingInput,
  type AvailabilitySlot,
} from "@/types";
import { SlotPicker } from "./SlotPicker";
import { ConflictSuggestions } from "./ConflictSuggestions";
export function BookingForm({
  booking,
  vehicles,
  date,
  onSave,
  onClose,
  onBusy,
}: {
  booking?: Booking;
  vehicles: Vehicle[];
  date: string;
  onSave: (input: CreateBookingInput, id?: string) => Promise<void>;
  onClose: () => void;
  onBusy: (busy: boolean) => void;
}) {
  const [input, setInput] = useState<CreateBookingInput>(
    booking
      ? {
          title: booking.title,
          description: booking.description ?? "",
          type: booking.type,
          date: booking.date,
          startTime: booking.startTime,
          durationMinutes: booking.durationMinutes,
          vehicleId: booking.vehicleId,
        }
      : {
          title: "",
          description: "",
          type: "CLEANING",
          date: date < localDate() ? localDate() : date,
          startTime: "",
          durationMinutes: 60,
          vehicleId: vehicles.find((v) => v.active)?.id ?? "",
        },
  );
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [suggestions, setSuggestions] = useState<
      Pick<AvailabilitySlot, "startTime" | "endTime">[] | null
    >(null);
  const availability = useAvailability(
    input.vehicleId,
    input.date,
    input.durationMinutes,
    booking?.id,
  );
  function update<K extends keyof CreateBookingInput>(
    key: K,
    value: CreateBookingInput[K],
  ) {
    setInput((b) => ({
      ...b,
      [key]: value,
      ...(["vehicleId", "date", "durationMinutes"].includes(key)
        ? { startTime: "" }
        : {}),
    }));
    setSuggestions(null);
    setError("");
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    onBusy(true);
    setError("");
    setSuggestions(null);
    try {
      await onSave({ ...input, title: input.title.trim() }, booking?.id);
      onClose();
    } catch (e) {
      if (e instanceof ApiError && e.code === "BOOKING_CONFLICT") {
        setSuggestions(e.suggestions ?? []);
        availability.refresh();
      } else setError(errorMessage(e));
    } finally {
      setBusy(false);
      onBusy(false);
    }
  }
  const selectable = availability.slots.some(
    (s) => s.available && s.startTime === input.startTime,
  );
  return (
    <form onSubmit={submit}>
      <fieldset
        className="min-w-0 px-7 py-6 max-sm:px-[18px] max-sm:py-5"
        disabled={busy}
      >
        <div className="grid grid-cols-2 gap-4 max-sm:gap-3">
          <label className={fieldLabel}>
            Operation type
            <select
              className={`${fieldControl} pr-7`}
              aria-label="Operation type"
              value={input.type}
              onChange={(e) =>
                update("type", e.target.value as CreateBookingInput["type"])
              }
            >
              {BOOKING_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </label>
          <label className={fieldLabel}>
            Vehicle
            <select
              className={`${fieldControl} pr-7`}
              aria-label="Vehicle"
              required
              value={input.vehicleId}
              onChange={(e) => update("vehicleId", e.target.value)}
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id} disabled={!v.active}>
                  {vehicleLabel(v)} · {v.plateNumber}
                  {!v.active ? " (Inactive)" : ""}
                </option>
              ))}
            </select>
          </label>
          <label className={fieldLabel}>
            Date
            <input
              className={fieldControl}
              type="date"
              min={localDate()}
              required
              value={input.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </label>
          <label className={fieldLabel}>
            Duration
            <select
              className={`${fieldControl} pr-7`}
              aria-label="Duration"
              value={input.durationMinutes}
              onChange={(e) =>
                update("durationMinutes", Number(e.target.value))
              }
            >
              {[30, 60, 90, 120, 150, 180, 210, 240].map((d) => (
                <option key={d} value={d}>
                  {d} minutes
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-[26px] mb-3 flex items-center justify-between gap-2 max-sm:flex-col max-sm:items-start">
          <h3 className="text-[13px] font-semibold">Choose a time window</h3>
          <span className="text-[10px] text-text-secondary">
            09:00 – 17:00 · Local time
          </span>
        </div>
        {availability.loading ? (
          <p
            role="status"
            className="py-2 text-xs leading-normal text-text-secondary"
          >
            Finding availability…
          </p>
        ) : availability.error ? (
          <div>
            <p
              role="alert"
              className="py-2.5 text-xs leading-normal text-error"
            >
              {availability.error}
            </p>
            <button
              type="button"
              className={secondaryButton}
              onClick={availability.refresh}
            >
              Retry availability
            </button>
          </div>
        ) : (
          <>
            <SlotPicker
              slots={availability.slots}
              value={input.startTime}
              onChange={(s) => {
                update("startTime", s);
              }}
            />
            {availability.slots.length > 0 &&
              !availability.slots.some((s) => s.available) && (
                <p className="py-2 text-xs leading-normal text-text-secondary">
                  No {input.durationMinutes}-minute windows are available for
                  this vehicle.
                </p>
              )}
          </>
        )}
        <div className="mt-6 flex flex-col gap-4">
          <label className={fieldLabel}>
            Operation title
            <input
              className={fieldControl}
              required
              maxLength={120}
              placeholder="e.g. Prepare for afternoon pickup"
              value={input.title}
              onChange={(e) => update("title", e.target.value)}
            />
          </label>
          <label className={fieldLabel}>
            Notes{" "}
            <span className="inline font-normal text-text-secondary">
              Optional
            </span>
            <textarea
              className={`${fieldControl} resize-y`}
              rows={3}
              maxLength={1000}
              placeholder="Add handoff details or a checklist…"
              value={input.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </label>
        </div>
        {suggestions !== null && (
          <ConflictSuggestions
            suggestions={suggestions}
            onSelect={(s) => {
              setInput((b) => ({ ...b, startTime: s }));
              setSuggestions(null);
              setError("");
            }}
          />
        )}
        {error && (
          <p role="alert" className="py-2.5 text-xs leading-normal text-error">
            {error}
          </p>
        )}
      </fieldset>
      <div className="sticky bottom-0 flex items-center justify-end gap-2.5 border-t border-border bg-surface px-7 py-[18px] max-sm:flex-wrap max-sm:px-[18px] max-sm:py-3.5">
        <span className="mr-auto text-[11px] text-text-secondary max-sm:basis-full max-sm:text-[10px]">
          {input.startTime
            ? `Selected: ${input.startTime} · ${input.durationMinutes} min`
            : "Select an available window"}
        </span>
        <button
          type="button"
          className={secondaryButton}
          disabled={busy}
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className={`${primaryButton} max-sm:flex-1`}
          disabled={
            busy ||
            availability.loading ||
            !!availability.error ||
            !selectable ||
            !input.title.trim()
          }
        >
          {busy ? "Saving…" : booking ? "Save changes" : "Schedule operation"}
        </button>
      </div>
    </form>
  );
}
