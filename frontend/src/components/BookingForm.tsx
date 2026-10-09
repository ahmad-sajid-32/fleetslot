"use client";
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
      <fieldset disabled={busy}>
        <div className="form-grid">
          <label>
            Operation type
            <select
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
          <label>
            Vehicle
            <select
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
          <label>
            Date
            <input
              type="date"
              min={localDate()}
              required
              value={input.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </label>
          <label>
            Duration
            <select
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
        <div className="slot-heading">
          <h3>Choose a time window</h3>
          <span>09:00 – 17:00 · Local time</span>
        </div>
        {availability.loading ? (
          <p role="status" className="muted">
            Finding availability…
          </p>
        ) : availability.error ? (
          <div>
            <p role="alert" className="error-text">
              {availability.error}
            </p>
            <button
              type="button"
              className="secondary-button"
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
                <p className="muted">
                  No {input.durationMinutes}-minute windows are available for
                  this vehicle.
                </p>
              )}
          </>
        )}
        <div className="form-notes">
          <label>
            Operation title
            <input
              required
              maxLength={120}
              placeholder="e.g. Prepare for afternoon pickup"
              value={input.title}
              onChange={(e) => update("title", e.target.value)}
            />
          </label>
          <label>
            Notes <span className="optional">Optional</span>
            <textarea
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
          <p role="alert" className="error-text">
            {error}
          </p>
        )}
      </fieldset>
      <div className="dialog-footer">
        <span>
          {input.startTime
            ? `Selected: ${input.startTime} · ${input.durationMinutes} min`
            : "Select an available window"}
        </span>
        <button
          type="button"
          className="secondary-button"
          disabled={busy}
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="primary-button"
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
