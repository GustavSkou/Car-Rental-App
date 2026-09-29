import { ActionButton, RouteLink, ScreenShell } from '@/Components/ScreenShell';

export default function BookingDetailsScreen() {
  return (
    <ScreenShell backHref="/bookings" eyebrow="Booking details" title="Volvo XC40 rental" description="Payment is complete and your booking is ready. A confirmation email will be sent to you.">
      <ActionButton href="/bookings/booking-001/cancel" label="Cancel booking" />
      <RouteLink href="/bookings" label="Back to my bookings" />
    </ScreenShell>
  );
}