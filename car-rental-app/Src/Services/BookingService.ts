import bookingsData from '../Data/bookings.json';
import { Booking, BookingStatus, Location, PaymentStatus, Review, TimePeriod } from '../Models';
import { BookingServiceInterface } from './BookingServiceInterface';

type RawBooking = (typeof bookingsData)[number];
type RawReview = {
  id: number;
  userId: number;
  text: string;
  rating: number;
  createdAt: string;
  bookingId?: number;
};

let bookings = bookingsData.map((booking) => toModel(booking));

export class BookingService implements BookingServiceInterface {
  getAllBookings(): Booking[] {
    return bookings.map((booking) => toModel(booking));
  }

  getBookingById(id: number): Booking | undefined {
    const booking = bookings.find((candidate) => candidate.id === id);
    return booking ? toModel(booking) : undefined;
  }

  getBookingsForUser(userId: number): Booking[] {
    return bookings.filter((booking) => booking.renterId === userId).map((booking) => toModel(booking));
  }

  createBooking(booking: Booking): Booking {
    const bookingToStore = toModel(booking);
    bookings = [...bookings, bookingToStore];
    return toModel(bookingToStore);
  }

  cancelBooking(bookingId: number): boolean {
    const booking = bookings.find((candidate) => candidate.id === bookingId);
    if (!booking || booking.status === BookingStatus.Completed || booking.status === BookingStatus.Cancelled) {
      return false;
    }

    booking.status = BookingStatus.Cancelled;
    booking.updatedAt = new Date();
    return true;
  }

  deleteBooking(bookingId: number): boolean {
    const bookingExists = bookings.some(
      (booking) => booking.id === bookingId && booking.status === BookingStatus.Cancelled,
    );

    if (!bookingExists) {
      return false;
    }

    bookings = bookings.filter((booking) => booking.id !== bookingId);
    return true;
  }
}

function toModel(booking: RawBooking | Booking): Booking {
  const review = 'review' in booking ? booking.review : undefined;

  return new Booking(
    booking.id,
    booking.carId,
    booking.renterId,
    new TimePeriod(new Date(booking.period.startDate), new Date(booking.period.endDate)),
    toLocation(booking.pickUpLocation),
    toLocation(booking.handOverLocation),
    booking.price,
    booking.currency,
    booking.status as BookingStatus,
    booking.paymentStatus as PaymentStatus,
    review ? toReview(review) : undefined,
    new Date(booking.createdAt),
    new Date(booking.updatedAt),
  );
}

function toLocation(location: Location): Location {
  return new Location(
    location.country,
    location.city,
    location.postalCode,
    location.streetName,
    location.streetNumber,
    location.latitude,
    location.longitude,
    location.pickupInstructions,
  );
}

function toReview(review: RawReview | Review): Review {
  return new Review(
    review.id,
    review.userId,
    review.text,
    review.rating,
    new Date(review.createdAt),
    review.bookingId,
  );
}
