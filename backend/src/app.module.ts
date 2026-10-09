import { Module } from '@nestjs/common';
import { VehicleModule } from './vehicles/vehicles.module.js';
import { AvailabilityModule } from './availability/availability.module.js';
import { BookingsModule } from './bookings/bookings.module.js';
@Module({ imports: [VehicleModule, AvailabilityModule, BookingsModule] })
export class AppModule {}
