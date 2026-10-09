export enum BookingType {
  PICKUP_HANDOFF = 'PICKUP_HANDOFF',
  RETURN_HANDOFF = 'RETURN_HANDOFF',
  INSPECTION = 'INSPECTION',
  CLEANING = 'CLEANING',
  MAINTENANCE = 'MAINTENANCE',
}
export interface Booking {
  id: string;
  title: string;
  description?: string;
  type: BookingType;
  date: string;
  startTime: string;
  durationMinutes: number;
  vehicleId: string;
  createdAt: string;
  updatedAt: string;
}
