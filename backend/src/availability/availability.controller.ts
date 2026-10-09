import { Controller, Get, Query } from '@nestjs/common';
import { AvailabilityService } from './availability.service.js';
import { AvailabilityQueryDto } from './availability-query.dto.js';
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly service: AvailabilityService) {}
  @Get() get(@Query() q: AvailabilityQueryDto) {
    return this.service.lookup(q);
  }
}
