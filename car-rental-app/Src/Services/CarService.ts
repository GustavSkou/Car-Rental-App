import carsData from '../Data/cars.json';
import { Car, CarStatus, Location } from '../Models';

type RawCar = (typeof carsData)[number];

export class CarService {
  getAllCars(): Car[] {
    return carsData.map((car) => this.toModel(car));
  }

  getAvailableCars(): Car[] {
    return this.getAllCars().filter((car) => car.status === CarStatus.Available);
  }

  getCarById(id: number): Car | undefined {
    return this.getAllCars().find((car) => car.id === id);
  }

  private toModel(car: RawCar): Car {
    return new Car(
      car.id,
      car.ownerId,
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
