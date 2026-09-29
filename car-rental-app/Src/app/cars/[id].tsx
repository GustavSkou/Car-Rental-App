import { ActionButton, RouteLink, ScreenShell } from '@/Components/ScreenShell';

export default function CarDetailsScreen() {
  return (
    <ScreenShell backHref="/" eyebrow="Available car" title="Volvo XC40" description="A comfortable city SUV available in Odense. Review the details before booking.">
      <ActionButton href="/bookings/booking-001" label="Book this car" />
      <RouteLink href="/auth/login" label="Log in to book" detail="Authentication is required before payment" />
      <RouteLink href="/" label="Back to available cars" />
    </ScreenShell>
  );
}