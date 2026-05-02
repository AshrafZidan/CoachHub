import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import {  AvailableSlotsResponse, ReschedulePayload, RescheduleResponse } from '../reschedule.model';

@Injectable({
  providedIn: 'root'
})
export class RescheduleService {
  private readonly BASE_URL = `${environment.apiUrl}/portal`;
  private http = inject(HttpClient);

  /**
   * Get all coach slots (both available and booked)
   * GET /portal/api/coach-slots/{coachId}
   */
  getCoachSlots(
    coachId: number,
    pageIndex: number = 1,
    pageSize: number = 20
  ): Observable<AvailableSlotsResponse> {
    let params = new HttpParams();
    params = params.set('pageIndex', pageIndex.toString());
    params = params.set('pageSize', pageSize.toString());

    return this.http.get<AvailableSlotsResponse>(
      `${this.BASE_URL}/api/coach-slots/${coachId}`,
      { params }
    );
  }

  /**
   * Get available coach slots only
   * GET /portal/api/coach-slots/available/{coachId}
   */
   getAvailableSlots(
    coachId: number | string,
  ): Observable<AvailableSlotsResponse> {
    return this.http.get<AvailableSlotsResponse>(
      `${this.BASE_URL}/api/coach-slots/available/${coachId}`
        );
  }


  /**
   * Reschedule booking to a new slot
   * POST /portal/api/bookings/reschedule
   */
   rescheduleBooking(
    payload: ReschedulePayload
  ): Observable<RescheduleResponse> {
    return this.http.post<RescheduleResponse>(
      `${this.BASE_URL}/api/bookings/reschedule`,
      payload
    );
  }

}