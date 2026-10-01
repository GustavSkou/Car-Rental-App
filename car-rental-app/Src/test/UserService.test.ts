import { UserService } from "../Services/UserService";
//Run the test: npm test

//Disable SQLite during testing and use local JSON data instead
jest.mock("../Database", () => ({
  canUseSqlite: () => false,
}));

//Testing log in works
test("login with correct email and password", () => {
  // Given
  const userService = new UserService();

  // When
  const user = userService.authenticate("user@gmail.com", "password");

  // Then
  expect(user).toBeDefined();
});

//Testing log in fails with incorrect password
test("login with incorrect password", () => {
  // Given
  const userService = new UserService();

  // When
  const user = userService.authenticate("user@gmail.com", "wrongpassword");

  // Then
  expect(user).toBeUndefined();
});
