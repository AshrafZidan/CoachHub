import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface MobileBooking {
  id: number;
  startTime: string;
  endTime: string;
  periodMinutes: number;
  price: number;
  discount?: number;
  finalPrice?: number;
  coacheeFullName?: string;
  coacheeProfileImageUrl?: string;
  actions?: Array<{ value: string; nameEn: string; nameAr: string }>;
  status?: string;
  statusWrapper?: { nameEn?: string; nameAr?: string };
}
export interface ApiError {
	messageEn: string;
	messageAr: string;
}
export interface StartSessionResponse {
  bookingId: number;
  sessionUrl: string;
  coachAttended: boolean;
  coacheeAttended: boolean;
  coachAttendedAt: string | null;
  coacheeAttendedAt: string | null;
}
export interface ApiResponse<T> {
	httpStatus: string;
	code: string;
	timeStamp: string;
	messageEn: string;
	messageAr: string;
	data: T;
	count?: number;
	pageIndex?: number;
	pageCount?: number;
	pageSize?: number;
	errors?: ApiError[];
}
export interface StartSessionData {
	bookingId: number;
	sessionUrl: string;
	coachAttended: boolean;
	coacheeAttended: boolean;
	coachAttendedAt: string | null;
	coacheeAttendedAt: string | null;
}

export interface BookingAction {
	value: string;
	label?: string;
}
@Injectable({ providedIn: 'root' })
export class UserBookingsService {
  private http = inject(HttpClient);
  private BASE = environment.apiUrl + '/mobile/api/booking';

  upcomingBookings( pageIndex = 0, pageSize = 20): Observable<ApiResponse<MobileBooking[]>> {
    let params = new HttpParams().set('pageIndex', String(pageIndex)).set('pageSize', String(pageSize));
    return this.http.get<ApiResponse<MobileBooking[]>>(`${this.BASE}/upcoming-booking-with-coach`, { params });
  }

  pastBookings(pageIndex = 0, pageSize = 20): Observable<ApiResponse<MobileBooking[]>> {
    let params = new HttpParams().set('pageIndex', String(pageIndex)).set('pageSize', String(pageSize));
    return this.http.get<ApiResponse<MobileBooking[]>>(`${this.BASE}/past-booking-with-coach`, { params });
  }

  cancelBooking(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.BASE}/${id}/cancel-by-coach`, {});
  }

   startSession(bookingId: number): Observable<ApiResponse<StartSessionResponse>> {
    return this.http.post<ApiResponse<StartSessionResponse>>(`${this.BASE}/${bookingId}/start-session`, {});
  }

}
