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
export interface ReserveBookingRequest {
  coachId: number;
  coachSlotId: number;
  formAnswers?: {
    challenge?: string;
    whyImportant?: string;
    commitment?: number;
    openToHelp?: boolean;
    triedBefore?: string;
  };
}

export interface ApplyCouponRequest {
  code: string;
  bookingId: number;
}

export interface ApplyCouponResponse {
  discount: number;
  finalPrice: number;
}

export interface ReserveBookingResponse {
  id: number;
}

export interface StripePaymentIntentResponse {
  bookingId: number;
  paymentId: number;
  paymentIntentId: string;
  clientSecret: string;
  amount: number;
  amountMinor: number;
  currency: string;
  status: string;
}

export interface StripePaymentIntentApiResponse {
  httpStatus: string;
  code: string;
  timeStamp: string;
  messageEn: string;
  messageAr: string;
  data: StripePaymentIntentResponse;
  count: number;
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  errors: {
    messageEn: string;
    messageAr: string;
  }[];
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

    reserveBooking(
	request: ReserveBookingRequest
): Observable<ApiResponse<ReserveBookingResponse>> {
	return this.http.post<
		ApiResponse<ReserveBookingResponse>
	>(
		`${this.BASE}/reserve`,
		request
	);
}
applyCoupon(
  request: ApplyCouponRequest
): Observable<ApiResponse<ApplyCouponResponse>> {
  return this.http.post<ApiResponse<ApplyCouponResponse>>(
    `${this.BASE}/apply-coupon`,
    request
  );
}
 deleteCoupon(bookingId: number) {
  return this.http.post(
    `${this.BASE}/delete-coupon/${bookingId}`,{}
  );
}  

createStripePaymentIntent(
  bookingId: number
) {
  return this.http.post<StripePaymentIntentApiResponse>(
    `${environment.apiUrl}/mobile/api/payments/bookings/${bookingId}/stripe-payment-intent`,
    {}
  );
}

}
