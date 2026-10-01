import requestsData from '../Data/requests.json';
import { CarRequest, CarRequestStatus, TimePeriod } from '../Models';
import { CarRequestServiceInterface } from './CarRequestServiceInterface';

type RawRequest = (typeof requestsData)[number];

let requests = requestsData.map((request) => toModel(request));

export class CarRequestService implements CarRequestServiceInterface {
  getCurrentRequests(renterId: number): CarRequest[] {
    return requests
      .filter(
        (request) =>
          request.renterId === renterId &&
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

  deleteRequest(requestId: number): boolean {
    const requestExists = requests.some((request) => request.id === requestId);
    requests = requests.filter((request) => request.id !== requestId);
    return requestExists;
  }
}

function toModel(request: RawRequest | CarRequest): CarRequest {
  return new CarRequest(
    request.id,
    request.renterId,
    request.budget,
    request.currency,
    new TimePeriod(new Date(request.period.startDate), new Date(request.period.endDate)),
    request.status as CarRequestStatus,
    new Date(request.createdAt),
    new Date(request.updatedAt),
  );
}