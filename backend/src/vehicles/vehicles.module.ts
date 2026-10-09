import { Module } from '@nestjs/common';
import { VehicleRepository } from './vehicle.repository.js';
import { VehicleService } from './vehicles.service.js';
import { VehiclesController } from './vehicles.controller.js';
@Module({
  providers: [VehicleRepository, VehicleService],
  controllers: [VehiclesController],
  exports: [VehicleService],
})
export class VehicleModule {}
