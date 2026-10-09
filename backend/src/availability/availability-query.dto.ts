import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  Matches,
  IsInt,
  Min,
  Max,
  IsDivisibleBy,
  ValidateIf,
} from 'class-validator';
import { SCHEDULE } from '../common/booking.constants.js';
import {
  DATE_PROPERTY,
  DURATION_PROPERTY,
  ID_PROPERTY,
} from '../common/api-properties.js';

export class AvailabilityQueryDto {
  @ApiProperty({ ...ID_PROPERTY, description: 'An existing active vehicle.' })
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]{1,80}$/)
  vehicleId: string;

  @ApiProperty(DATE_PROPERTY)
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: string;

  @ApiProperty(DURATION_PROPERTY)
  @Type(() => Number)
  @IsInt()
  @Min(SCHEDULE.minDuration)
  @Max(SCHEDULE.maxDuration)
  @IsDivisibleBy(SCHEDULE.increment)
  durationMinutes: number;

  @ApiPropertyOptional({
    ...ID_PROPERTY,
    example: 'booking_1',
    description:
      'Existing booking to exclude when editing, so its current window stays available.',
  })
  @ValidateIf((_, v) => v !== undefined)
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]{1,80}$/)
  excludeBookingId?: string;
}
