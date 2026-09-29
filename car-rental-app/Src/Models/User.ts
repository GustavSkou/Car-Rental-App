import { UserRole } from './UserRole';

export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id = '',
    firstName = '',
    lastName = '',
    email = '',
    phoneNumber = '',
    role = UserRole.Renter,
    isVerified = false,
    createdAt = new Date(),
    updatedAt = new Date(),
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.role = role;
    this.isVerified = isVerified;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
