import { CarProfileIcon } from "@phosphor-icons/react";
import { BookingCard } from "./BookingCard";
import { vehicleLabel, type Vehicle, type Booking } from "@/types";
export function VehicleSchedule({
  vehicle,
  bookings,
  onEdit,
  onDelete,
}: {
  vehicle: Vehicle;
  bookings: Booking[];
  onEdit: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
}) {
  return (
    <section
      aria-label={`${vehicleLabel(vehicle)} schedule`}
      className="grid grid-cols-[12rem_minmax(0,1fr)] gap-6 p-6 not-last:border-b not-last:border-border max-lg:grid-cols-1 max-lg:gap-4 max-sm:p-4"
    >
      <div className="flex items-start gap-3 pt-1 max-lg:items-center max-lg:pt-0">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-icon-surface text-brand">
          <CarProfileIcon size={23} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">{vehicleLabel(vehicle)}</h2>
          <p className="mt-1 text-[11px] tracking-wide text-text-primary/65">
            {vehicle.plateNumber} · {vehicle.year}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-text-primary/65">
            <span>
              {bookings.length} operation{bookings.length === 1 ? "" : "s"}
            </span>
            {!vehicle.active && (
              <span className="rounded bg-background px-1.5 py-0.5 font-medium">
                Inactive
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
