import { CarRequestStatus } from './CarRequestStatus';
import { TimePeriod } from './TimePeriod';

export class CarRequest {
  id: number;
  renterId: number;
  budget: number;
  currency: string;
  period: TimePeriod;
  status: CarRequestStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id = 0,
    renterId = 0,
    budget = 0,
    currency = 'DKK',
    period = new TimePeriod(),
    status = CarRequestStatus.Open,
    createdAt = new Date(),
    updatedAt = new Date(),
  ) {
    this.id = id;
    this.renterId = renterId;
    this.budget = budget;
    this.currency = currency;
    this.period = period;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
