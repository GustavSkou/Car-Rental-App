import carsData from '../Data/cars.json';
import { Car, CarStatus, Location } from '../Models';
import { CarServiceInterface } from './CarServiceInterface';

type RawCar = (typeof carsData)[number];

let cars = carsData.map((car) => toModel(car));

export class CarService implements CarServiceInterface {
  getAllCars(): Car[] {
    return cars.map((car) => toModel(car));
  }

  getAvailableCars(): Car[] {
    return this.getAllCars().filter((car) => car.status === CarStatus.Available);
  }

  getCarById(id: number): Car | undefined {
    const car = cars.find((candidate) => candidate.id === id);
    return car ? toModel(car) : undefined;
  }

  getCarsForOwner(ownerId: number): Car[] {
    return cars.filter((car) => car.ownerId === ownerId).map((car) => toModel(car));
  }

  createCar(car: Car): Car {
    const now = new Date();
    const storedCar = new Car(
      car.id || Date.now(),
      car.ownerId,
      car.brand.trim(),
      car.model.trim(),
      car.year,
      car.status,
      car.dailyPrice,
      car.currency,
      car.location,
      car.imageUrls,
      car.createdAt,
      now,
    );

    cars = [...cars, storedCar];
    return toModel(storedCar);
  }

  deleteCar(id: number, ownerId: number): boolean {
    const car = cars.find((candidate) => candidate.id === id && candidate.ownerId === ownerId);
    if (!car) {
      return false;
    }

    cars = cars.filter((candidate) => candidate.id !== id);
    return true;
  }
}

function toModel(car: RawCar | Car): Car {
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
    [...car.imageUrls],
    new Date(car.createdAt),
    new Date(car.updatedAt),
  );
}
