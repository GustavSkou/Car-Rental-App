import { Booking, BookingStatus, Location, PaymentStatus, Review, TimePeriod } from '../Models';
import bookingsData from '../Data/bookings.json';
import { canUseSqlite, getDatabase } from '../Database';
import { BookingServiceInterface } from './BookingServiceInterface';

type BookingRow = {
  id: number;
  car_id: number;
  renter_id: number;
  period_json: string;
  pickup_location_json: string;
  handover_location_json: string;
  price: number;
  currency: string;
  status: string;
  payment_status: string;
  review_json: string | null;
  created_at: string;
  updated_at: string;
};

let webBookings = bookingsData.map((booking) => new Booking(
  booking.id,
  booking.carId,
  booking.renterId,
  new TimePeriod(new Date(booking.period.startDate), new Date(booking.period.endDate)),
  new Location(booking.pickUpLocation.country, booking.pickUpLocation.city, booking.pickUpLocation.postalCode, booking.pickUpLocation.streetName, booking.pickUpLocation.streetNumber, booking.pickUpLocation.latitude, booking.pickUpLocation.longitude, booking.pickUpLocation.pickupInstructions),
  new Location(booking.handOverLocation.country, booking.handOverLocation.city, booking.handOverLocation.postalCode, booking.handOverLocation.streetName, booking.handOverLocation.streetNumber, booking.handOverLocation.latitude, booking.handOverLocation.longitude, booking.handOverLocation.pickupInstructions),
  booking.price,
  booking.currency,
  booking.status as BookingStatus,
  booking.paymentStatus as PaymentStatus,
  undefined,
  new Date(booking.createdAt),
  new Date(booking.updatedAt),
));

export class BookingService implements BookingServiceInterface {
  getAllBookings(): Booking[] {
    if (!canUseSqlite()) return webBookings;
    return getDatabase().getAllSync<BookingRow>('SELECT * FROM bookings ORDER BY id').map((row) => this.toModel(row));
  }

  getBookingById(id: number): Booking | undefined {
    if (!canUseSqlite()) return webBookings.find((booking) => booking.id === id);
    const row = getDatabase().getFirstSync<BookingRow>('SELECT * FROM bookings WHERE id = ?', id);
    return row ? this.toModel(row) : undefined;
  }

  getBookingsForUser(userId: number): Booking[] {
    if (!canUseSqlite()) return webBookings.filter((booking) => booking.renterId === userId);
    return getDatabase()
      .getAllSync<BookingRow>('SELECT * FROM bookings WHERE renter_id = ? ORDER BY id', userId)
      .map((row) => this.toModel(row));
  }

  createBooking(booking: Booking): Booking {
    if (!canUseSqlite()) {
      const id = booking.id || Math.max(...webBookings.map((candidate) => candidate.id), 0) + 1;
      const created = new Booking(id, booking.carId, booking.renterId, booking.period, booking.pickUpLocation, booking.handOverLocation, booking.price, booking.currency, booking.status, booking.paymentStatus, booking.review, booking.createdAt, booking.updatedAt);
      webBookings = [...webBookings, created];
      return created;
    }
    const id = booking.id || (getDatabase().getFirstSync<{ maxId: number | null }>('SELECT MAX(id) AS maxId FROM bookings')?.maxId ?? 0) + 1;
    getDatabase().runSync(
      `INSERT INTO bookings
        (id, car_id, renter_id, period_json, pickup_location_json, handover_location_json,
         price, currency, status, payment_status, review_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      booking.carId,
      booking.renterId,
      JSON.stringify(booking.period),
      JSON.stringify(booking.pickUpLocation),
      JSON.stringify(booking.handOverLocation),
      booking.price,
      booking.currency,
      booking.status,
      booking.paymentStatus,
      booking.review ? JSON.stringify(booking.review) : null,
      booking.createdAt.toISOString(),
      booking.updatedAt.toISOString(),
    );
    return new Booking(id, booking.carId, booking.renterId, booking.period, booking.pickUpLocation, booking.handOverLocation, booking.price, booking.currency, booking.status, booking.paymentStatus, booking.review, booking.createdAt, booking.updatedAt);
  }

  cancelBooking(bookingId: number): boolean {
    const booking = this.getBookingById(bookingId);
    if (!booking || booking.status === BookingStatus.Completed || booking.status === BookingStatus.Cancelled) return false;
    if (!canUseSqlite()) {
      booking.status = BookingStatus.Cancelled;
      booking.updatedAt = new Date();
      return true;
    }
    return getDatabase().runSync(
      'UPDATE bookings SET status = ?, updated_at = ? WHERE id = ?',
      BookingStatus.Cancelled,
      new Date().toISOString(),
      bookingId,
    ).changes > 0;
  }

  deleteBooking(bookingId: number): boolean {
    if (!canUseSqlite()) {
      const exists = webBookings.some((booking) => booking.id === bookingId && booking.status === BookingStatus.Cancelled);
      webBookings = webBookings.filter((booking) => booking.id !== bookingId);
      return exists;
    }
    return getDatabase().runSync('DELETE FROM bookings WHERE id = ? AND status = ?', bookingId, BookingStatus.Cancelled).changes > 0;
  }

  private toModel(row: BookingRow): Booking {
    const period = JSON.parse(row.period_json) as { startDate: string; endDate: string };
    const review = row.review_json ? (JSON.parse(row.review_json) as Review) : undefined;
    return new Booking(
      row.id,
      row.car_id,
      row.renter_id,
      new TimePeriod(new Date(period.startDate), new Date(period.endDate)),
      this.toLocation(row.pickup_location_json),
      this.toLocation(row.handover_location_json),
      row.price,
      row.currency,
      row.status as BookingStatus,
      row.payment_status as PaymentStatus,
      review ? new Review(review.id, review.userId, review.text, review.rating, new Date(review.createdAt), review.bookingId) : undefined,
      new Date(row.created_at),
      new Date(row.updated_at),
    );
  }

  private toLocation(json: string): Location {
    const location = JSON.parse(json) as Location;
    return new Location(location.country, location.city, location.postalCode, location.streetName, location.streetNumber, location.latitude, location.longitude, location.pickupInstructions);
  }
}
