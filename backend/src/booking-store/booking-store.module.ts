import { Module } from '@nestjs/common';
import { BookingRepository } from './booking.repository.js';
@Module({ providers: [BookingRepository], exports: [BookingRepository] })
export class BookingStoreModule {}
