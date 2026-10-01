import { CarRequest, CarRequestStatus, TimePeriod } from '../Models';
import requestsData from '../Data/requests.json';
import { canUseSqlite, getDatabase } from '../Database';
import { CarRequestServiceInterface } from './CarRequestServiceInterface';

type RequestRow = {
  id: number;
  renter_id: number;
  budget: number;
  currency: string;
  period_json: string;
  status: string;
  created_at: string;
  updated_at: string;
};

let webRequests = requestsData.map(
  (request) =>
    new CarRequest(
      request.id,
      request.renterId,
      request.budget,
      request.currency,
      new TimePeriod(new Date(request.period.startDate), new Date(request.period.endDate)),
      request.status as CarRequestStatus,
      new Date(request.createdAt),
      new Date(request.updatedAt),
    ),
);

export class CarRequestService implements CarRequestServiceInterface {
  getCurrentRequests(renterId: number): CarRequest[] {
    if (!canUseSqlite()) {
      return webRequests.filter(
        (request) =>
          request.renterId === renterId &&
          request.status !== CarRequestStatus.Cancelled &&
          request.status !== CarRequestStatus.Expired,
      );
    }
    const rows = getDatabase().getAllSync<RequestRow>(
      `SELECT * FROM car_requests
       WHERE renter_id = ? AND status NOT IN ('Cancelled', 'Expired')
       ORDER BY id`,
      renterId,
    );
    return rows.map((row) => this.toModel(row));
  }

  createRequest(request: CarRequest): CarRequest {
    const now = new Date();
    if (!canUseSqlite()) {
      const id = request.id || Math.max(...webRequests.map((candidate) => candidate.id), 0) + 1;
      const created = new CarRequest(id, request.renterId, request.budget, request.currency, request.period, request.status, request.createdAt, now);
      webRequests = [...webRequests, created];
      return created;
    }
    const id = request.id || (getDatabase().getFirstSync<{ maxId: number | null }>('SELECT MAX(id) AS maxId FROM car_requests')?.maxId ?? 0) + 1;
    getDatabase().runSync(
      `INSERT INTO car_requests
        (id, renter_id, budget, currency, period_json, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      request.renterId,
      request.budget,
      request.currency,
      JSON.stringify(request.period),
      request.status,
      request.createdAt.toISOString(),
      now.toISOString(),
    );
    return new CarRequest(id, request.renterId, request.budget, request.currency, request.period, request.status, request.createdAt, now);
  }

  deleteRequest(requestId: number): boolean {
    if (!canUseSqlite()) {
      const exists = webRequests.some((request) => request.id === requestId);
      webRequests = webRequests.filter((request) => request.id !== requestId);
      return exists;
    }
    return getDatabase().runSync('DELETE FROM car_requests WHERE id = ?', requestId).changes > 0;
  }

  private toModel(row: RequestRow): CarRequest {
    const period = JSON.parse(row.period_json) as { startDate: string; endDate: string };
    return new CarRequest(
      row.id,
      row.renter_id,
      row.budget,
      row.currency,
      new TimePeriod(new Date(period.startDate), new Date(period.endDate)),
      row.status as CarRequestStatus,
      new Date(row.created_at),
      new Date(row.updated_at),
    );
  }
}
