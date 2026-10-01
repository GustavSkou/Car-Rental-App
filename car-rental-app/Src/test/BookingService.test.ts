import { BookingService } from "../Services/BookingService";

//Run the test: npm test

//Disable SQLite during testing and use local JSON data instead
jest.mock("../Database", () => ({
  canUseSqlite: () => false,
}));

//Tests the booking cancellation logic by checking that a confirmed booking can be cancelled
test("confirmed booking can be cancelled", () => {
  //Given
  const bookingService = new BookingService();

  //When
  const result = bookingService.cancelBooking(1);

  //Then
  expect(result).toBe(true);
});

//Test that a completed booking cannot be cancelled
test("completed booking cannot be cancelled", () => {
  //Given
  const bookingService = new BookingService();

  //When
  const result = bookingService.cancelBooking(3);

  //Then
  expect(result).toBe(false);
});
