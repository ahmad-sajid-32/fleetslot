import { Controller, Get } from '@nestjs/common';
import { VehicleService } from './vehicles.service.js';
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly service: VehicleService) {}
  @Get() list() {
    return this.service.findAll();
  }
}
