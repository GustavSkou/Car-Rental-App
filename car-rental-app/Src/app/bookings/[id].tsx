import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { ActionButton, RouteLink, ScreenShell } from '@/Components/ScreenShell';
import { useAuth } from '@/Context/AuthContext';
import { BookingStatus } from '@/Models';
import { BookingService, CarService, UserService } from '@/Services';

const bookingService = new BookingService();
const carService = new CarService();
const userService = new UserService();

export default function BookingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLoggedIn, userEmail } = useAuth();

  if (!isLoggedIn || !userEmail) {
    return <Redirect href="/auth/login" />;
  }

  const user = userService.getUserByEmail(userEmail);
  const booking = bookingService.getBookingById(Number(id));

  if (!user || !booking || booking.renterId !== user.id) {
    return <ScreenShell backHref="/bookings" eyebrow="Booking details" title="Booking not found" description="This booking is not available for your account." />;
  }

  const car = carService.getCarById(booking.carId);
  const canCancel = booking.status !== BookingStatus.Completed && booking.status !== BookingStatus.Cancelled;
  const canDelete = booking.status === BookingStatus.Cancelled;

  return (
    <ScreenShell backHref="/bookings" eyebrow="Booking details" title={car ? `${car.brand} ${car.model} rental` : 'Booking details'} description={`Booking ${booking.id} is ${booking.status.toLowerCase()}.`}>
      <Text>Rental period: {booking.period.startDate.toLocaleDateString()} - {booking.period.endDate.toLocaleDateString()}</Text>
      <Text>Price: {booking.price} {booking.currency}</Text>
      {canCancel ? <ActionButton href={`/bookings/${booking.id}/cancel`} label="Cancel booking" /> : null}
      {canDelete ? (
        <ActionButton
          label="Remove cancelled booking"
          onPress={() => {
            bookingService.deleteBooking(booking.id);
            router.replace('/bookings');
          }}
        />
      ) : null}
      <RouteLink href="/bookings" label="Back to my bookings" />
    </ScreenShell>
  );
}