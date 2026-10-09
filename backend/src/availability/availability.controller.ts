import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AvailabilityService } from './availability.service.js';
import { AvailabilityQueryDto } from './availability-query.dto.js';
import { AvailabilityResponseDto } from '../common/api-responses.dto.js';
import { ApiErrors } from '../common/api-errors.js';
import { AVAILABILITY_EXAMPLE } from '../common/api-examples.js';

@ApiTags('Availability')
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly service: AvailabilityService) {}
  @Get()
  @ApiOperation({
    summary: 'Generate availability windows',
    description:
      'Generates candidate starts every 30 minutes, fitting the requested duration within 09:00–17:00. Occupied windows remain visible with available=false. Availability is a snapshot, not a reservation; creating/updating a booking always checks conflicts again.',
  })
  @ApiOkResponse({
    type: AvailabilityResponseDto,
    description: 'All candidate windows, including occupied windows.',
    example: AVAILABILITY_EXAMPLE,
  })
  @ApiErrors(
    'VALIDATION_ERROR',
    'PAST_DATE',
    'INVALID_DURATION',
    'VEHICLE_NOT_FOUND',
    'BOOKING_NOT_FOUND',
    'VEHICLE_INACTIVE',
  )
  get(@Query() q: AvailabilityQueryDto) {
    return this.service.lookup(q);
  }
}
