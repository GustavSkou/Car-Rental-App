import { Car } from '../Models';

export interface CarServiceInterface {
  getAllCars(): Car[];
  getAvailableCars(): Car[];
  getCarById(id: number): Car | undefined;
  getCarsForOwner(ownerId: number): Car[];
  createCar(car: Car): Car;
  deleteCar(id: number, ownerId: number): boolean;
  importCarsFromApi(): Promise<number>;
}
