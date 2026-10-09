import type {
  Vehicle,
  Booking,
  CreateBookingInput,
  UpdateBookingInput,
  AvailabilityResponse,
  ApiErrorShape,
  Filters,
} from "@/types";
export class ApiError extends Error {
  code: string;
  suggestions: ApiErrorShape["suggestions"];
  constructor(error: ApiErrorShape) {
    super(error.message);
    this.name = "ApiError";
    this.code = error.code;
    this.suggestions = error.suggestions;
  }
}
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    throw new ApiError({
      code: "NETWORK_ERROR",
      message: "Unable to reach the scheduler. Please try again.",
    });
  }
  if (!response.ok) {
    let error: ApiErrorShape = {
      code: "REQUEST_ERROR",
      message: "The request could not be completed. Please try again.",
    };
    try {
      const body = await response.json();
      if (typeof body.message === "string" && typeof body.code === "string")
        error = body;
    } catch {}
    throw new ApiError(error);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}
function query(values: object) {
  return new URLSearchParams(
    Object.entries(values)
      .filter(([, v]) => v !== "" && v !== undefined)
      .map(([k, v]) => [k, String(v)]),
  ).toString();
}
export const api = {
  getVehicles: (signal?: AbortSignal) =>
    request<Vehicle[]>("/vehicles", { signal }),
  getBookings: (filters: Filters, signal?: AbortSignal) =>
    request<Booking[]>(`/bookings?${query(filters)}`, { signal }),
  getBooking: (id: string) =>
    request<Booking>(`/bookings/${encodeURIComponent(id)}`),
  getAvailability: (
    params: {
      vehicleId: string;
      date: string;
      durationMinutes: number;
      excludeBookingId?: string;
    },
    signal?: AbortSignal,
  ) =>
    request<AvailabilityResponse>(`/availability?${query(params)}`, { signal }),
  createBooking: (b: CreateBookingInput) =>
    request<Booking>("/bookings", { method: "POST", body: JSON.stringify(b) }),
  updateBooking: (id: string, b: UpdateBookingInput) =>
    request<Booking>(`/bookings/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(b),
    }),
  deleteBooking: (id: string) =>
    request<void>(`/bookings/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
export const errorMessage = (error: unknown) =>
  error instanceof ApiError
    ? error.message
    : "Something went wrong. Please try again.";
