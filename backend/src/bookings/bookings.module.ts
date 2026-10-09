import { Module } from '@nestjs/common';
import { VehicleModule } from '../vehicles/vehicles.module.js';
import { BookingStoreModule } from '../booking-store/booking-store.module.js';
import { AvailabilityModule } from '../availability/availability.module.js';
import { BookingsService } from './bookings.service.js';
import { BookingsController } from './bookings.controller.js';
@Module({
  imports: [VehicleModule, BookingStoreModule, AvailabilityModule],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}
