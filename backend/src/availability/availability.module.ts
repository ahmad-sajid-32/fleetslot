import { Module } from '@nestjs/common';
import { VehicleModule } from '../vehicles/vehicles.module.js';
import { BookingStoreModule } from '../booking-store/booking-store.module.js';
import { AvailabilityService } from './availability.service.js';
import { AvailabilityController } from './availability.controller.js';
@Module({
  imports: [VehicleModule, BookingStoreModule],
  providers: [AvailabilityService],
  controllers: [AvailabilityController],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
