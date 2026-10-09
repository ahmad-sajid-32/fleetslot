import { ApiProperty } from '@nestjs/swagger';
import { CreateBookingDto } from '../bookings/create-booking.dto.js';
import type { Booking } from '../bookings/booking.entity.js';
import type { Vehicle } from '../vehicles/vehicle.entity.js';
import {
  DATE_PROPERTY,
  DURATION_PROPERTY,
  ID_PROPERTY,
  START_TIME_PROPERTY,
} from './api-properties.js';

export class VehicleResponseDto implements Vehicle {
  @ApiProperty(ID_PROPERTY) id: string;
  @ApiProperty({ example: 'Tesla' }) make: string;
  @ApiProperty({ example: 'Model 3' }) model: string;
  @ApiProperty({ type: 'integer', example: 2025 }) year: number;
  @ApiProperty({ example: 'DEMO-101' }) plateNumber: string;
  @ApiProperty({
    example: true,
    description: 'Inactive vehicles remain readable but cannot be scheduled.',
  })
  active: boolean;
}

export class BookingResponseDto extends CreateBookingDto implements Booking {
  @ApiProperty({
    ...ID_PROPERTY,
    example: 'booking_1',
    readOnly: true,
    description: 'Seed IDs are stable strings; new bookings receive UUIDs.',
  })
  id: string;
  @ApiProperty({
    format: 'date-time',
    example: '2026-10-09T08:00:00.000Z',
    readOnly: true,
  })
  createdAt: string;
  @ApiProperty({
    format: 'date-time',
    example: '2026-10-09T08:00:00.000Z',
    readOnly: true,
  })
  updatedAt: string;
}

export class TimeWindowDto {
  @ApiProperty(START_TIME_PROPERTY) startTime: string;
  @ApiProperty({
    type: String,
    pattern: START_TIME_PROPERTY.pattern,
    example: '11:00',
    description:
      'Derived local end time. Never submitted or persisted as a booking field.',
  })
  endTime: string;
}

export class AvailabilitySlotDto extends TimeWindowDto {
  @ApiProperty({
    example: true,
    description:
      'False windows remain in the response so occupied times can be displayed.',
  })
  available: boolean;
}

export class AvailabilityResponseDto {
  @ApiProperty(ID_PROPERTY) vehicleId: string;
  @ApiProperty(DATE_PROPERTY) date: string;
  @ApiProperty(DURATION_PROPERTY) durationMinutes: number;
  @ApiProperty({
    type: [AvailabilitySlotDto],
    description:
      'Generated windows in ascending start order, entirely within working hours.',
  })
  slots: AvailabilitySlotDto[];
}
