import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';
import carsData from '../Data/cars.json';
import bookingsData from '../Data/bookings.json';
import requestsData from '../Data/requests.json';
import usersData from '../Data/users.json';

let database: SQLiteDatabase | undefined;

export function canUseSqlite(): boolean {
  return typeof document === 'undefined' || globalThis.crossOriginIsolated === true;
}

export function getDatabase(): SQLiteDatabase {
  if (!canUseSqlite()) {
    throw new Error(
      'SQLite web support requires a cross-origin-isolated page. Use a native Expo build or serve the web app with COOP/COEP headers.',
    );
  }

  if (!database) {
    database = openDatabaseSync('car-rental.db');
    database.execSync(`
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE COLLATE NOCASE,
        password TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        is_verified INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY,
        owner_id INTEGER NOT NULL,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        status TEXT NOT NULL,
        daily_price REAL NOT NULL,
        currency TEXT NOT NULL,
        location_json TEXT NOT NULL,
        image_urls_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY,
        car_id INTEGER NOT NULL,
        renter_id INTEGER NOT NULL,
        period_json TEXT NOT NULL,
        pickup_location_json TEXT NOT NULL,
        handover_location_json TEXT NOT NULL,
        price REAL NOT NULL,
        currency TEXT NOT NULL,
        status TEXT NOT NULL,
        payment_status TEXT NOT NULL,
        review_json TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS car_requests (
        id INTEGER PRIMARY KEY,
        renter_id INTEGER NOT NULL,
        budget REAL NOT NULL,
        currency TEXT NOT NULL,
        period_json TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
    seedDatabase(database);
  }

  return database;
}

function seedDatabase(db: SQLiteDatabase): void {
  const userCount = db.getFirstSync<{ count: number }>('SELECT COUNT(*) AS count FROM users');
  if ((userCount?.count ?? 0) === 0) {
    for (const user of usersData) {
      db.runSync(
        `INSERT INTO users
          (id, first_name, last_name, email, password, phone_number, is_verified, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        user.id,
        user.firstName,
        user.lastName,
        user.email,
        user.password ?? '',
        user.phoneNumber,
        user.isVerified ? 1 : 0,
        user.createdAt,
        user.updatedAt,
      );
    }
  }

  const carCount = db.getFirstSync<{ count: number }>('SELECT COUNT(*) AS count FROM cars');
  if ((carCount?.count ?? 0) === 0) {
    for (const car of carsData) {
      insertCar(db, car);
    }
  }

  const bookingCount = db.getFirstSync<{ count: number }>('SELECT COUNT(*) AS count FROM bookings');
  if ((bookingCount?.count ?? 0) === 0) {
    for (const booking of bookingsData) {
      db.runSync(
        `INSERT INTO bookings
          (id, car_id, renter_id, period_json, pickup_location_json, handover_location_json,
           price, currency, status, payment_status, review_json, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        booking.id,
        booking.carId,
        booking.renterId,
        JSON.stringify(booking.period),
        JSON.stringify(booking.pickUpLocation),
        JSON.stringify(booking.handOverLocation),
        booking.price,
        booking.currency,
        booking.status,
        booking.paymentStatus,
        'review' in booking && booking.review ? JSON.stringify(booking.review) : null,
        booking.createdAt,
        booking.updatedAt,
      );
    }
  }

  const requestCount = db.getFirstSync<{ count: number }>('SELECT COUNT(*) AS count FROM car_requests');
  if ((requestCount?.count ?? 0) === 0) {
    for (const request of requestsData) {
      db.runSync(
        `INSERT INTO car_requests
          (id, renter_id, budget, currency, period_json, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        request.id,
        request.renterId,
        request.budget,
        request.currency,
        JSON.stringify(request.period),
        request.status,
        request.createdAt,
        request.updatedAt,
      );
    }
  }
}

export function insertCar(db: SQLiteDatabase, car: {
  id: number;
  ownerId: number;
  brand: string;
  model: string;
  year: number;
  status: string;
  dailyPrice: number;
  currency: string;
  location: object;
  imageUrls: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
}): void {
  db.runSync(
    `INSERT OR REPLACE INTO cars
      (id, owner_id, brand, model, year, status, daily_price, currency,
       location_json, image_urls_json, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    car.id,
    car.ownerId,
    car.brand,
    car.model,
    car.year,
    car.status,
    car.dailyPrice,
    car.currency,
    JSON.stringify(car.location),
    JSON.stringify(car.imageUrls),
    new Date(car.createdAt).toISOString(),
    new Date(car.updatedAt).toISOString(),
  );
}
