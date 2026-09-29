import { User } from './User';

export class Review {
  id: string;
  user: User;
  text: string;
  rating: number;
  createdAt: Date;
  bookingId?: string;

  constructor(id = '', user = new User(), text = '', rating = 0, createdAt = new Date(), bookingId?: string) {
    this.id = id;
    this.user = user;
    this.text = text;
    this.rating = rating;
    this.createdAt = createdAt;
    this.bookingId = bookingId;
  }
}
