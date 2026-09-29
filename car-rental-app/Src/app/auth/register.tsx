import { ActionButton, RouteLink, ScreenShell } from '@/Components/ScreenShell';

export default function RegisterScreen() {
  return (
    <ScreenShell backHref="/auth/login" eyebrow="Get started" title="Register" description="Set up an account to rent a car or publish your own listing.">
      <ActionButton href="/cars/volvo-xc40" label="Create account" />
      <RouteLink href="/auth/login" label="Already registered? Log in" />
    </ScreenShell>
  );
}