export class TimePeriod {
  startDate: Date;
  endDate: Date;

  constructor(startDate = new Date(), endDate = new Date()) {
    this.startDate = startDate;
    this.endDate = endDate;
  }

  isValid(): boolean {
    return this.endDate >= this.startDate;
  }

  durationInDays(): number {
    const diffMs = this.endDate.getTime() - this.startDate.getTime();
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }
}
