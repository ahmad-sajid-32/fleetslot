import { fieldLabel, fieldControl } from "@/lib/styles";
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
    <section
      className="grid grid-cols-[1fr_1.15fr_1.15fr_auto] gap-[18px] rounded-panel border border-border bg-toolbar p-[22px] max-lg:grid-cols-3 max-sm:grid-cols-1 max-sm:gap-3 max-sm:p-4"
      aria-label="Schedule filters"
    >
      <label className={fieldLabel}>
        Date
        <input
          className={fieldControl}
          aria-label="Schedule date"
          type="date"
          value={filters.date}
          onChange={(e) => {
            if (e.target.value) onChange({ ...filters, date: e.target.value });
          }}
        />
      </label>
      <label className={fieldLabel}>
        Vehicle
        <select
          className={`${fieldControl} pr-7`}
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
      <label className={fieldLabel}>
        Operation type
        <select
          className={`${fieldControl} pr-7`}
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
      <div className="ml-3 flex items-center gap-3 self-center border-l border-border-strong pl-7 text-[11px] text-text-secondary max-lg:hidden">
        <span className="text-[23px]">◷</span>
        <div>
          Working hours
          <strong className="mt-0.5 block text-[13px] font-medium text-text-primary">
            09:00 – 17:00
          </strong>
        </div>
      </div>
    </section>
  );
}
