import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface ApiResponse<T> {
  httpStatus?: string;
  code?: string;
  messageEn?: string;
  messageAr?: string;
  data?: T;
  count?: number;
  pageIndex?: number;
  pageCount?: number;
  pageSize?: number;
  errors?: Array<{ messageEn?: string; messageAr?: string }>;
}

export interface Coachee {
  id: number;
  fullName: string;
  birthDate?: string;
  profileImageUrl?: string;
  bookingCount: number;
  lastBookingDate?: string;
}

export interface BookingSession {
  id: number;

  startTime: string;
  endTime: string;

  periodMinutes: number;

  paymentStatus: string;

  price: number;

  discount: number | null;

  finalPrice: number;

  status: string;

  statusWrapper?: {
    nameEn: string;
    nameAr: string;
  };
}

export interface TaskAssignment {
  id: number;
  taskId: number;
  taskTitle: string;
  status: 'PENDING' | 'COMPLETED';
  submittedDate?: string;
}

export interface SessionDetail extends BookingSession {
  coacheeId: number;
  coacheeName: string;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class CoacheeService {
  private http    = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  /**
   * GET /mobile/api/coachees/get-for-coach
   * Fetch coach's coachees with optional search
   */
  getCoachees(
    pageIndex = 0,
    pageSize  = 12,
    name?: string
  ): Observable<ApiResponse<Coachee[]>> {
    let params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize);

    if (name) params = params.set('name', name);

    return this.http.get<ApiResponse<Coachee[]>>(
      `${this.baseUrl}/mobile/api/coachees/get-for-coach`,
      { params }
    );
  }

  /**
   * GET /mobile/api/coachees/{coacheeId}/bookings
   * Fetch all bookings for a specific coachee
   */
  getCoacheeBookings(coacheeId: number): Observable<ApiResponse<BookingSession[]>> {
    return this.http.get<ApiResponse<BookingSession[]>>(
      `${this.baseUrl}/mobile/api/booking/all-coachee-booking-with-coach/${coacheeId}`
    );
  }

  /**
   * GET /mobile/api/bookings/{bookingId}
   * Fetch detailed booking info with assigned tasks
   */
  getBookingDetail(bookingId: number): Observable<ApiResponse<SessionDetail>> {
    return this.http.get<ApiResponse<SessionDetail>>(
      `${this.baseUrl}/mobile/api/bookings/${bookingId}`
    );
  }
}