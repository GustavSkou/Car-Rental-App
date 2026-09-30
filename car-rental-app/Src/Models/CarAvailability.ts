import { CarStatus } from './CarStatus';

export class CarAvailability {
  status: CarStatus;

  constructor(status = CarStatus.Available) {
    this.status = status;
  }
}
