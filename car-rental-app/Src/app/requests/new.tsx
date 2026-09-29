import { ActionButton, ScreenShell } from '@/Components/ScreenShell';

export default function NewRequestScreen() {
  return (
    <ScreenShell backHref="/requests" eyebrow="New request" title="Add request" description="The request form will collect location, rental period, and maximum budget.">
      <ActionButton href="/requests" label="Save request" />
    </ScreenShell>
  );
}