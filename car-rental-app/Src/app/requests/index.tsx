import { ActionButton, RouteLink, ScreenShell } from '@/Components/ScreenShell';

export default function RequestsScreen() {
  return (
    <ScreenShell backHref="/" eyebrow="Requests" title="My car requests" description="Describe the car you need and let owners respond with a suitable listing.">
      <ActionButton href="/requests/new" label="Add new request" />
      <RouteLink href="/requests/request-001/edit" label="Weekend trip to Aarhus" detail="Edit or remove request" />
      <RouteLink href="/" label="Browse available cars" />
    </ScreenShell>
  );
}