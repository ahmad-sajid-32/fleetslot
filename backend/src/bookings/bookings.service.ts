import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { VehicleService } from '../vehicles/vehicles.service.js';
import { BookingRepository } from '../booking-store/booking.repository.js';
import { AvailabilityService } from '../availability/availability.service.js';
import { fail } from '../common/errors.js';
import { validDate } from '../common/date.utils.js';
import type { CreateBookingDto } from './create-booking.dto.js';
import type { UpdateBookingDto } from './update-booking.dto.js';
import type { BookingQueryDto } from './booking-query.dto.js';
@Injectable()
export class BookingsService {
  constructor(
    private readonly vehicles: VehicleService,
    private readonly availability: AvailabilityService,
    private readonly repository: BookingRepository,
  ) {}
  find(id: string) {
    return (
      this.repository.findById(id) ??
      fail(404, 'BOOKING_NOT_FOUND', 'Booking not found.')
    );
  }
  list(q: BookingQueryDto) {
    if (q.date && !validDate(q.date))
      fail(400, 'VALIDATION_ERROR', 'Use a valid local calendar date.');
    if (q.vehicleId) this.vehicles.find(q.vehicleId);
    return this.repository
      .findAll()
      .filter(
        (b) =>
          (!q.date || b.date === q.date) &&
          (!q.vehicleId || b.vehicleId === q.vehicleId) &&
          (!q.type || b.type === q.type),
      )
      .sort(
        (a, b) =>
          a.date.localeCompare(b.date) ||
          a.startTime.localeCompare(b.startTime),
      );
  }
  validate(b: CreateBookingDto, exclude?: string) {
    this.vehicles.active(b.vehicleId);
    this.availability.validate(b.date, b.durationMinutes, b.startTime);
    if (
      this.availability.conflict(
        b.vehicleId,
        b.date,
        b.startTime,
        b.durationMinutes,
        exclude,
      )
    )
      fail(
        409,
        'BOOKING_CONFLICT',
        'This vehicle is unavailable for the requested window.',
        {
          suggestions: this.availability.suggestions(
            { ...b, excludeBookingId: exclude },
            b.startTime,
          ),
        },
      );
  }
  create(b: CreateBookingDto) {
    this.validate(b);
    const now = new Date().toISOString();
    return this.repository.create({
      ...b,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    });
  }
  update(id: string, patch: UpdateBookingDto) {
    const b = { ...this.find(id), ...patch };
    this.validate(b, id);
    return this.repository.update(id, {
      ...b,
      updatedAt: new Date().toISOString(),
    });
  }
  delete(id: string) {
    this.find(id);
    this.repository.delete(id);
  }
}
