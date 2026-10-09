"use client";
import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "@/lib/api";
import type { AvailabilitySlot } from "@/types";
export function useAvailability(
  vehicleId: string,
  date: string,
  durationMinutes: number,
  excludeBookingId?: string,
) {
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);
  const [state, setState] = useState<{
    key: string;
    slots: AvailabilitySlot[];
    loading: boolean;
    error: string;
  }>({ key: "", slots: [], loading: false, error: "" });
  const key = `${vehicleId}|${date}|${durationMinutes}|${excludeBookingId ?? ""}|${revision}`;
  useEffect(() => {
    const c = new AbortController();
    if (!vehicleId || !date) return;
    setState({ key, slots: [], loading: true, error: "" });
    api
      .getAvailability(
        { vehicleId, date, durationMinutes, excludeBookingId },
        c.signal,
      )
      .then((r) => {
        if (!c.signal.aborted)
          setState({ key, slots: r.slots, loading: false, error: "" });
      })
      .catch((e) => {
        if (!c.signal.aborted)
          setState({ key, slots: [], loading: false, error: errorMessage(e) });
      });
    return () => c.abort();
  }, [vehicleId, date, durationMinutes, excludeBookingId, key]);
  return state.key === key
    ? { ...state, refresh }
    : { slots: [], loading: !!vehicleId && !!date, error: "", refresh };
}
