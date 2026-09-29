import { ActionButton, ScreenShell } from '@/Components/ScreenShell';

export default function CancelBookingScreen() {
  return (
    <ScreenShell backHref="/bookings/1" eyebrow="Cancel booking" title="Cancel this booking?" description="The cancellation flow will confirm the choice and show any applicable payment policy.">
      <ActionButton href="/bookings" label="Confirm cancellation" />
    </ScreenShell>
  );
}