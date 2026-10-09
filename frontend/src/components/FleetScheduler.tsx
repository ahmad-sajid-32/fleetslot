"use client";
import { useState } from "react";
import { useFleetScheduler } from "@/hooks/useFleetScheduler";
import { dateLabel } from "@/lib/date";
import type { Booking } from "@/types";
import { Header } from "./Header";
import { ScheduleToolbar } from "./ScheduleToolbar";
import { ScheduleBoard } from "./ScheduleBoard";
import { BookingDialog } from "./BookingDialog";
export function FleetScheduler() {
  const fleet = useFleetScheduler(),
    [dialog, setDialog] = useState<{ booking?: Booking } | null>(null);
  const totalMinutes = fleet.bookings.reduce(
    (sum, b) => sum + b.durationMinutes,
    0,
  );
  return (
    <>
      <Header />
      <main className="workspace">
        <div className="page-heading">
          <div>
            <span className="eyebrow">YOUR FLEET, IN SYNC</span>
            <h1>
              Fleet Operations<span className="heading-dot">.</span>
            </h1>
            <p>
              Coordinate handoffs, turnaround work, and everything in between.
            </p>
          </div>
          <button
            className="primary-button schedule-button"
            onClick={() => setDialog({})}
            disabled={!fleet.vehicles.length}
          >
            <span aria-hidden="true">＋</span> Schedule Operation
          </button>
        </div>
        <div className="overview">
          <div>
            <span className="overview-icon">▤</span>
            <div>
              <strong>{fleet.loading ? "—" : fleet.bookings.length}</strong>
              <span>Scheduled operations</span>
            </div>
          </div>
          <div>
            <span className="overview-icon">▱</span>
            <div>
              <strong>
                {fleet.loading
                  ? "—"
                  : new Set(fleet.bookings.map((b) => b.vehicleId)).size}
              </strong>
              <span>Vehicles on the board</span>
            </div>
          </div>
          <div>
            <span className="overview-icon">◷</span>
            <div>
              <strong>
                {fleet.loading
                  ? "—"
                  : `${(totalMinutes / 60).toLocaleString("en-US", { maximumFractionDigits: 1 })} hrs`}
              </strong>
              <span>Planned operation time</span>
            </div>
          </div>
          <div className="overview-note">
            <span className="status-dot" /> No overlapping operations
          </div>
        </div>
        <ScheduleToolbar
          filters={fleet.filters}
          onChange={fleet.setFilters}
          vehicles={fleet.vehicles}
        />
        <div className="board-heading">
          <div>
            <span className="eyebrow">DAILY SCHEDULE</span>
            <h2>
              {fleet.filters.date
                ? dateLabel(fleet.filters.date)
                : "Loading schedule…"}
            </h2>
          </div>
          <span className="local-time">Local time · 30-minute intervals</span>
        </div>
        {fleet.notice && (
          <div className="notice" role="status">
            {fleet.notice}
            <button
              aria-label="Dismiss notification"
              onClick={() => fleet.setNotice("")}
            >
              ×
            </button>
          </div>
        )}
        {fleet.loading ? (
          <div className="loading-state" role="status">
            <span className="spinner" />
            Loading your fleet schedule…
          </div>
        ) : fleet.error ? (
          <div className="error-state" role="alert">
            <p>{fleet.error}</p>
            <button className="secondary-button" onClick={fleet.refresh}>
              Try again
            </button>
          </div>
        ) : (
          <ScheduleBoard
            vehicles={fleet.vehicles}
            bookings={fleet.bookings}
            onEdit={(booking) => setDialog({ booking })}
            onDelete={fleet.remove}
          />
        )}
        <footer className="workspace-footer">
          <span>
            FleetSlot <span> / </span> Less downtime. More road time.
          </span>
          <span>Fictional demo data · Changes reset on server restart</span>
        </footer>
      </main>
      {dialog && (
        <BookingDialog
          booking={dialog.booking}
          vehicles={fleet.vehicles}
          date={fleet.filters.date}
          onSave={fleet.save}
          onClose={() => setDialog(null)}
        />
      )}
    </>
  );
}
