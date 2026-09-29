import { ActionButton, RouteLink, ScreenShell } from '@/Components/ScreenShell';

export default function EditListingScreen() {
  return (
    <ScreenShell backHref="/listings" eyebrow="Owner area" title="Edit listing" description="Update the listing details or remove this car from the marketplace.">
      <ActionButton href="/listings" label="Save changes" />
      <RouteLink href="/listings" label="Remove listing" detail="Return to my car listings after removal" />
    </ScreenShell>
  );
}