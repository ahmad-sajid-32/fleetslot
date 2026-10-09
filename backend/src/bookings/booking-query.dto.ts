import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Matches, IsEnum, ValidateIf } from 'class-validator';
import { BookingType } from './booking.entity.js';
import { DATE_PROPERTY, ID_PROPERTY } from '../common/api-properties.js';

export class BookingQueryDto {
  @ApiPropertyOptional({
    ...DATE_PROPERTY,
    description:
      'Filter by local calendar date. Historical dates are allowed when listing bookings.',
  })
  @ValidateIf((_, v) => v !== undefined)
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date?: string;

  @ApiPropertyOptional({
    ...ID_PROPERTY,
    description: 'Filter by an existing vehicle, including inactive vehicles.',
  })
  @ValidateIf((_, v) => v !== undefined)
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]{1,80}$/)
  vehicleId?: string;

  @ApiPropertyOptional({ enum: BookingType, enumName: 'BookingType' })
  @ValidateIf((_, v) => v !== undefined)
  @IsEnum(BookingType)
  type?: BookingType;
}
