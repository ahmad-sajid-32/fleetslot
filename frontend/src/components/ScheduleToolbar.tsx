import { FunnelSimpleIcon, XIcon } from "@phosphor-icons/react";
import { buttonStyles, fieldLabel, fieldControl } from "@/lib/styles";
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
      aria-label="Schedule filters"
      className="border-y border-border bg-background/70 px-6 py-4 max-sm:px-4"
    >
      <div className="grid grid-cols-[1fr_1.15fr_1.15fr] gap-4 max-sm:grid-cols-1 max-sm:gap-3">
        <label className={fieldLabel}>
          Date
          <input
            className={fieldControl}
            aria-label="Schedule date"
            type="date"
            min="0001-01-01"
            max="9999-12-31"
            value={filters.date}
            onChange={(e) => {
              if (e.target.value)
                onChange({ ...filters, date: e.target.value });
            }}
          />
        </label>
        <label className={fieldLabel}>
          Vehicle
          <select
            className={fieldControl}
            aria-label="Vehicle"
            value={filters.vehicleId}
            onChange={(e) =>
              onChange({ ...filters, vehicleId: e.target.value })
            }
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
            className={fieldControl}
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
      </div>
      {(filters.vehicleId || filters.type) && (
        <div className="mt-3 flex items-center justify-between text-xs text-brand">
          <span className="flex items-center gap-2">
            <FunnelSimpleIcon size={16} aria-hidden="true" />
            Filters applied
          </span>
          <button
            className={`${buttonStyles} inline-flex min-h-9 items-center gap-1 rounded-md px-2 font-medium enabled:hover:bg-selected`}
            onClick={() => onChange({ ...filters, vehicleId: "", type: "" })}
          >
            <XIcon size={14} aria-hidden="true" />
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
