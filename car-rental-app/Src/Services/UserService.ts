import { User } from '../Models';
import usersData from '../Data/users.json';
import { canUseSqlite, getDatabase } from '../Database';
import { UserServiceInterface } from './UserServiceInterface';

type UserRow = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  is_verified: number;
  created_at: string;
  updated_at: string;
};

let webUsers = usersData.map(
  (user) =>
    new User(
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.phoneNumber,
      user.isVerified,
      new Date(user.createdAt),
      new Date(user.updatedAt),
      user.password ?? '',
    ),
);

export class UserService implements UserServiceInterface {
  getUserByEmail(email: string): User | undefined {
    if (!canUseSqlite()) {
      return webUsers.find((user) => user.email.toLowerCase() === email.trim().toLowerCase());
    }
    const row = getDatabase().getFirstSync<UserRow>('SELECT * FROM users WHERE email = ?', email.trim());
    return row ? this.toModel(row) : undefined;
  }

  getUserById(id: number): User | undefined {
    if (!canUseSqlite()) return webUsers.find((user) => user.id === id);
    const row = getDatabase().getFirstSync<UserRow>('SELECT * FROM users WHERE id = ?', id);
    return row ? this.toModel(row) : undefined;
  }

  createUser(user: User): User {
    if (this.getUserByEmail(user.email)) {
      throw new Error('A user with this email already exists.');
    }
    const now = new Date();
    if (!canUseSqlite()) {
      const id = user.id || Math.max(...webUsers.map((candidate) => candidate.id), 0) + 1;
      const created = new User(id, user.firstName, user.lastName, user.email.trim(), user.phoneNumber, user.isVerified, user.createdAt, now, user.password);
      webUsers = [...webUsers, created];
      return created;
    }
    const id = user.id || (getDatabase().getFirstSync<{ maxId: number | null }>('SELECT MAX(id) AS maxId FROM users')?.maxId ?? 0) + 1;
    getDatabase().runSync(
      `INSERT INTO users
        (id, first_name, last_name, email, password, phone_number, is_verified, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      user.firstName,
      user.lastName,
      user.email.trim(),
      user.password,
      user.phoneNumber,
      user.isVerified ? 1 : 0,
      user.createdAt.toISOString(),
      now.toISOString(),
    );
    return new User(id, user.firstName, user.lastName, user.email.trim(), user.phoneNumber, user.isVerified, user.createdAt, now, user.password);
  }

  authenticate(email: string, password: string): User | undefined {
    if (!canUseSqlite()) {
      return webUsers.find(
        (user) => user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password,
      );
    }
    const row = getDatabase().getFirstSync<UserRow>(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      email.trim(),
      password,
    );
    return row ? this.toModel(row) : undefined;
  }

  private toModel(row: UserRow): User {
    return new User(
      row.id,
      row.first_name,
      row.last_name,
      row.email,
      row.phone_number,
      row.is_verified === 1,
      new Date(row.created_at),
      new Date(row.updated_at),
      row.password,
    );
  }
}
