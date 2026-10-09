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
export class CreateBookingDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;
  @ValidateIf((_, v) => v !== undefined)
  @IsString()
  @MaxLength(1000)
  description?: string;
  @IsEnum(BookingType) type: BookingType;
  @IsString() @Matches(/^\d{4}-\d{2}-\d{2}$/) date: string;
  @IsString() @Matches(/^([01]\d|2[0-3]):[0-5]\d$/) startTime: string;
  @IsInt()
  @Min(SCHEDULE.minDuration)
  @Max(SCHEDULE.maxDuration)
  @IsDivisibleBy(SCHEDULE.increment)
  durationMinutes: number;
  @IsString() @Matches(/^[a-zA-Z0-9_-]{1,80}$/) vehicleId: string;
}
