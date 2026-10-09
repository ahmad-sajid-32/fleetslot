import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiProperty,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { SCHEDULE } from './booking.constants.js';
import { TimeWindowDto } from './api-responses.dto.js';

const ERROR_DETAILS = {
  VALIDATION_ERROR: {
    status: 400,
    message:
      'Invalid request fields. Check required values and supported formats.',
  },
  PAST_DATE: {
    status: 400,
    message: 'Bookings cannot be scheduled in the past.',
  },
  INVALID_SLOT: {
    status: 400,
    message: 'Choose a start time on the 30-minute grid.',
  },
  INVALID_DURATION: {
    status: 400,
    message: 'Duration must be 30–240 minutes in 30-minute increments.',
  },
  OUTSIDE_WORKING_HOURS: {
    status: 400,
    message: 'Operations must fit within 09:00–17:00.',
  },
  VEHICLE_NOT_FOUND: { status: 404, message: 'Vehicle not found.' },
  BOOKING_NOT_FOUND: { status: 404, message: 'Booking not found.' },
  VEHICLE_INACTIVE: {
    status: 409,
    message: 'Bookings cannot be scheduled for an inactive vehicle.',
  },
  BOOKING_CONFLICT: {
    status: 409,
    message: 'This vehicle is unavailable for the requested window.',
  },
} as const;
type ErrorCode = keyof typeof ERROR_DETAILS;

export class ApiErrorResponseDto {
  @ApiProperty({
    enum: Object.keys(ERROR_DETAILS).filter(
      (code) => code !== 'BOOKING_CONFLICT',
    ),
    example: 'VALIDATION_ERROR',
  })
  code: string;
  @ApiProperty({ example: ERROR_DETAILS.VALIDATION_ERROR.message })
  message: string;
}

export class BookingConflictResponseDto {
  @ApiProperty({ enum: ['BOOKING_CONFLICT'] }) code: 'BOOKING_CONFLICT';
  @ApiProperty({ example: ERROR_DETAILS.BOOKING_CONFLICT.message })
  message: string;
  @ApiProperty({
    type: [TimeWindowDto],
    maxItems: SCHEDULE.suggestionLimit,
    description:
      'Same vehicle, date, and duration. Later starts ascending, then earlier starts descending. May be empty when the day is fully booked.',
  })
  suggestions: TimeWindowDto[];
}

// Group error codes by HTTP status so both kinds of 409 remain documented.
export function ApiErrors(...codes: ErrorCode[]) {
  const statuses = [
    ...new Set(codes.map((code) => ERROR_DETAILS[code].status)),
  ];
  return applyDecorators(
    ApiExtraModels(ApiErrorResponseDto, BookingConflictResponseDto),
    ...statuses.map((status) => {
      const matches = codes.filter(
        (code) => ERROR_DETAILS[code].status === status,
      );
      const normalCodes = matches.filter((code) => code !== 'BOOKING_CONFLICT');
      const schemas = [];
      if (normalCodes.length)
        schemas.push({
          allOf: [
            { $ref: getSchemaPath(ApiErrorResponseDto) },
            {
              type: 'object',
              properties: { code: { type: 'string', enum: normalCodes } },
            },
          ],
        });
      if (matches.includes('BOOKING_CONFLICT'))
        schemas.push({ $ref: getSchemaPath(BookingConflictResponseDto) });
      return ApiResponse({
        status,
        description: matches.join(', '),
        content: {
          'application/json': {
            schema: schemas.length === 1 ? schemas[0] : { oneOf: schemas },
            examples: Object.fromEntries(
              matches.map((code) => [
                code,
                {
                  value: {
                    code,
                    message: ERROR_DETAILS[code].message,
                    ...(code === 'BOOKING_CONFLICT'
                      ? {
                          suggestions: [
                            { startTime: '11:00', endTime: '12:00' },
                            { startTime: '11:30', endTime: '12:30' },
                            { startTime: '12:00', endTime: '13:00' },
                          ],
                        }
                      : {}),
                  },
                },
              ]),
            ),
          },
        },
      });
    }),
  );
}
