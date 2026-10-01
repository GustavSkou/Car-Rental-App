import { Booking } from '../Models';

export interface BookingServiceInterface {
  getAllBookings(): Booking[];
  getBookingById(id: number): Booking | undefined;
  getBookingsForUser(userId: number): Booking[];
  createBooking(booking: Booking): Booking;
  cancelBooking(bookingId: number): boolean;
  deleteBooking(bookingId: number): boolean;
}
