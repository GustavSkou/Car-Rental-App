import { Redirect } from 'expo-router';
import { ActionButton, RouteLink, ScreenShell } from '@/Components/ScreenShell';
import { useAuth } from '@/Context/AuthContext';

export default function RequestsScreen() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <ScreenShell backHref="/" eyebrow="Requests" title="My car requests" description="Describe the car you need and let owners respond with a suitable listing.">
      <ActionButton href="/requests/new" label="Add new request" />
      <RouteLink href="/requests/1/edit" label="Weekend trip to Aarhus" detail="Edit or remove request" />
      <RouteLink href="/" label="Browse available cars" />
    </ScreenShell>
  );
}