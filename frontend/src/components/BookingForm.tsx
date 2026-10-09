"use client";
import {
  fieldLabel,
  fieldControl,
  primaryButton,
  secondaryButton,
} from "@/lib/styles";
import { useEffect, useRef, useState } from "react";
import { CheckIcon, ClockIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { AvailabilitySkeleton, Spinner } from "./LoadingStates";
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
  const submitting = useRef(false);
  const feedback = useRef<HTMLDivElement>(null);
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
  useEffect(() => {
    if (error || suggestions !== null) {
      feedback.current?.focus({ preventScroll: true });
      feedback.current?.scrollIntoView({ block: "nearest" });
    }
  }, [error, suggestions]);
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
    if (submitting.current) return;
    submitting.current = true;
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
      submitting.current = false;
      setBusy(false);
      onBusy(false);
    }
  }
  const selectable = availability.slots.some(
    (s) => s.available && s.startTime === input.startTime,
  );
  return (
    <form onSubmit={submit} aria-busy={busy} className="flex min-h-0 flex-col">
      <div
        className="min-h-0 overflow-y-auto overscroll-contain"
        onFocusCapture={(event) => {
          // Reveal the whole control, not only the browser's text caret.
          event.target.scrollIntoView({ block: "nearest", inline: "nearest" });
        }}
      >
        <fieldset className="min-w-0 p-6 max-sm:p-5" disabled={busy}>
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
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <ClockIcon size={17} className="text-brand" aria-hidden="true" />
              Choose a time window
            </h3>
            <span className="text-xs text-text-primary/65">
              09:00 – 17:00 · Local time
            </span>
          </div>
          {availability.loading ? (
            <AvailabilitySkeleton count={17 - input.durationMinutes / 30} />
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
              <span>
                Notes{" "}
                <span className="ml-1 font-normal text-text-primary/60">
                  (optional)
                </span>
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
          <div ref={feedback} tabIndex={-1} className="outline-none">
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
              <p
                role="alert"
                className="mt-4 flex items-start gap-2 rounded-lg bg-error/10 p-3 text-sm text-error"
              >
                <WarningCircleIcon
                  size={18}
                  className="shrink-0"
                  aria-hidden="true"
                />
                {error}
              </p>
            )}
          </div>
        </fieldset>
      </div>
      <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-border bg-surface px-6 py-4 max-sm:flex-wrap max-sm:px-5">
        <span className="mr-auto flex items-center gap-1.5 text-xs text-text-primary/70 max-sm:basis-full">
          {input.startTime && (
            <CheckIcon size={15} className="text-brand" aria-hidden="true" />
          )}
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
          {busy && <Spinner />}
          {busy ? "Saving…" : booking ? "Save changes" : "Schedule operation"}
        </button>
      </div>
      <span role="status" className="sr-only">
        {busy ? "Saving operation. Please wait." : ""}
      </span>
    </form>
  );
}
