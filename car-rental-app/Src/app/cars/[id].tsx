import { router, useLocalSearchParams } from 'expo-router';
import { ActionButton, RouteLink, ScreenShell } from '@/Components/ScreenShell';
import { useAuth } from '@/Context/AuthContext';
import { Booking, BookingStatus, PaymentStatus, TimePeriod } from '@/Models';
import { bookingService, carService } from '@/Services';

export default function CarDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const car = carService.getCarById(Number(id));
  const { isLoggedIn, userId } = useAuth();

  if (!car) {
    return <ScreenShell backHref="/cars" eyebrow="Available car" title="Car not found" description="This car is no longer available." />;
  }

  const selectedCar = car;

  function handleBooking() {
    if (!isLoggedIn || userId === null) {
      router.push(`/auth/login?redirect=/cars/${selectedCar.id}` as never);
      return;
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    const period = new TimePeriod(startDate, endDate);

    bookingService.createBooking(
      new Booking(
        0,
        selectedCar.id,
        userId,
        period,
        selectedCar.location,
        selectedCar.location,
        selectedCar.dailyPrice * period.durationInDays(),
        selectedCar.currency,
        BookingStatus.Pending,
        PaymentStatus.Pending,
      ),
    );
    router.replace('/bookings' as never);
  }

  return (
    <ScreenShell
      backHref="/cars"
      eyebrow="Available car"
      title={`${selectedCar.brand} ${selectedCar.model}`}
      description={`${selectedCar.year} ${selectedCar.brand} ${selectedCar.model} available in ${selectedCar.location.city}. Review the details before booking.`}
    >
      <ActionButton onPress={handleBooking} label="Book this car" />
      {!isLoggedIn ? (
        <RouteLink href={`/auth/login?redirect=/cars/${selectedCar.id}`} label="Log in to book" detail="Authentication is required before payment" />
      ) : null}
      <RouteLink href="/cars" label="Back to available cars" />
    </ScreenShell>
  );
}