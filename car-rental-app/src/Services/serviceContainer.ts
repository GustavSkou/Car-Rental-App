import { BookingService } from './BookingService';
import { CarRequestService } from './CarRequestService';
import { CarService } from './CarService';
import { UserService } from './UserService';
import type { BookingServiceInterface } from './BookingServiceInterface';
import type { CarRequestServiceInterface } from './CarRequestServiceInterface';
import type { CarServiceInterface } from './CarServiceInterface';
import type { UserServiceInterface } from './UserServiceInterface';

export const bookingService: BookingServiceInterface = new BookingService();
export const carRequestService: CarRequestServiceInterface = new CarRequestService();
export const carService: CarServiceInterface = new CarService();
export const userService: UserServiceInterface = new UserService();
