"use client";
import {
  ArrowClockwiseIcon,
  CalendarDotsIcon,
  CarProfileIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ClockIcon,
  PlusIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import {
  buttonStyles,
  primaryButton,
  secondaryButton,
  iconButton,
  skeleton,
} from "@/lib/styles";
import { useFleetScheduler } from "@/hooks/useFleetScheduler";
import { dateLabel, localDate, shiftDate } from "@/lib/date";
import type { Booking } from "@/types";
import { Header } from "./Header";
import { ScheduleToolbar } from "./ScheduleToolbar";
import { ScheduleBoard } from "./ScheduleBoard";
import { BookingDialog } from "./BookingDialog";
import { DeleteBookingDialog } from "./DeleteBookingDialog";
import { ToastNotifications } from "./ToastNotifications";
import { ScheduleSkeleton, Spinner } from "./LoadingStates";

export function FleetScheduler() {
  const fleet = useFleetScheduler();
  const [dialog, setDialog] = useState<{ booking?: Booking } | null>(null);
  const [deleting, setDeleting] = useState<Booking | null>(null);
  const filtered = !!(fleet.filters.vehicleId || fleet.filters.type);
  const resetFilters = () =>
    fleet.setFilters({ ...fleet.filters, vehicleId: "", type: "" });
  const totalMinutes = fleet.bookings.reduce(
    (sum, b) => sum + b.durationMinutes,
    0,
  );
  const metrics = [
    {
      label: "Scheduled operations",
      value: fleet.bookings.length,
      Icon: CalendarDotsIcon,
    },
    {
      label: "Vehicles on the board",
      value: new Set(fleet.bookings.map((b) => b.vehicleId)).size,
      Icon: CarProfileIcon,
    },
    {
      label: "Planned operation time",
      value: `${(totalMinutes / 60).toLocaleString("en-US", { maximumFractionDigits: 1 })} hrs`,
      Icon: ClockIcon,
    },
  ];
  return (
    <div className="min-h-dvh">
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto max-w-workspace px-6 pt-10 pb-6 outline-none max-sm:px-4 max-sm:pt-7"
      >
        <div className="mb-8 flex items-end justify-between gap-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-5">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-medium text-brand">
              <span className="h-px w-5 bg-brand" aria-hidden="true" />
              Your fleet, in sync
            </p>
            <h1 className="text-4xl font-semibold tracking-[-0.045em] text-balance max-sm:text-3xl">
              Fleet operations<span className="text-brand">.</span>
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-text-primary/65">
              A clear view of every handoff, inspection, and service.
            </p>
          </div>
          <button
            id="schedule-operation"
            className={primaryButton}
            onClick={() => setDialog({})}
            disabled={!fleet.vehicles.some((v) => v.active)}
          >
            <PlusIcon size={18} weight="bold" aria-hidden="true" />
            Schedule operation
          </button>
        </div>
        <div className="mb-8 flex flex-wrap items-center gap-x-10 gap-y-5 border-y border-border py-5 max-sm:gap-x-5">
          {metrics.map(({ label, value, Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 max-sm:flex-1 max-sm:items-start"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-icon-surface text-brand max-sm:hidden">
                <Icon size={21} aria-hidden="true" />
              </span>
              <div>
                <div className="text-2xl leading-tight font-semibold tracking-tight tabular-nums">
                  {fleet.loading ? (
                    <span
                      aria-label="Loading"
                      className={`${skeleton} my-0.5 block h-6 w-12`}
                    />
                  ) : fleet.error ? (
                    <span aria-label="Unavailable">–</span>
                  ) : (
                    value
                  )}
                </div>
                <p className="mt-1 text-xs text-text-primary/65 max-sm:text-[11px]">
                  {label}
                </p>
              </div>
            </div>
          ))}
          <span className="ml-auto inline-flex items-center gap-2 text-xs text-brand max-lg:hidden">
            <ClockIcon size={17} aria-hidden="true" />
            Working hours{" "}
            <span className="font-semibold tabular-nums">09:00 – 17:00</span>
          </span>
        </div>
        <section
          id="schedule"
          aria-label="Daily schedule"
          className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-5 max-sm:px-4">
            <div>
              <p className="mb-1 text-xs font-medium text-text-primary/65">
                Daily schedule
              </p>
              <h2 className="text-xl font-semibold tracking-tight max-sm:text-lg">
                {fleet.filters.date
                  ? dateLabel(fleet.filters.date)
                  : "Preparing your schedule"}
              </h2>
            </div>
            <div className="flex items-center gap-1 max-sm:w-full">
              <button
                className={`${buttonStyles} min-h-11 rounded-lg px-3 text-sm font-medium enabled:hover:bg-background`}
                onClick={() =>
                  fleet.setFilters({ ...fleet.filters, date: localDate() })
                }
              >
                Today
              </button>
              <span className="mx-2 h-5 w-px bg-border" aria-hidden="true" />
              <button
                className={iconButton}
                disabled={
                  !fleet.filters.date || !shiftDate(fleet.filters.date, -1)
                }
                aria-label="Previous day"
                onClick={() =>
                  fleet.setFilters({
                    ...fleet.filters,
                    date: shiftDate(fleet.filters.date, -1),
                  })
                }
              >
                <CaretLeftIcon size={18} aria-hidden="true" />
              </button>
              <button
                className={iconButton}
                disabled={
                  !fleet.filters.date || !shiftDate(fleet.filters.date, 1)
                }
                aria-label="Next day"
                onClick={() =>
                  fleet.setFilters({
                    ...fleet.filters,
                    date: shiftDate(fleet.filters.date, 1),
                  })
                }
              >
                <CaretRightIcon size={18} aria-hidden="true" />
              </button>
              <span className="mx-2 h-5 w-px bg-border" aria-hidden="true" />
              <button
                className={iconButton}
                disabled={fleet.loading}
                onClick={fleet.refresh}
                aria-label="Refresh schedule"
                title="Refresh schedule"
              >
                {fleet.loading ? (
                  <Spinner className="size-[18px]" />
                ) : (
                  <ArrowClockwiseIcon size={18} aria-hidden="true" />
                )}
              </button>
              <span className="ml-auto hidden text-xs text-text-primary/65 max-sm:block">
                Local time
              </span>
            </div>
          </div>
          <ScheduleToolbar
            filters={fleet.filters}
            onChange={fleet.setFilters}
            vehicles={fleet.vehicles}
          />
          <div aria-busy={fleet.loading}>
            {fleet.loading ? (
              <ScheduleSkeleton />
            ) : fleet.error ? (
              <div role="alert" className="px-6 py-16 text-center">
                <WarningCircleIcon
                  size={32}
                  className="mx-auto mb-4 text-error"
                  aria-hidden="true"
                />
                <h3 className="text-lg font-semibold">
                  We couldn’t load your schedule
                </h3>
                <p className="mt-2 text-sm text-text-primary/70">
                  {fleet.error}
                </p>
                <button
                  className={`${secondaryButton} mt-5`}
                  onClick={fleet.refresh}
                >
                  <ArrowClockwiseIcon size={17} aria-hidden="true" />
                  Try again
                </button>
              </div>
            ) : (
              <ScheduleBoard
                vehicles={fleet.vehicles}
                bookings={fleet.bookings}
                onEdit={(booking) => setDialog({ booking })}
                onDelete={setDeleting}
                onCreate={() => setDialog({})}
                filtered={filtered}
                onReset={resetFilters}
              />
            )}
          </div>
          <div className="flex flex-wrap justify-between gap-2 border-t border-border bg-background/60 px-6 py-3 text-[11px] text-text-primary/65 max-sm:px-4">
            <span>All times are local · 30-minute intervals</span>
            <span>{filtered ? "Filtered view" : "Grouped by vehicle"}</span>
          </div>
        </section>
        <footer className="mt-6 flex flex-wrap justify-between gap-2 text-xs text-text-primary/60">
          <span>
            FleetSlot <span className="mx-2 text-muted-divider">/</span> Less
            downtime. More road time.
          </span>
          <span>Demo data · Changes reset on server restart</span>
        </footer>
      </main>
      <ToastNotifications
        toasts={fleet.toasts}
        onDismiss={fleet.dismissToast}
      />
      {dialog && (
        <BookingDialog
          booking={dialog.booking}
          vehicles={fleet.vehicles}
          date={fleet.filters.date}
          onSave={fleet.save}
          onClose={() => setDialog(null)}
        />
      )}
      {deleting && (
        <DeleteBookingDialog
          booking={deleting}
          vehicle={fleet.vehicles.find((v) => v.id === deleting.vehicleId)}
          onDelete={fleet.remove}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
