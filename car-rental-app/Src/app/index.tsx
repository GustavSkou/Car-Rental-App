import { StatusBar } from 'expo-status-bar';
import { ActionButton, RouteLink, ScreenShell } from '@/Components/ScreenShell';

export default function BrowseCarsScreen() {
  return (
    <ScreenShell eyebrow="Car rental" title="Browse available cars" description="Find a car for your next trip, or manage the cars and bookings connected to your account.">
      <ActionButton href="/auth/login" label="Log in to continue" />
      <RouteLink href="/cars/volvo-xc40" label="Browse cars" detail="Filter available cars, then open car details" />
      <RouteLink href="/auth/register" label="Create an account" detail="New to the platform? Register here" />
      <RouteLink href="/bookings" label="My bookings" detail="View current and previous rentals" />
      <RouteLink href="/listings" label="My car listings" detail="Add, edit, or remove a car listing" />
      <RouteLink href="/requests" label="My car requests" detail="Create and manage rental requests" />
      <StatusBar style="dark" />
    </ScreenShell>
  );
}