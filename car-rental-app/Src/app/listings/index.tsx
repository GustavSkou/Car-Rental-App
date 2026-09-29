import { ActionButton, RouteLink, ScreenShell } from '@/Components/ScreenShell';

export default function ListingsScreen() {
  return (
    <ScreenShell backHref="/" eyebrow="Listings" title="My car listings" description="Publish and manage the cars you make available to other users.">
      <ActionButton href="/listings/new" label="Add new car" />
      <RouteLink href="/listings/car-001/edit" label="Volvo XC40" detail="Select a car to edit or remove its listing" />
      <RouteLink href="/" label="Browse available cars" />
    </ScreenShell>
  );
}