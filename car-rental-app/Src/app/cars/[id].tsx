import { useLocalSearchParams } from 'expo-router';
import { ActionButton, RouteLink, ScreenShell } from '@/Components/ScreenShell';
import { CarService } from '@/Services/CarService';

const carService = new CarService();

export default function CarDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const car = carService.getCarById(Number(id));

  if (!car) {
    return <ScreenShell backHref="/cars" eyebrow="Available car" title="Car not found" description="This car is no longer available." />;
  }

  return (
    <ScreenShell
      backHref="/cars"
      eyebrow="Available car"
      title={`${car.brand} ${car.model}`}
      description={`${car.year} ${car.brand} ${car.model} available in ${car.location.city}. Review the details before booking.`}
    >
      <ActionButton href="/bookings/1" label="Book this car" />
      <RouteLink href="/auth/login" label="Log in to book" detail="Authentication is required before payment" />
      <RouteLink href="/cars" label="Back to available cars" />
    </ScreenShell>
  );
}