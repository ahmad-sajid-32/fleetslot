import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiExtraModels,
  getSchemaPath,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './create-booking.dto.js';
import { UpdateBookingDto } from './update-booking.dto.js';
import { BookingQueryDto } from './booking-query.dto.js';
import { BookingResponseDto } from '../common/api-responses.dto.js';
import { ApiErrors } from '../common/api-errors.js';
import { ID_PROPERTY } from '../common/api-properties.js';
import {
  BOOKING_EXAMPLE,
  CREATE_BOOKING_EXAMPLE,
  CREATED_BOOKING_EXAMPLE,
  UPDATED_BOOKING_EXAMPLE,
} from '../common/api-examples.js';
import { BookingType } from './booking.entity.js';

@ApiTags('Bookings')
@ApiExtraModels(CreateBookingDto, UpdateBookingDto)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly service: BookingsService) {}

  @Get()
  @ApiOperation({
    summary: 'List scheduled operations',
    description:
      'Optional filters are combined. Returns ascending date/start order, including existing bookings for inactive vehicles.',
  })
  @ApiOkResponse({
    type: [BookingResponseDto],
    description: 'Matching operations in date/start order.',
    examples: {
      schedule: {
        summary: 'A matching scheduled operation',
        value: [BOOKING_EXAMPLE],
      },
      empty: { summary: 'No operations match the filters', value: [] },
    },
  })
  @ApiErrors('VALIDATION_ERROR', 'VEHICLE_NOT_FOUND')
  list(@Query() q: BookingQueryDto) {
    return this.service.list(q);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one operation' })
  @ApiParam({ ...ID_PROPERTY, name: 'id', example: 'booking_1' })
  @ApiOkResponse({
    type: BookingResponseDto,
    description: 'The requested operation.',
    example: BOOKING_EXAMPLE,
  })
  @ApiErrors('BOOKING_NOT_FOUND')
  get(@Param('id') id: string) {
    return this.service.find(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Schedule an operation',
    description:
      'Prevents overlapping operations for the same vehicle and local date. Adjacent windows and simultaneous bookings on different vehicles are allowed. Unknown fields and null values are rejected.',
  })
  @ApiBody({
    required: true,
    schema: { $ref: getSchemaPath(CreateBookingDto) },
    examples: {
      cleaning: {
        summary: 'Schedule a 60-minute cleaning',
        value: CREATE_BOOKING_EXAMPLE,
      },
      inspection: {
        summary: 'Schedule a 30-minute inspection',
        value: {
          ...CREATE_BOOKING_EXAMPLE,
          title: 'Return inspection',
          type: BookingType.INSPECTION,
          durationMinutes: 30,
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: BookingResponseDto,
    description: 'Operation created with a generated ID and timestamps.',
    example: CREATED_BOOKING_EXAMPLE,
  })
  @ApiErrors(
    'VALIDATION_ERROR',
    'PAST_DATE',
    'INVALID_SLOT',
    'INVALID_DURATION',
    'OUTSIDE_WORKING_HOURS',
    'VEHICLE_NOT_FOUND',
    'VEHICLE_INACTIVE',
    'BOOKING_CONFLICT',
  )
  create(@Body() b: CreateBookingDto) {
    return this.service.create(b);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Edit or reschedule an operation',
    description:
      'All fields are optional. Submitted fields are merged with the stored booking, then the complete candidate is revalidated. The current booking is excluded from overlap detection. Omitted fields are preserved; explicit null values and unknown fields are rejected.',
  })
  @ApiParam({ ...ID_PROPERTY, name: 'id', example: 'booking_1' })
  @ApiBody({
    required: true,
    schema: { $ref: getSchemaPath(UpdateBookingDto) },
    examples: {
      reschedule: {
        summary: 'Move the existing operation; preserve other fields',
        value: { startTime: '11:00' },
      },
      rename: {
        summary: 'Change only the title',
        value: { title: 'Afternoon cleaning' },
      },
      clearNotes: {
        summary: 'Clear optional notes',
        value: { description: '' },
      },
    },
  })
  @ApiOkResponse({
    type: BookingResponseDto,
    description:
      'The complete operation after merging and validating the patch.',
    example: UPDATED_BOOKING_EXAMPLE,
  })
  @ApiErrors(
    'VALIDATION_ERROR',
    'PAST_DATE',
    'INVALID_SLOT',
    'INVALID_DURATION',
    'OUTSIDE_WORKING_HOURS',
    'VEHICLE_NOT_FOUND',
    'BOOKING_NOT_FOUND',
    'VEHICLE_INACTIVE',
    'BOOKING_CONFLICT',
  )
  update(@Param('id') id: string, @Body() b: UpdateBookingDto) {
    return this.service.update(id, b);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete an operation',
    description: 'Hard deletion. Successful responses have no body.',
  })
  @ApiParam({ ...ID_PROPERTY, name: 'id', example: 'booking_1' })
  @ApiNoContentResponse({
    description: 'Operation deleted; empty response body.',
  })
  @ApiErrors('BOOKING_NOT_FOUND')
  delete(@Param('id') id: string) {
    this.service.delete(id);
  }
}
