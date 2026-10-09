import {
  CalendarBlankIcon,
  PlusIcon,
  FunnelSimpleXIcon,
} from "@phosphor-icons/react";
import { emptyPanel, primaryButton, secondaryButton } from "@/lib/styles";
import { VehicleSchedule } from "./VehicleSchedule";
import type { Vehicle, Booking } from "@/types";
export function ScheduleBoard({
  vehicles,
  bookings,
  onEdit,
  onDelete,
  onCreate,
  filtered,
  onReset,
}: {
  vehicles: Vehicle[];
  bookings: Booking[];
  onEdit: (b: Booking) => void;
  onDelete: (b: Booking) => void;
  onCreate: () => void;
  filtered: boolean;
  onReset: () => void;
}) {
  if (!bookings.length)
    return (
      <div className={emptyPanel}>
        <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-selected text-brand">
          <CalendarBlankIcon size={30} aria-hidden="true" />
        </div>
        <h2 className="mb-2 text-xl font-semibold tracking-tight text-text-primary">
          {filtered
            ? "No matching operations"
            : "A little room in the schedule."}
        </h2>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-text-primary/70">
          {filtered
            ? "Try another vehicle or operation type, or clear your filters to see the full day."
            : "No operations scheduled for this date. Add a handoff, inspection, or service to get things moving."}
        </p>
        <div className="mt-6">
          {filtered ? (
            <button className={secondaryButton} onClick={onReset}>
              <FunnelSimpleXIcon size={18} aria-hidden="true" />
              Clear filters
            </button>
          ) : (
            <button
              className={primaryButton}
              disabled={!vehicles.some((v) => v.active)}
              onClick={onCreate}
            >
              <PlusIcon size={18} aria-hidden="true" />
              Schedule an operation
            </button>
          )}
        </div>
      </div>
    );
  return (
    <div>
      {vehicles
        .filter((v) => bookings.some((b) => b.vehicleId === v.id))
        .map((v) => (
          <VehicleSchedule
            key={v.id}
            vehicle={v}
            bookings={bookings.filter((b) => b.vehicleId === v.id)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
    </div>
  );
}
