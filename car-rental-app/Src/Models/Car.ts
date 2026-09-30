import { CarStatus } from './CarStatus';
import { Location } from './Location';

export class Car {
  id: number;
  ownerId: number;
  brand: string;
  model: string;
  year: number;
  status: CarStatus;
  dailyPrice: number;
  currency: string;
  location: Location;
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id = 0,
    ownerId = 0,
    brand = '',
    model = '',
    year = new Date().getFullYear(),
    status = CarStatus.Available,
    dailyPrice = 0,
    currency = 'DKK',
    location = new Location(),
    imageUrls: string[] = [],
    createdAt = new Date(),
    updatedAt = new Date(),
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.status = status;
    this.dailyPrice = dailyPrice;
    this.currency = currency;
    this.location = location;
    this.imageUrls = imageUrls;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
