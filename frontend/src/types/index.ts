export const BOOKING_TYPES = [
  "PICKUP_HANDOFF",
  "RETURN_HANDOFF",
  "INSPECTION",
  "CLEANING",
  "MAINTENANCE",
] as const;
export type BookingType = (typeof BOOKING_TYPES)[number];
export const TYPE_LABELS: Record<BookingType, string> = {
  PICKUP_HANDOFF: "Pickup handoff",
  RETURN_HANDOFF: "Return handoff",
  INSPECTION: "Inspection",
  CLEANING: "Cleaning",
  MAINTENANCE: "Maintenance",
};
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  active: boolean;
}
export interface CreateBookingInput {
  title: string;
  description?: string;
  type: BookingType;
  date: string;
  startTime: string;
  durationMinutes: number;
  vehicleId: string;
}
export type UpdateBookingInput = Partial<CreateBookingInput>;
export interface Booking extends CreateBookingInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}
export interface AvailabilitySlot {
  startTime: string;
  endTime: string;
  available: boolean;
}
export interface AvailabilityResponse {
  vehicleId: string;
  date: string;
  durationMinutes: number;
  slots: AvailabilitySlot[];
}
export interface ApiErrorShape {
  code: string;
  message: string;
  suggestions?: Pick<AvailabilitySlot, "startTime" | "endTime">[];
}
export interface ConflictResponse extends ApiErrorShape {
  code: "BOOKING_CONFLICT";
  suggestions: Pick<AvailabilitySlot, "startTime" | "endTime">[];
}
export interface Filters {
  date: string;
  vehicleId: string;
  type: string;
}
export const vehicleLabel = (v: Vehicle) => `${v.make} ${v.model}`;
export function endTime(b: CreateBookingInput) {
  const [h, m] = b.startTime.split(":").map(Number);
  const total = h * 60 + m + b.durationMinutes;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
