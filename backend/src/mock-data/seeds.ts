import type { Vehicle } from '../vehicles/vehicle.entity.js';
import { BookingType, type Booking } from '../bookings/booking.entity.js';
import { localDate } from '../common/date.utils.js';
export const vehicles: Vehicle[] = [
  ['Tesla', 'Model 3', '101'],
  ['Jeep', 'Wrangler', '202'],
  ['Honda', 'Civic', '303'],
  ['Ford', 'Mustang', '404'],
].map(([make, model, plate], i) => ({
  id: `vehicle_${i + 1}`,
  make,
  model,
  year: 2025,
  plateNumber: `DEMO-${plate}`,
  active: i !== 3,
}));
export function seedBookings(): Booking[] {
  const now = new Date().toISOString();
  return [
    [
      1,
      1,
      '10:00',
      60,
      BookingType.CLEANING,
      'Interior refresh',
      'Prepare the demo vehicle for its next handoff.',
    ],
    [
      1,
      1,
      '13:00',
      30,
      BookingType.PICKUP_HANDOFF,
      'Afternoon pickup',
      'Meet at the fictional North lot.',
    ],
    [
      2,
      1,
      '09:30',
      30,
      BookingType.INSPECTION,
      'Return inspection',
      'Check condition and record mileage.',
    ],
    [
      3,
      1,
      '11:00',
      120,
      BookingType.MAINTENANCE,
      'Routine service',
      'Demo tire and fluid check.',
    ],
    [
      4,
      1,
      '14:00',
      60,
      BookingType.MAINTENANCE,
      'Workshop hold',
      'Existing operation; vehicle is inactive.',
    ],
    [
      1,
      2,
      '09:00',
      30,
      BookingType.RETURN_HANDOFF,
      'Morning return',
      'Receive keys at the demo lot.',
    ],
    [
      2,
      2,
      '10:00',
      60,
      BookingType.CLEANING,
      'Turnaround clean',
      'Prepare for the next demo trip.',
    ],
  ].map(([v, day, time, duration, type, title, description], i) => ({
    id: `booking_${i + 1}`,
    vehicleId: `vehicle_${v}`,
    date: localDate(Number(day)),
    startTime: String(time),
    durationMinutes: Number(duration),
    type: type as BookingType,
    title: String(title),
    description: String(description),
    createdAt: now,
    updatedAt: now,
  }));
}
