import { Injectable } from '@nestjs/common';
import { VehicleRepository } from './vehicle.repository.js';
import { fail } from '../common/errors.js';
@Injectable()
export class VehicleService {
  constructor(private readonly repository: VehicleRepository) {}
  findAll() {
    return this.repository.findAll();
  }
  find(id: string) {
    return (
      this.repository.findById(id) ??
      fail(404, 'VEHICLE_NOT_FOUND', 'Vehicle not found.')
    );
  }
  active(id: string) {
    const v = this.find(id);
    if (!v.active)
      fail(
        409,
        'VEHICLE_INACTIVE',
        'Bookings cannot be scheduled for an inactive vehicle.',
      );
    return v;
  }
}
