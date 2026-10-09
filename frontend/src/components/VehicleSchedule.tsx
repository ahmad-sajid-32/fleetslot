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
    <section className="vehicle-section">
      <div className="vehicle-heading">
        <div className="vehicle-icon" aria-hidden="true">
          ▱
        </div>
        <div>
          <h2>
            {vehicleLabel(vehicle)}
            {!vehicle.active && (
              <span className="inactive-badge">Inactive</span>
            )}
          </h2>
          <span className="vehicle-detail">
            {vehicle.year} <span>·</span> {vehicle.plateNumber}
          </span>
        </div>
        <span className="operation-count">
          {bookings.length} operation{bookings.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="booking-grid">
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
