import { IsString, Matches, IsEnum, ValidateIf } from 'class-validator';
import { BookingType } from './booking.entity.js';
export class BookingQueryDto {
  @ValidateIf((_, v) => v !== undefined)
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date?: string;
  @ValidateIf((_, v) => v !== undefined)
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]{1,80}$/)
  vehicleId?: string;
  @ValidateIf((_, v) => v !== undefined)
  @IsEnum(BookingType)
  type?: BookingType;
}
