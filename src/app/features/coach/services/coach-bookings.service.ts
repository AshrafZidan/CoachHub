import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment.development";
import { AuthService } from "../../../core/services/auth.service";

export interface CoachIndustry {
  id: number;
  nameEn: string;
  nameAr: string;
}

export interface BookingAction {
  value: string;
  nameEn?: string;
  nameAr?: string;
  label?: string;
}

export interface MobileBooking {
  id: number;

  startTime: string;
  endTime: string;
  periodMinutes: number;

  price: number;
  discount?: number | null;
  finalPrice?: number | null;

  // =========================================================
  // COACH RESPONSE
  // =========================================================

  coacheeFullName?: string | null;
  coacheeProfileImageUrl?: string | null;

  // =========================================================
  // COACHEE RESPONSE
  // =========================================================

  coachFullNameEn?: string | null;
  coachFullNameAr?: string | null;
  coachProfileImageUrl?: string | null;

  coachIndustries?: CoachIndustry[];

  // =========================================================
  // COMMON
  // =========================================================

  actions?: BookingAction[];

  status?: string;

  statusWrapper?: {
    nameEn?: string;
    nameAr?: string;
  };
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

export interface StartSessionData {
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

@Injectable({
  providedIn: "root",
})
export class CoachBookingsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private readonly BASE = environment.apiUrl + "/mobile/api/booking";

  // =========================================================
  // ROLE
  // =========================================================

  isCoach(): boolean {
    return this.authService.isCoach();
  }

  // =========================================================
  // UPCOMING BOOKINGS
  // =========================================================

  upcomingBookings(
    pageIndex = 0,
    pageSize = 20
  ): Observable<ApiResponse<MobileBooking[]>> {
    const params = new HttpParams()
      .set("pageIndex", String(pageIndex))
      .set("pageSize", String(pageSize));

    const endpoint = this.isCoach()
      ? "upcoming-booking-with-coach"
      : "upcoming-booking-with-coachee";

    return this.http.get<ApiResponse<MobileBooking[]>>(
      `${this.BASE}/${endpoint}`,
      { params }
    );
  }

  // =========================================================
  // PAST BOOKINGS
  // =========================================================

  pastBookings(
    pageIndex = 0,
    pageSize = 20
  ): Observable<ApiResponse<MobileBooking[]>> {
    const params = new HttpParams()
      .set("pageIndex", String(pageIndex))
      .set("pageSize", String(pageSize));

    const endpoint = this.isCoach()
      ? "past-booking-with-coach"
      : "past-booking-with-coachee";

    return this.http.get<ApiResponse<MobileBooking[]>>(
      `${this.BASE}/${endpoint}`,
      { params }
    );
  }

  // =========================================================
  // CANCEL BOOKING
  // =========================================================

  cancelBooking(id: number): Observable<ApiResponse<void>> {
    const endpoint = this.isCoach()
      ? `${id}/cancel-by-coach`
      : `${id}/cancel-by-coachee`;

    return this.http.put<ApiResponse<void>>(`${this.BASE}/${endpoint}`, {});
  }

  // =========================================================
  // START SESSION
  // =========================================================

  startSession(
    bookingId: number
  ): Observable<ApiResponse<StartSessionResponse>> {
    return this.http.post<ApiResponse<StartSessionResponse>>(
      `${this.BASE}/${bookingId}/start-session`,
      {}
    );
  }
}
