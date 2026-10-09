import { BookingType, type Booking } from '../bookings/booking.entity.js';
import type { CreateBookingDto } from '../bookings/create-booking.dto.js';
import type { Vehicle } from '../vehicles/vehicle.entity.js';
import type { AvailabilityResponseDto } from './api-responses.dto.js';
import { SCHEDULE } from './booking.constants.js';
import { clock } from './time.utils.js';

// Fixed, fictional examples keep swagger.yaml deterministic. Replace dates when trying requests.
export const CREATE_BOOKING_EXAMPLE = {
  title: 'Interior cleaning',
  description: 'Prepare for the next handoff.',
  type: BookingType.CLEANING,
  date: '2026-10-10',
  startTime: '10:00',
  durationMinutes: 60,
  vehicleId: 'vehicle_1',
} satisfies CreateBookingDto;

export const BOOKING_EXAMPLE = {
  ...CREATE_BOOKING_EXAMPLE,
  id: 'booking_1',
  createdAt: '2026-10-09T08:00:00.000Z',
  updatedAt: '2026-10-09T08:00:00.000Z',
} satisfies Booking;

export const CREATED_BOOKING_EXAMPLE = {
  ...BOOKING_EXAMPLE,
  id: 'd6d6e4cd-7f42-4b8c-8a85-76fc7154315a',
} satisfies Booking;

export const UPDATED_BOOKING_EXAMPLE = {
  ...BOOKING_EXAMPLE,
  startTime: '11:00',
  updatedAt: '2026-10-09T08:30:00.000Z',
} satisfies Booking;

export const VEHICLES_EXAMPLE: Vehicle[] = [
  {
    id: 'vehicle_1',
    make: 'Tesla',
    model: 'Model 3',
    year: 2025,
    plateNumber: 'DEMO-101',
    active: true,
  },
  {
    id: 'vehicle_2',
    make: 'Jeep',
    model: 'Wrangler',
    year: 2025,
    plateNumber: 'DEMO-202',
    active: true,
  },
  {
    id: 'vehicle_3',
    make: 'Honda',
    model: 'Civic',
    year: 2025,
    plateNumber: 'DEMO-303',
    active: true,
  },
  {
    id: 'vehicle_4',
    make: 'Ford',
    model: 'Mustang',
    year: 2025,
    plateNumber: 'DEMO-404',
    active: false,
  },
];

// A complete 60-minute availability response for one existing 10:00–11:00 booking.
const exampleDuration = CREATE_BOOKING_EXAMPLE.durationMinutes;
export const AVAILABILITY_EXAMPLE: AvailabilityResponseDto = {
  vehicleId: 'vehicle_1',
  date: CREATE_BOOKING_EXAMPLE.date,
  durationMinutes: exampleDuration,
  slots: Array.from(
    {
      length:
        (SCHEDULE.end - SCHEDULE.start - exampleDuration) / SCHEDULE.interval +
        1,
    },
    (_, index) => {
      const start = SCHEDULE.start + index * SCHEDULE.interval;
      return {
        startTime: clock(start),
        endTime: clock(start + exampleDuration),
        available: start >= 11 * 60 || start + exampleDuration <= 10 * 60,
      };
    },
  ),
};
