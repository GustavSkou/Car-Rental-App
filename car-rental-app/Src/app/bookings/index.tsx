import { Redirect } from 'expo-router';
import { RouteLink, ScreenShell } from '@/Components/ScreenShell';
import { useAuth } from '@/Context/AuthContext';

export default function BookingsScreen() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <ScreenShell backHref="/" eyebrow="Rentals" title="My bookings" description="Keep track of upcoming and completed car rentals.">
      <RouteLink href="/bookings/booking-001" label="Volvo XC40" detail="Tomorrow, 10:00 - 18:00 | Booking details" />
      <RouteLink href="/" label="Browse available cars" />
    </ScreenShell>
  );
}