# Car-Rental-App - New name coming soon.....

## About the Project

This project is a peer-to-peer luxury themed car rental mobile app. It allows car owners to rent out their unused cars, while other users can search for and book an available car.

Renters can also create a request describing what they need, for example:

> A car in Odense tomorrow from 10:00–18:00 with a maximum budget of 400 DKK.

Car owners can view these requests and offer a suitable car.

## Main Features

* View available cars
* Search by location, price and availability
* Create, view, edit and delete car listings
* Book or cancel a car rental
* View current and previous bookings
* Create rental requests with a budget, location and rental period
* Rate cars, renters and car owners

## Technologies
React Native
TypeScript
Expo SQLite

Persistence is provided by SQLite through the service interfaces. The car service imports and validates the remote catalogue at startup. The remote `make`, `pricePerDay`, and `isAvailable` fields map to the existing `Car` model's `brand`, `dailyPrice`, and `status`; missing rental fields use explicit defaults (`DKK`, an empty location, no images, and owner `0`).

For Expo web, restart the development server after changing `metro.config.js`. Expo SQLite web requires cross-origin isolation; the Metro configuration supplies the required `Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy` headers for the HTML entry point. If an existing server was started before this configuration, stop it and run `npx expo start --web` again.

## Group members:
Bashir Abdinasir Mahamed Muhdi
Gustav Rasmussen
Mohammed Hamarash
Ramin Javed
Victor Munk
