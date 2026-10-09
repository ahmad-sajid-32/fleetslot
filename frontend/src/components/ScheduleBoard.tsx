import { emptyPanel } from "@/lib/styles";
import { VehicleSchedule } from "./VehicleSchedule";
import type { Vehicle, Booking } from "@/types";
export function ScheduleBoard({
  vehicles,
  bookings,
  onEdit,
  onDelete,
}: {
  vehicles: Vehicle[];
  bookings: Booking[];
  onEdit: (b: Booking) => void;
  onDelete: (id: string) => Promise<void>;
}) {
  if (!bookings.length)
    return (
      <div className={emptyPanel}>
        <span className="mb-3 block text-[40px] text-brand" aria-hidden="true">
          ▤
        </span>
        <h2 className="mb-2 text-[17px] font-medium text-text-primary">
          No operations scheduled for this date.
        </h2>
        <p>Choose another date or schedule your next vehicle operation.</p>
      </div>
    );
  return (
    <div className="flex flex-col gap-7">
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
