import { BookingStatus } from './BookingStatus';
import { Location } from './Location';
import { PaymentStatus } from './PaymentStatus';
import { Review } from './Review';
import { TimePeriod } from './TimePeriod';

export class Booking {
  id: number;
  carId: number;
  renterId: number;
  review?: Review;
  period: TimePeriod;
  pickUpLocation: Location;
  handOverLocation: Location;
  price: number;
  currency: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id = 0,
    carId = 0,
    renterId = 0,
    period = new TimePeriod(),
    pickUpLocation = new Location(),
    handOverLocation = new Location(),
    price = 0,
    currency = 'DKK',
    status = BookingStatus.Pending,
    paymentStatus = PaymentStatus.Pending,
    review?: Review,
    createdAt = new Date(),
    updatedAt = new Date(),
  ) {
    this.id = id;
    this.carId = carId;
    this.renterId = renterId;
    this.period = period;
    this.pickUpLocation = pickUpLocation;
    this.handOverLocation = handOverLocation;
    this.price = price;
    this.currency = currency;
    this.status = status;
    this.paymentStatus = paymentStatus;
    this.review = review;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}