export class Review {
  id: number;
  userId: number;
  text: string;
  rating: number;
  createdAt: Date;
  bookingId?: number;

  constructor(id = 0, userId = 0, text = '', rating = 0, createdAt = new Date(), bookingId?: number) {
    this.id = id;
    this.userId = userId;
    this.text = text;
    this.rating = rating;
    this.createdAt = createdAt;
    this.bookingId = bookingId;
  }
}
