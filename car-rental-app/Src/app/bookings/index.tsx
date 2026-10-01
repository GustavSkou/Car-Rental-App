import { Redirect } from 'expo-router';
import { Text } from 'react-native';
import { RouteLink, ScreenShell } from '@/Components/ScreenShell';
import { useAuth } from '@/Context/AuthContext';
import { bookingService, carService, userService } from '@/Services';

export default function BookingsScreen() {
  const { isLoggedIn, userEmail } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href="/auth/login" />;
  }

  const user = userEmail ? userService.getUserByEmail(userEmail) : undefined;
  const bookings = user ? bookingService.getBookingsForUser(user.id) : [];

  return (
    <ScreenShell backHref="/" eyebrow="Rentals" title="My bookings" description="Keep track of upcoming and completed car rentals.">
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <RouteLink
            key={booking.id}
            href={`/bookings/${booking.id}`}
            label={carService.getCarById(booking.carId)?.brand + ' ' + carService.getCarById(booking.carId)?.model}
            detail={`${booking.period.startDate.toLocaleDateString()} - ${booking.period.endDate.toLocaleDateString()} | ${booking.status}`}
          />
        ))
      ) : (
        <Text>No bookings yet.</Text>
      )}
      <RouteLink href="/" label="Browse available cars" />
    </ScreenShell>
  );
}