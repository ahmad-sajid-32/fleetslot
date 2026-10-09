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
      <div className="empty-state">
        <span aria-hidden="true">▤</span>
        <h2>No operations scheduled for this date.</h2>
        <p>Choose another date or schedule your next vehicle operation.</p>
      </div>
    );
  return (
    <div className="schedule-board">
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
