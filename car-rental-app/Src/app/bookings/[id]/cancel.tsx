import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { ActionButton, ScreenShell } from '@/Components/ScreenShell';
import { useAuth } from '@/Context/AuthContext';
import { bookingService, userService } from '@/Services';

export default function CancelBookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLoggedIn, userEmail } = useAuth();

  if (!isLoggedIn || !userEmail) {
    return <Redirect href="/auth/login" />;
  }

  const user = userService.getUserByEmail(userEmail);
  const booking = bookingService.getBookingById(Number(id));

  if (!user || !booking || booking.renterId !== user.id) {
    return <ScreenShell backHref="/bookings" eyebrow="Cancel booking" title="Booking not found" description="This booking is not available for your account." />;
  }

  return (
    <ScreenShell backHref={`/bookings/${booking.id}`} eyebrow="Cancel booking" title="Cancel this booking?" description="The booking will remain in your history with a cancelled status.">
      <ActionButton
        label="Confirm cancellation"
        onPress={() => {
          bookingService.cancelBooking(booking.id);
          router.replace(`/bookings/${booking.id}`);
        }}
      />
      <ActionButton href={`/bookings/${booking.id}`} label="Keep booking" />
    </ScreenShell>
  );
}