import usersData from '../Data/users.json';
import { User } from '../Models';

type RawUser = (typeof usersData)[number];

export class UserService {

  getUserByEmail(email: string): User | undefined {
    const user = usersData.find((candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase());
    return user ? this.toModel(user) : undefined;
  }

  getUserById(id: number): User | undefined {
    const user = usersData.find((candidate) => candidate.id === id);
    return user ? this.toModel(user) : undefined;
  }

  createUser(user: User) {
    if (this.getUserByEmail(user.email)) {
      throw new Error('A user with this email already exists.');
    }

    const now = new Date();
    const rawUser = {
      id: user.id || Math.max(...usersData.map((candidate) => candidate.id), 0) + 1,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email.trim(),
      password: user.password,
      phoneNumber: user.phoneNumber,
      isVerified: user.isVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: now.toISOString(),
    };

    usersData.push(rawUser);
    return this.toModel(rawUser);
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
      user.isVerified,
      new Date(user.createdAt),
      new Date(user.updatedAt),
      user.password,
    );
  }
}
