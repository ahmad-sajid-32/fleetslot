"use client";
import {
  buttonStyles,
  primaryButton,
  secondaryButton,
  eyebrow,
  statusDot,
  emptyPanel,
} from "@/lib/styles";
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
      <main className="mx-auto max-w-workspace pt-11 pb-6 max-xl:mx-8 max-sm:mx-0 max-sm:px-5 max-sm:pt-7 max-sm:pb-5">
        <div className="mb-[30px] flex items-center justify-between gap-6 max-sm:flex-col max-sm:items-start max-sm:gap-[18px]">
          <div>
            <span className={eyebrow}>YOUR FLEET, IN SYNC</span>
            <h1 className="mt-[7px] mb-2 text-[38px] leading-[1.2] font-semibold tracking-[-1.5px] max-sm:text-[32px]">
              Fleet Operations<span className="text-brand">.</span>
            </h1>
            <p className="text-sm leading-normal text-text-secondary max-sm:text-xs">
              Coordinate handoffs, turnaround work, and everything in between.
            </p>
          </div>
          <button
            className={`${primaryButton} max-sm:w-full`}
            onClick={() => setDialog({})}
            disabled={!fleet.vehicles.length}
          >
            <span aria-hidden="true" className="text-[21px] leading-none">
              ＋
            </span>{" "}
            Schedule Operation
          </button>
        </div>
        <div className="mb-6 grid grid-cols-[1fr_1fr_1fr_auto] gap-6 rounded-panel border border-border bg-surface p-6 shadow-card max-xl:gap-4 max-lg:grid-cols-3 max-sm:gap-2 max-sm:px-2.5 max-sm:py-4">
          <div className="flex items-center gap-3.5 border-border not-first:border-l not-first:pl-6 max-xl:not-first:pl-4 max-sm:gap-[5px] max-sm:not-first:pl-2">
            <span className="grid size-[39px] shrink-0 place-items-center rounded-[10px] bg-background text-[23px] text-brand max-sm:hidden">
              ▤
            </span>
            <div>
              <strong className="block text-2xl leading-[1.2] font-semibold tracking-[-0.7px] max-sm:text-[22px]">
                {fleet.loading ? "—" : fleet.bookings.length}
              </strong>
              <span className="mt-[5px] block text-[11px] text-text-secondary max-sm:text-[9px]">
                Scheduled operations
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3.5 border-border not-first:border-l not-first:pl-6 max-xl:not-first:pl-4 max-sm:gap-[5px] max-sm:not-first:pl-2">
            <span className="grid size-[39px] shrink-0 place-items-center rounded-[10px] bg-background text-[23px] text-brand max-sm:hidden">
              ▱
            </span>
            <div>
              <strong className="block text-2xl leading-[1.2] font-semibold tracking-[-0.7px] max-sm:text-[22px]">
                {fleet.loading
                  ? "—"
                  : new Set(fleet.bookings.map((b) => b.vehicleId)).size}
              </strong>
              <span className="mt-[5px] block text-[11px] text-text-secondary max-sm:text-[9px]">
                Vehicles on the board
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3.5 border-border not-first:border-l not-first:pl-6 max-xl:not-first:pl-4 max-sm:gap-[5px] max-sm:not-first:pl-2">
            <span className="grid size-[39px] shrink-0 place-items-center rounded-[10px] bg-background text-[23px] text-brand max-sm:hidden">
              ◷
            </span>
            <div>
              <strong className="block text-2xl leading-[1.2] font-semibold tracking-[-0.7px] max-sm:text-[22px]">
                {fleet.loading
                  ? "—"
                  : `${(totalMinutes / 60).toLocaleString("en-US", { maximumFractionDigits: 1 })} hrs`}
              </strong>
              <span className="mt-[5px] block text-[11px] text-text-secondary max-sm:text-[9px]">
                Planned operation time
              </span>
            </div>
          </div>
          <div className="flex items-center gap-[7px] border-l border-border pl-6 text-[11px] text-text-secondary max-xl:pl-4 max-lg:hidden">
            <span className={statusDot} /> No overlapping operations
          </div>
        </div>
        <ScheduleToolbar
          filters={fleet.filters}
          onChange={fleet.setFilters}
          vehicles={fleet.vehicles}
        />
        <div className="mt-9 mb-6 flex items-center justify-between max-sm:mt-7 max-sm:mb-5 max-sm:flex-col max-sm:items-start max-sm:gap-[7px]">
          <div>
            <span className={eyebrow}>DAILY SCHEDULE</span>
            <h2 className="mt-1.5 text-[19px] font-medium tracking-[-0.4px] max-sm:text-[17px]">
              {fleet.filters.date
                ? dateLabel(fleet.filters.date)
                : "Loading schedule…"}
            </h2>
          </div>
          <span className="text-[11px] text-text-secondary">
            Local time · 30-minute intervals
          </span>
        </div>
        {fleet.notice && (
          <div
            className="mb-[18px] flex items-center justify-between rounded-lg border border-success-border bg-success-surface px-3.5 py-2.5 text-xs leading-normal text-brand"
            role="status"
          >
            {fleet.notice}
            <button
              className={`${buttonStyles} bg-transparent text-xl leading-normal`}
              aria-label="Dismiss notification"
              onClick={() => fleet.setNotice("")}
            >
              ×
            </button>
          </div>
        )}
        {fleet.loading ? (
          <div
            className={`${emptyPanel} flex items-center justify-center gap-3`}
            role="status"
          >
            <span className="size-[17px] shrink-0 animate-spin rounded-full border-2 border-border border-t-brand [animation-duration:800ms] motion-reduce:animate-none" />
            Loading your fleet schedule…
          </div>
        ) : fleet.error ? (
          <div className={emptyPanel} role="alert">
            <p>{fleet.error}</p>
            <button
              className={`${secondaryButton} mt-3.5`}
              onClick={fleet.refresh}
            >
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
        <footer className="mt-12 flex justify-between gap-4 border-t border-border pt-[18px] text-[10px] text-text-secondary max-sm:flex-col max-sm:gap-[7px]">
          <span>
            FleetSlot <span className="mx-[7px] text-muted-divider"> / </span>{" "}
            Less downtime. More road time.
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
