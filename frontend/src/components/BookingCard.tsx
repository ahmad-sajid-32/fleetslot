import { useState } from "react";
import { TYPE_LABELS, endTime, type Booking } from "@/types";
import { errorMessage } from "@/lib/api";
export function BookingCard({
  booking,
  onEdit,
  onDelete,
}: {
  booking: Booking;
  onEdit: (b: Booking) => void;
  onDelete: (id: string) => Promise<void>;
}) {
  const [confirm, setConfirm] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function remove() {
    setBusy(true);
    setError("");
    try {
      await onDelete(booking.id);
    } catch (e) {
      setError(errorMessage(e));
      setBusy(false);
    }
  }
  return (
    <article className={`booking-card type-${booking.type.toLowerCase()}`}>
      <div className="card-top">
        <span className="time-range">
          {booking.startTime}
          <span>—</span>
          {endTime(booking)}
        </span>
        <span className="duration">{booking.durationMinutes} min</span>
      </div>
      <span className="type-tag">{TYPE_LABELS[booking.type]}</span>
      <h3>{booking.title}</h3>
      <p>{booking.description || "No additional notes."}</p>
      <div className="card-actions">
        {confirm ? (
          <>
            <span>Delete operation?</span>
            <button className="danger-text" onClick={remove} disabled={busy}>
              {busy ? "Deleting…" : "Confirm delete"}
            </button>
            <button onClick={() => setConfirm(false)} disabled={busy}>
              Keep
            </button>
          </>
        ) : (
          <>
            <button onClick={() => onEdit(booking)}>Edit</button>
            <button className="delete-action" onClick={() => setConfirm(true)}>
              Delete
            </button>
          </>
        )}
      </div>
      {error && (
        <p role="alert" className="error-text">
          {error}
        </p>
      )}
    </article>
  );
}
