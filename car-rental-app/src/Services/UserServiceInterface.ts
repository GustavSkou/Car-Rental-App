import { User } from '../Models';

export interface UserServiceInterface {
  getUserByEmail(email: string): User | undefined;
  getUserById(id: number): User | undefined;
  createUser(user: User): User;
  authenticate(email: string, password: string): User | undefined;
}
