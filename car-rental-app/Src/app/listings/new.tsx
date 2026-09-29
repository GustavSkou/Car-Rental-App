import { ActionButton, ScreenShell } from '@/Components/ScreenShell';

export default function NewListingScreen() {
  return (
    <ScreenShell backHref="/listings" eyebrow="Listings" title="Add new car" description="The listing form will collect the car details, location, availability, and photos.">
      <ActionButton href="/listings" label="Publish listing" />
    </ScreenShell>
  );
}