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
export class AvailabilityQueryDto {
  @IsString() @Matches(/^[a-zA-Z0-9_-]{1,80}$/) vehicleId: string;
  @IsString() @Matches(/^\d{4}-\d{2}-\d{2}$/) date: string;
  @Type(() => Number)
  @IsInt()
  @Min(SCHEDULE.minDuration)
  @Max(SCHEDULE.maxDuration)
  @IsDivisibleBy(SCHEDULE.increment)
  durationMinutes: number;
  @ValidateIf((_, v) => v !== undefined)
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]{1,80}$/)
  excludeBookingId?: string;
}
