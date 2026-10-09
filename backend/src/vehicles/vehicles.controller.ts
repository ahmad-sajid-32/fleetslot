import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { VehicleService } from './vehicles.service.js';
import { VehicleResponseDto } from '../common/api-responses.dto.js';
import { VEHICLES_EXAMPLE } from '../common/api-examples.js';

@ApiTags('Vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly service: VehicleService) {}
  @Get()
  @ApiOperation({
    summary: 'List fleet vehicles',
    description:
      'Includes inactive vehicles for existing schedule context. Vehicle display labels are derived from make, model, and plateNumber.',
  })
  @ApiOkResponse({
    type: [VehicleResponseDto],
    description: 'The complete fictional fleet, including inactive vehicles.',
    example: VEHICLES_EXAMPLE,
  })
  list() {
    return this.service.findAll();
  }
}
