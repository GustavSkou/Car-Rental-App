import carsData from '../Data/cars.json';
import { Car, CarStatus, Location, Owner, UserRole } from '../Models';

type RawCar = (typeof carsData)[number];

export class CarService {
  getAllCars(): Car[] {
    return carsData.map((car) => this.toModel(car));
  }

  getAvailableCars(): Car[] {
    return this.getAllCars().filter((car) => car.status === CarStatus.Available);
  }

  getCarById(id: string): Car | undefined {
    return this.getAllCars().find((car) => car.id === id);
  }

  private toModel(car: RawCar): Car {
    return new Car(
      car.id,
      new Owner(
        car.owner.id,
        car.owner.firstName,
        car.owner.lastName,
        car.owner.email,
        car.owner.phoneNumber,
        car.owner.role as UserRole,
        car.owner.isVerified,
        new Date(car.owner.createdAt),
        new Date(car.owner.updatedAt),
      ),
      car.brand,
      car.model,
      car.year,
      car.status as CarStatus,
      car.dailyPrice,
      car.currency,
      new Location(
        car.location.country,
        car.location.city,
        car.location.postalCode,
        car.location.streetName,
        car.location.streetNumber,
        car.location.latitude,
        car.location.longitude,
        car.location.pickupInstructions,
      ),
      car.imageUrls,
      new Date(car.createdAt),
      new Date(car.updatedAt),
    );
  }
}
