import { ActionButton, RouteLink, ScreenShell } from '@/Components/ScreenShell';

export default function LoginScreen() {
  return (
    <ScreenShell backHref="/" eyebrow="Welcome back" title="Log in" description="Sign in to book cars, manage listings, and respond to requests.">
      <ActionButton href="/cars/volvo-xc40" label="Log in" />
      <RouteLink href="/auth/register" label="Register" detail="Create a new renter or owner account" />
      <RouteLink href="/" label="Browse without logging in" />
    </ScreenShell>
  );
}