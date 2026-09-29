import requestsData from '../Data/requests.json';
import { CarRequest, CarRequestStatus, Renter, TimePeriod, UserRole } from '../Models';

type RawRequest = (typeof requestsData)[number];

let requests = requestsData.map((request) => toModel(request));

export class CarRequestService {
  getCurrentRequests(renterId: string): CarRequest[] {
    return requests
      .filter(
        (request) =>
          request.renter.id === renterId &&
          request.status !== CarRequestStatus.Cancelled &&
          request.status !== CarRequestStatus.Expired,
      )
      .map((request) => toModel(request));
  }

  createRequest(request: CarRequest): CarRequest {
    const requestToStore = toModel(request);
    requests = [...requests, requestToStore];
    return toModel(requestToStore);
  }

  deleteRequest(requestId: string): boolean {
    const requestExists = requests.some((request) => request.id === requestId);
    requests = requests.filter((request) => request.id !== requestId);
    return requestExists;
  }
}

function toModel(request: RawRequest | CarRequest): CarRequest {
  return new CarRequest(
    request.id,
    new Renter(
      request.renter.id,
      request.renter.firstName,
      request.renter.lastName,
      request.renter.email,
      request.renter.phoneNumber,
      request.renter.role as UserRole,
      request.renter.isVerified,
      new Date(request.renter.createdAt),
      new Date(request.renter.updatedAt),
    ),
    request.budget,
    request.currency,
    new TimePeriod(new Date(request.period.startDate), new Date(request.period.endDate)),
    request.status as CarRequestStatus,
    new Date(request.createdAt),
    new Date(request.updatedAt),
  );
}