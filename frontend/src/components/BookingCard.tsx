import {
  ArrowBendDownLeftIcon,
  ArrowUpRightIcon,
  BroomIcon,
  ClipboardTextIcon,
  PencilSimpleIcon,
  TrashIcon,
  WrenchIcon,
} from "@phosphor-icons/react";
import { buttonStyles, iconButton } from "@/lib/styles";
import { TYPE_LABELS, endTime, type Booking, type BookingType } from "@/types";

const operationStyles = {
  PICKUP_HANDOFF: {
    border: "border-l-pickup",
    badge: "bg-pickup/9 text-pickup",
    Icon: ArrowUpRightIcon,
  },
  RETURN_HANDOFF: {
    border: "border-l-return",
    badge: "bg-return/9 text-return",
    Icon: ArrowBendDownLeftIcon,
  },
  INSPECTION: {
    border: "border-l-inspection",
    badge: "bg-inspection/9 text-inspection",
    Icon: ClipboardTextIcon,
  },
  CLEANING: {
    border: "border-l-cleaning",
    badge: "bg-cleaning/9 text-cleaning",
    Icon: BroomIcon,
  },
  MAINTENANCE: {
    border: "border-l-maintenance",
    badge: "bg-maintenance/9 text-maintenance",
    Icon: WrenchIcon,
  },
} satisfies Record<BookingType, object>;

export function BookingCard({
  booking,
  onEdit,
  onDelete,
}: {
  booking: Booking;
  onEdit: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
}) {
  const { border, badge, Icon } = operationStyles[booking.type];
  return (
    <article
      className={`group grid grid-cols-[5.5rem_minmax(0,1fr)_auto] items-center gap-5 rounded-xl border border-border border-l-[3px] bg-surface p-4 transition-colors hover:border-y-border-strong hover:border-r-border-strong motion-reduce:transition-none max-sm:grid-cols-[1fr_auto] max-sm:gap-3 ${border}`}
    >
      <div className="flex flex-col gap-1 tabular-nums max-sm:flex-row max-sm:flex-wrap max-sm:items-baseline max-sm:gap-2">
        <span className="text-lg font-semibold tracking-tight">
          {booking.startTime}
        </span>
        <span className="text-xs text-text-primary/65">
          to {endTime(booking)}
        </span>
        <span className="mt-1 text-[11px] text-text-primary/65 max-sm:mt-0 max-sm:basis-full">
          {booking.durationMinutes} min
        </span>
      </div>
      <div className="min-w-0 max-sm:col-span-2 max-sm:row-start-2">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold ${badge}`}
          >
            <Icon size={14} weight="bold" aria-hidden="true" />
            {TYPE_LABELS[booking.type]}
          </span>
        </div>
        <h3 className="text-sm font-semibold wrap-anywhere">{booking.title}</h3>
        <p className="mt-1 text-xs leading-relaxed whitespace-pre-wrap text-text-primary/65 wrap-anywhere">
          {booking.description || "No additional notes."}
        </p>
      </div>
      <div className="flex items-center gap-1 max-sm:col-start-2 max-sm:row-start-1">
        <button
          className={`${buttonStyles} inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-brand enabled:hover:bg-selected`}
          onClick={() => onEdit(booking)}
        >
          <PencilSimpleIcon size={17} aria-hidden="true" />
          Edit
        </button>
        <button
          className={`${iconButton} enabled:hover:bg-error/10 enabled:hover:text-error`}
          aria-label={`Delete ${booking.title}`}
          title="Delete operation"
          onClick={() => onDelete(booking)}
        >
          <TrashIcon size={18} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
