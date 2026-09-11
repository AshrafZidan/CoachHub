import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CoachDetail } from '../../admin/coaches-management/Coaches.model';

export interface ApiResponse<T> {
  httpStatus?: string;
  code?: string;
  timeStamp?: string;
  messageEn?: string;
  messageAr?: string;
  data?: T;
  count?: number;
  errors?: Array<{ messageEn?: string; messageAr?: string }>;
}



export interface Slot {
  id: number;
  startTimeUtc: string;
  endTimeUtc: string;
  periodMinutes: number;
  status: 'AVAILABLE' | 'BOOKED' | 'UNAVAILABLE';
}

export interface SlotData {
  date: string;   // "YYYY-MM-DD"
  slots: Slot[];
}

export type SlotResponse = SlotData[];

@Injectable({ providedIn: 'root' })
export class CoachProfileService {
  private http    = inject(HttpClient);
  private baseUrl = environment.apiUrl;


  /**
   * GET /mobile/api/coach-slot/by-month-and-year
   * Fetch ALL slots for a coach in a given month.
   * Call once per month; cache result in the component.
   */
  getSlotsByMonthAndYear(
    coachId: number | string,
    month: number,
    year: number
  ): Observable<ApiResponse<SlotResponse>> {
    const params = new HttpParams()
      .set('month', month)
      .set('year', year);

    return this.http.get<ApiResponse<SlotResponse>>(
      `${this.baseUrl}/mobile/api/coach-slot/by-month-and-year`,
      { params }
    );
  }

  /**
   * GET /mobile/api/coach-slot/available/{coachId}
   * Legacy per-day endpoint — kept for the "Add More" dialog fallback.
   */
  getAvailableSlots(
    coachId: number | string,
    date?: string
  ): Observable<ApiResponse<SlotResponse>> {
    let params = new HttpParams();
    if (date) params = params.set('date', date);

    return this.http.get<ApiResponse<SlotResponse>>(
      `${this.baseUrl}/mobile/api/coach-slot/available/${coachId}`,
      { params }
    );
  }

    getSlots(
    coachId: number | string,
    date?: string
  ): Observable<ApiResponse<SlotResponse>> {
    let params = new HttpParams();
    if (date) params = params.set('date', date);

    return this.http.get<ApiResponse<SlotResponse>>(
      `${this.baseUrl}/mobile/api/coach-slot/available/${coachId}`,
      { params }
    );
  }

  deleteSlot(
    slotId: number | string,
  ): Observable<ApiResponse<SlotResponse>> {
    return this.http.delete<ApiResponse<SlotResponse>>(
      `${this.baseUrl}/mobile/api/coach-slot/${slotId}`
    );
  }


 addSlot(payload: { startTime: string; slotType: string }) : Observable<ApiResponse<SlotResponse>> {
  return this.http.post<ApiResponse<SlotResponse>>(
    `${this.baseUrl}/mobile/api/coach-slot`,
    payload
  );
}

 getProfileDetails() : Observable<ApiResponse<CoachDetail>> {
  return this.http.get<ApiResponse<CoachDetail>>(
    `${this.baseUrl}/mobile/api/coaches/profile`
  );
}
}