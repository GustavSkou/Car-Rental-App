import { Car, CarStatus, Location } from "../Models";
import carsData from "../Data/cars.json";
import { canUseSqlite, getDatabase, insertCar } from "../Database";
import { CarServiceInterface } from "./CarServiceInterface";

type RemoteCar = {
  id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  pricePerDay: number;
  isAvailable: boolean;
};

type StoredCar = {
  id: number;
  owner_id: number;
  brand: string;
  model: string;
  year: number;
  status: string;
  daily_price: number;
  currency: string;
  location_json: string;
  image_urls_json: string;
  created_at: string;
  updated_at: string;
};

const carsUrl =
  "https://raw.githubusercontent.com/OthelloEngineer/mobile-software-development-exercises/refs/heads/main/cars.json";
let webCars = carsData.map((car) => toWebModel(car));

const carImages: Record<string, string> = {
  "Hyundai Elantra": "IMAGE_URL_HERE",
  "Honda Civic": "IMAGE_URL_HERE",
  "Toyota Camry": "IMAGE_URL_HERE",
  "Volkswagen Jetta": "IMAGE_URL_HERE",
};

export class CarService implements CarServiceInterface {
  getAllCars(): Car[] {
    if (!canUseSqlite()) return webCars.map(copyCar);
    return this.rowsToModels(
      this.db().getAllSync<StoredCar>("SELECT * FROM cars ORDER BY id"),
    );
  }

  getAvailableCars(): Car[] {
    if (!canUseSqlite())
      return webCars
        .filter((car) => car.status === CarStatus.Available)
        .map(copyCar);
    return this.rowsToModels(
      this.db().getAllSync<StoredCar>(
        "SELECT * FROM cars WHERE status = 'Available' ORDER BY id",
      ),
    );
  }

  getCarById(id: number): Car | undefined {
    if (!canUseSqlite()) {
      const car = webCars.find((candidate) => candidate.id === id);
      return car ? copyCar(car) : undefined;
    }
    const row = this.db().getFirstSync<StoredCar>(
      "SELECT * FROM cars WHERE id = ?",
      id,
    );
    return row ? this.toModel(row) : undefined;
  }

  getCarsForOwner(ownerId: number): Car[] {
    if (!canUseSqlite())
      return webCars.filter((car) => car.ownerId === ownerId).map(copyCar);
    return this.rowsToModels(
      this.db().getAllSync<StoredCar>(
        "SELECT * FROM cars WHERE owner_id = ? ORDER BY id",
        ownerId,
      ),
    );
  }

  createCar(car: Car): Car {
    const now = new Date();
    const storedCar = new Car(
      car.id || this.nextId(),
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
    if (!canUseSqlite()) {
      webCars = [...webCars, storedCar];
    } else {
      insertCar(this.db(), storedCar);
    }
    return this.toModelFromDomain(storedCar);
  }

  deleteCar(id: number, ownerId: number): boolean {
    if (!canUseSqlite()) {
      const exists = webCars.some(
        (car) => car.id === id && car.ownerId === ownerId,
      );
      webCars = webCars.filter(
        (car) => car.id !== id || car.ownerId !== ownerId,
      );
      return exists;
    }
    const result = this.db().runSync(
      "DELETE FROM cars WHERE id = ? AND owner_id = ?",
      id,
      ownerId,
    );
    return result.changes > 0;
  }

  async importCarsFromApi(): Promise<number> {
    const response = await fetch(carsUrl);
    if (!response.ok) {
      throw new Error(
        `Unable to load car data (${response.status} ${response.statusText}).`,
      );
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload) || !payload.every(isRemoteCar)) {
      throw new Error(
        "The remote car data does not match the expected API model.",
      );
    }

    const importedCars = payload.map(
      (car) =>
        new Car(
          car.id,
          0,
          car.make.trim(),
          car.model.trim(),
          car.year,
          car.isAvailable ? CarStatus.Available : CarStatus.Blocked,
          car.pricePerDay,
          "DKK",
          new Location(),
          [],
          new Date(),
          new Date(),
        ),
    );

    if (!canUseSqlite()) {
      webCars = importedCars;
    } else {
      const db = this.db();
      db.withTransactionSync(() => {
        db.runSync("DELETE FROM cars");
        for (const car of importedCars) insertCar(db, car);
      });
    }

    return payload.length;
  }

  private db() {
    return getDatabase();
  }

  private nextId(): number {
    const row = this.db().getFirstSync<{ maxId: number | null }>(
      "SELECT MAX(id) AS maxId FROM cars",
    );
    return (row?.maxId ?? 0) + 1;
  }

  private rowsToModels(rows: StoredCar[]): Car[] {
    return rows.map((row) => this.toModel(row));
  }

  private toModel(row: StoredCar): Car {
    const location = JSON.parse(row.location_json) as Location;
    return new Car(
      row.id,
      row.owner_id,
      row.brand,
      row.model,
      row.year,
      row.status as CarStatus,
      row.daily_price,
      row.currency,
      new Location(
        location.country,
        location.city,
        location.postalCode,
        location.streetName,
        location.streetNumber,
        location.latitude,
        location.longitude,
        location.pickupInstructions,
      ),
      JSON.parse(row.image_urls_json) as string[],
      new Date(row.created_at),
      new Date(row.updated_at),
    );
  }

  private toModelFromDomain(car: Car): Car {
    return new Car(
      car.id,
      car.ownerId,
      car.brand,
      car.model,
      car.year,
      car.status,
      car.dailyPrice,
      car.currency,
      car.location,
      [...car.imageUrls],
      new Date(car.createdAt),
      new Date(car.updatedAt),
    );
  }
}

function isRemoteCar(value: unknown): value is RemoteCar {
  if (!value || typeof value !== "object") return false;
  const car = value as Record<string, unknown>;
  return (
    Number.isInteger(car.id) &&
    typeof car.make === "string" &&
    typeof car.model === "string" &&
    Number.isInteger(car.year) &&
    typeof car.color === "string" &&
    typeof car.pricePerDay === "number" &&
    typeof car.isAvailable === "boolean"
  );
}

function toWebModel(car: (typeof carsData)[number]): Car {
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

function copyCar(car: Car): Car {
  return new Car(
    car.id,
    car.ownerId,
    car.brand,
    car.model,
    car.year,
    car.status,
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
