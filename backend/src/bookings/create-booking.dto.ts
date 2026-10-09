import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  Matches,
  IsInt,
  Min,
  Max,
  IsDivisibleBy,
  ValidateIf,
} from 'class-validator';
import { BookingType } from './booking.entity.js';
import { SCHEDULE } from '../common/booking.constants.js';
import {
  DATE_PROPERTY,
  DURATION_PROPERTY,
  ID_PROPERTY,
  START_TIME_PROPERTY,
} from '../common/api-properties.js';

export class CreateBookingDto {
  @ApiProperty({
    minLength: 1,
    maxLength: 120,
    example: 'Interior cleaning',
    description: 'Trimmed before validation; cannot be blank.',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @ApiPropertyOptional({
    maxLength: 1000,
    example: 'Prepare for the next handoff.',
    description:
      'Optional notes. On update, omit to preserve notes or send an empty string to clear them; null is not accepted.',
  })
  @ValidateIf((_, v) => v !== undefined)
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    enum: BookingType,
    enumName: 'BookingType',
    example: BookingType.CLEANING,
  })
  @IsEnum(BookingType)
  type: BookingType;

  @ApiProperty(DATE_PROPERTY)
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: string;

  @ApiProperty(START_TIME_PROPERTY)
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  startTime: string;

  @ApiProperty(DURATION_PROPERTY)
  @IsInt()
  @Min(SCHEDULE.minDuration)
  @Max(SCHEDULE.maxDuration)
  @IsDivisibleBy(SCHEDULE.increment)
  durationMinutes: number;

  @ApiProperty({
    ...ID_PROPERTY,
    description:
      'Vehicle ID. Creating or updating a booking requires an active vehicle.',
  })
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]{1,80}$/)
  vehicleId: string;
}
