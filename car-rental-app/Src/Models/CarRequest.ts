import { CarRequestStatus } from './CarRequestStatus';
import { Renter } from './Renter';
import { TimePeriod } from './TimePeriod';

export class CarRequest {
  id: string;
  renter: Renter;
  budget: number;
  currency: string;
  period: TimePeriod;
  status: CarRequestStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id = '',
    renter = new Renter(),
    budget = 0,
    currency = 'DKK',
    period = new TimePeriod(),
    status = CarRequestStatus.Open,
    createdAt = new Date(),
    updatedAt = new Date(),
  ) {
    this.id = id;
    this.renter = renter;
    this.budget = budget;
    this.currency = currency;
    this.period = period;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
