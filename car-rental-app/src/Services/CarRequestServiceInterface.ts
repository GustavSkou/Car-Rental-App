import { CarRequest } from '../Models';

export interface CarRequestServiceInterface {
  getCurrentRequests(renterId: number): CarRequest[];
  createRequest(request: CarRequest): CarRequest;
  deleteRequest(requestId: number): boolean;
}
