import type { Filters, Vehicle } from "@/types";
import { BOOKING_TYPES, TYPE_LABELS, vehicleLabel } from "@/types";
export function ScheduleToolbar({
  filters,
  onChange,
  vehicles,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  vehicles: Vehicle[];
}) {
  return (
    <section className="toolbar" aria-label="Schedule filters">
      <label>
        Date
        <input
          aria-label="Schedule date"
          type="date"
          value={filters.date}
          onChange={(e) => {
            if (e.target.value) onChange({ ...filters, date: e.target.value });
          }}
        />
      </label>
      <label>
        Vehicle
        <select
          aria-label="Vehicle"
          value={filters.vehicleId}
          onChange={(e) => onChange({ ...filters, vehicleId: e.target.value })}
        >
          <option value="">All vehicles</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {vehicleLabel(v)}
              {!v.active ? " · Inactive" : ""}
            </option>
          ))}
        </select>
      </label>
      <label>
        Operation type
        <select
          aria-label="Operation type"
          value={filters.type}
          onChange={(e) => onChange({ ...filters, type: e.target.value })}
        >
          <option value="">All operations</option>
          {BOOKING_TYPES.map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </label>
      <div className="working-hours">
        <span>◷</span>
        <div>
          Working hours<strong>09:00 – 17:00</strong>
        </div>
      </div>
    </section>
  );
}
