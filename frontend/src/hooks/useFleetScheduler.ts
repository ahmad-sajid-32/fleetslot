"use client";
import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "@/lib/api";
import { localDate } from "@/lib/date";
import type { Booking, Vehicle, Filters, CreateBookingInput } from "@/types";
export function useFleetScheduler() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]),
    [bookings, setBookings] = useState<Booking[]>([]);
  const [filters, setFilters] = useState<Filters>({
    date: "",
    vehicleId: "",
    type: "",
  });
  const [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [revision, setRevision] = useState(0),
    [notice, setNotice] = useState("");
  const refresh = useCallback(() => setRevision((n) => n + 1), []);
  // Resolve the operator date after hydration, never at static build time.
  useEffect(() => {
    setFilters((current) => ({ ...current, date: localDate(1) }));
  }, []);
  useEffect(() => {
    if (!filters.date) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    Promise.all([
      api.getVehicles(controller.signal),
      api.getBookings(filters, controller.signal),
    ])
      .then(([v, b]) => {
        if (controller.signal.aborted) return;
        setVehicles(v);
        setBookings(b);
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(errorMessage(e));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [filters, revision]);
  async function save(input: CreateBookingInput, id?: string) {
    if (id) await api.updateBooking(id, input);
    else await api.createBooking(input);
    setNotice(id ? "Operation updated." : "Operation scheduled.");
    refresh();
  }
  async function remove(id: string) {
    await api.deleteBooking(id);
    setNotice("Operation deleted.");
    refresh();
  }
  return {
    vehicles,
    bookings,
    filters,
    setFilters,
    loading,
    error,
    refresh,
    save,
    remove,
    notice,
    setNotice,
  };
}
