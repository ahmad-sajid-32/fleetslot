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
  onEdit: (b: Booking) => void;
  onDelete: (id: string) => Promise<void>;
}) {
  return (
    <section aria-label={`${vehicleLabel(vehicle)} schedule`}>
      <div className="mb-3.5 flex items-center gap-3">
        <div
          className="grid size-10 shrink-0 place-items-center rounded-[9px] bg-icon-surface text-[30px] text-brand"
          aria-hidden="true"
        >
          ▱
        </div>
        <div>
          <h2 className="flex items-center gap-[9px] text-[15px] font-semibold max-sm:text-sm">
            {vehicleLabel(vehicle)}
            {!vehicle.active && (
              <span className="rounded border border-border px-1.5 py-0.5 text-[9px] tracking-[0.2px] text-text-secondary">
                Inactive
              </span>
            )}
          </h2>
          <span className="text-[10px] tracking-[0.6px] text-text-secondary">
            {vehicle.year} <span className="mx-[5px]">·</span>{" "}
            {vehicle.plateNumber}
          </span>
        </div>
        <span className="ml-auto text-[10px] text-text-secondary max-sm:text-[9px]">
          {bookings.length} operation{bookings.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {bookings.map((b) => (
          <BookingCard
            key={b.id}
            booking={b}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
