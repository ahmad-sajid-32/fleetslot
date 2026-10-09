"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, errorMessage } from "@/lib/api";
import type { ToastMessage } from "@/components/ToastNotifications";
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
    [revision, setRevision] = useState(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextToastId = useRef(0);
  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);
  function notify(message: string) {
    const toast = { id: ++nextToastId.current, message };
    setToasts((current) => [...current, toast]);
  }
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
    notify(id ? "Operation updated." : "Operation scheduled.");
    refresh();
  }
  async function remove(id: string) {
    await api.deleteBooking(id);
    notify("Operation deleted.");
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
    toasts,
    dismissToast,
  };
}
