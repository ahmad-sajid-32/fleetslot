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
import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './create-booking.dto.js';
import { UpdateBookingDto } from './update-booking.dto.js';
import { BookingQueryDto } from './booking-query.dto.js';
@Controller('bookings')
export class BookingsController {
  constructor(private readonly service: BookingsService) {}
  @Get() list(@Query() q: BookingQueryDto) {
    return this.service.list(q);
  }
  @Get(':id') get(@Param('id') id: string) {
    return this.service.find(id);
  }
  @Post() create(@Body() b: CreateBookingDto) {
    return this.service.create(b);
  }
  @Patch(':id') update(@Param('id') id: string, @Body() b: UpdateBookingDto) {
    return this.service.update(id, b);
  }
  @Delete(':id') @HttpCode(204) delete(@Param('id') id: string) {
    this.service.delete(id);
  }
}
