export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id = 0,
    firstName = '',
    lastName = '',
    email = '',
    phoneNumber = '',
    isVerified = false,
    createdAt = new Date(),
    updatedAt = new Date(),
    password = '',
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.isVerified = isVerified;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.password = password;
  }
}
