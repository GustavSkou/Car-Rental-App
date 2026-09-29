import bookingsData from '../Data/bookings.json';
import {
  Booking,
  BookingStatus,
  Car,
  CarStatus,
  Location,
  Owner,
  PaymentStatus,
  Renter,
  Review,
  TimePeriod,
  User,
  UserRole,
} from '../Models';

type RawBooking = (typeof bookingsData)[number];

let bookings = bookingsData.map((booking) => toModel(booking));

export class BookingService {
  getAllBookings(): Booking[] {
    return bookings.map((booking) => toModel(booking));
  }

  getBookingsForUser(userId: string): Booking[] {
    return bookings
      .filter((booking) => booking.renter.id === userId)
      .map((booking) => toModel(booking));
  }

  createBooking(booking: Booking): Booking {
    const bookingToStore = toModel(booking);
    bookings = [...bookings, bookingToStore];
    return toModel(bookingToStore);
  }

  deleteBooking(bookingId: string): boolean {
    const bookingExists = bookings.some((booking) => booking.id === bookingId);
    bookings = bookings.filter((booking) => booking.id !== bookingId);
    return bookingExists;
  }
}

function toModel(booking: RawBooking | Booking): Booking {
  return new Booking(
    booking.id,
    new Car(
      booking.car.id,
      new Owner(
        booking.car.owner.id,
        booking.car.owner.firstName,
        booking.car.owner.lastName,
        booking.car.owner.email,
        booking.car.owner.phoneNumber,
        booking.car.owner.role as UserRole,
        booking.car.owner.isVerified,
        new Date(booking.car.owner.createdAt),
        new Date(booking.car.owner.updatedAt),
      ),
      booking.car.brand,
      booking.car.model,
      booking.car.year,
      booking.car.status as CarStatus,
      booking.car.dailyPrice,
      booking.car.currency,
      toLocation(booking.car.location),
      booking.car.imageUrls,
      new Date(booking.car.createdAt),
      new Date(booking.car.updatedAt),
    ),
    new Renter(
      booking.renter.id,
      booking.renter.firstName,
      booking.renter.lastName,
      booking.renter.email,
      booking.renter.phoneNumber,
      booking.renter.role as UserRole,
      booking.renter.isVerified,
      new Date(booking.renter.createdAt),
      new Date(booking.renter.updatedAt),
    ),
    new TimePeriod(new Date(booking.period.startDate), new Date(booking.period.endDate)),
    toLocation(booking.pickUpLocation),
    toLocation(booking.handOverLocation),
    booking.price,
    booking.currency,
    booking.status as BookingStatus,
    booking.paymentStatus as PaymentStatus,
    booking.review ? toReview(booking.review) : undefined,
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

function toReview(review: Review): Review {
  return new Review(
    review.id,
    new User(
      review.user.id,
      review.user.firstName,
      review.user.lastName,
      review.user.email,
      review.user.phoneNumber,
      review.user.role,
      review.user.isVerified,
      new Date(review.user.createdAt),
      new Date(review.user.updatedAt),
    ),
    review.text,
    review.rating,
    new Date(review.createdAt),
    review.bookingId,
  );
}
