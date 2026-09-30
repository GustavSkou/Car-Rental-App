import { Redirect } from 'expo-router';
import { Text } from 'react-native';
import { RouteLink, ScreenShell } from '@/Components/ScreenShell';
import { useAuth } from '@/Context/AuthContext';
import { CarService } from '@/Services';

const carService = new CarService();

export default function ListingsScreen() {
  const { isLoggedIn, userId } = useAuth();

  if (!isLoggedIn || userId === null) {
    return <Redirect href="/auth/login?redirect=/listings" />;
  }

  const listings = carService.getCarsForOwner(userId);

  return (
    <ScreenShell backHref="/" eyebrow="Listings" title="My car listings" description="Publish and manage the cars you make available to other users.">
      <RouteLink href="/listings/new" label="Add new car" detail="Create a listing for one of your cars" />
      {listings.length > 0 ? (
        listings.map((car) => (
          <RouteLink
            key={car.id}
            href={`/listings/${car.id}`}
            label={`${car.brand} ${car.model}`}
            detail={`${car.year} · ${car.location.city} · ${car.dailyPrice} ${car.currency}/day`}
          />
        ))
      ) : (
        <Text>No listings yet.</Text>
      )}
      <RouteLink href="/cars" label="Browse available cars" />
    </ScreenShell>
  );
}
