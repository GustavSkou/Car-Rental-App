import usersData from '../Data/users.json';
import { User, UserRole } from '../Models';

type RawUser = (typeof usersData)[number];

export class UserService {
  getUserByEmail(email: string): User | undefined {
    const user = usersData.find((candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase());
    return user ? this.toModel(user) : undefined;
  }

  authenticate(email: string, password: string): User | undefined {
    const user = usersData.find(
      (candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase() && candidate.password === password,
    );

    return user ? this.toModel(user) : undefined;
  }

  private toModel(user: RawUser): User {
    return new User(
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.phoneNumber,
      user.role as UserRole,
      user.isVerified,
      new Date(user.createdAt),
      new Date(user.updatedAt),
    );
  }
}
