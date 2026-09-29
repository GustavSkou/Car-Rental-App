import { ActionButton, RouteLink, ScreenShell } from '@/Components/ScreenShell';

export default function EditRequestScreen() {
  return (
    <ScreenShell backHref="/requests" eyebrow="Request details" title="Edit request" description="Update the request details or remove it from your active requests.">
      <ActionButton href="/requests" label="Save changes" />
      <RouteLink href="/requests" label="Remove request" detail="Return to my requests after removal" />
    </ScreenShell>
  );
}