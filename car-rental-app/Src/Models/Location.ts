export class Location {
  country: string;
  city: string;
  postalCode: string;
  streetName: string;
  streetNumber: string;
  latitude: number;
  longitude: number;
  pickupInstructions: string;

  constructor(
    country = '',
    city = '',
    postalCode = '',
    streetName = '',
    streetNumber = '',
    latitude = 0,
    longitude = 0,
    pickupInstructions = '',
  ) {
    this.country = country;
    this.city = city;
    this.postalCode = postalCode;
    this.streetName = streetName;
    this.streetNumber = streetNumber;
    this.latitude = latitude;
    this.longitude = longitude;
    this.pickupInstructions = pickupInstructions;
  }
}
