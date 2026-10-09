import { Injectable } from '@nestjs/common';
import { VehicleService } from '../vehicles/vehicles.service.js';
import { BookingRepository } from '../booking-store/booking.repository.js';
import { SCHEDULE } from '../common/booking.constants.js';
import { localDate, validDate } from '../common/date.utils.js';
import { minutes, clock } from '../common/time.utils.js';
import { fail } from '../common/errors.js';
import type { AvailabilityQueryDto } from './availability-query.dto.js';
@Injectable()
export class AvailabilityService {
  constructor(
    private readonly vehicles: VehicleService,
    private readonly repository: BookingRepository,
  ) {}
  validate(date: string, duration: number, startTime?: string) {
    if (!validDate(date))
      fail(400, 'VALIDATION_ERROR', 'Use a valid local calendar date.');
    if (date < localDate())
      fail(400, 'PAST_DATE', 'Bookings cannot be scheduled in the past.');
    if (
      !Number.isInteger(duration) ||
      duration < SCHEDULE.minDuration ||
      duration > SCHEDULE.maxDuration ||
      duration % SCHEDULE.increment
    )
      fail(
        400,
        'INVALID_DURATION',
        'Duration must be 30–240 minutes in 30-minute increments.',
      );
    if (startTime !== undefined) {
      if (
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime) ||
        minutes(startTime) % SCHEDULE.interval
      )
        fail(400, 'INVALID_SLOT', 'Choose a start time on the 30-minute grid.');
      const s = minutes(startTime);
      if (s < SCHEDULE.start || s + duration > SCHEDULE.end)
        fail(
          400,
          'OUTSIDE_WORKING_HOURS',
          'Operations must fit within 09:00–17:00.',
        );
    }
  }
  conflict(
    vehicleId: string,
    date: string,
    startTime: string,
    duration: number,
    exclude?: string,
  ) {
    const start = minutes(startTime);
    return this.repository
      .findAll()
      .some(
        (b) =>
          b.id !== exclude &&
          b.vehicleId === vehicleId &&
          b.date === date &&
          start < minutes(b.startTime) + b.durationMinutes &&
          start + duration > minutes(b.startTime),
      );
  }
  lookup(q: AvailabilityQueryDto) {
    this.vehicles.active(q.vehicleId);
    this.validate(q.date, q.durationMinutes);
    if (q.excludeBookingId && !this.repository.findById(q.excludeBookingId))
      fail(404, 'BOOKING_NOT_FOUND', 'Booking not found.');
    const slots = [];
    for (
      let s = SCHEDULE.start;
      s + q.durationMinutes <= SCHEDULE.end;
      s += SCHEDULE.interval
    )
      slots.push({
        startTime: clock(s),
        endTime: clock(s + q.durationMinutes),
        available: !this.conflict(
          q.vehicleId,
          q.date,
          clock(s),
          q.durationMinutes,
          q.excludeBookingId,
        ),
      });
    return {
      vehicleId: q.vehicleId,
      date: q.date,
      durationMinutes: q.durationMinutes,
      slots,
    };
  }
  suggestions(q: AvailabilityQueryDto, start: string) {
    return this.lookup(q)
      .slots.filter((s) => s.available && s.startTime !== start)
      .sort((a, b) => {
        const af = a.startTime > start,
          bf = b.startTime > start;
        return af !== bf
          ? af
            ? -1
            : 1
          : af
            ? a.startTime.localeCompare(b.startTime)
            : b.startTime.localeCompare(a.startTime);
      })
      .slice(0, SCHEDULE.suggestionLimit)
      .map(({ startTime, endTime }) => ({ startTime, endTime }));
  }
}
