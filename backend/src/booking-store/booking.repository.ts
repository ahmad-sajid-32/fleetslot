import { Injectable } from '@nestjs/common';
import { seedBookings } from '../mock-data/seeds.js';
import type { Booking } from '../bookings/booking.entity.js';
@Injectable()
export class BookingRepository {
  private bookings = seedBookings();
  findAll() {
    return this.bookings;
  }
  findById(id: string) {
    return this.bookings.find((b) => b.id === id);
  }
  create(b: Booking) {
    this.bookings.push(b);
    return b;
  }
  update(id: string, b: Booking) {
    this.bookings[this.bookings.findIndex((x) => x.id === id)] = b;
    return b;
  }
  delete(id: string) {
    this.bookings = this.bookings.filter((b) => b.id !== id);
  }
}
