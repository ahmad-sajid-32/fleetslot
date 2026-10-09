import { Injectable } from '@nestjs/common';
import { vehicles } from '../mock-data/seeds.js';
@Injectable()
export class VehicleRepository {
  findAll() {
    return vehicles;
  }
  findById(id: string) {
    return vehicles.find((v) => v.id === id);
  }
}
