import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, finalize, from, Observable, shareReplay, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { ApiResponse, BookingListRequest, BookingListResponse, BookingsQuery } from '../bookings.model';
import { ErrorHandlerService } from '../../../../core/services/error.handler.service';

export interface PendingRequest {
  key: string;
  observable: Observable<BookingListResponse>;
}
@Injectable({ providedIn: 'root' })
export class BookingsService {
 private errorHandler = inject(ErrorHandlerService);
  private pendingRequest: PendingRequest | null = null;

  private handleError = (err: unknown) => {
    this.errorHandler.handle(err);
    return throwError(() => err);
  };

  private BASE_URL = environment.apiUrl + '/portal/api/bookings';
  private http = inject(HttpClient);

  /**
   * Get list of bookings with pagination, filtering, and sorting
   */
  getBookings(query: BookingsQuery): Observable<BookingListResponse> {

  const key = JSON.stringify({
    pageIndex: query.pageIndex,
    pageSize: query.pageSize,
    sortBy: query.sortBy ?? null,
    sortDir: query.sortDir ?? null,

    coachId: query.coachId ?? null,
    coacheeId: query.coacheeId ?? null,
    bookingStatus: query.bookingStatus ?? null,
    paymentStatus: query.paymentStatus ?? null,
    startDate: query.startDate ?? null,
    endDate: query.endDate ?? null
  });

  if (this.pendingRequest?.key === key) {
    return this.pendingRequest.observable;
  }

  let params = new HttpParams()
    .set('pageIndex', query.pageIndex.toString())
    .set('pageSize', query.pageSize.toString());


  if (query.sortBy) params = params.set('sortBy', query.sortBy);
  if (query.sortDir) params = params.set('sortDir', query.sortDir);

  if (query.coachId) params = params.set('coachId', query.coachId);
  if (query.coacheeId) params = params.set('coacheeId', query.coacheeId);
  if (query.bookingStatus) params = params.set('bookingStatus', query.bookingStatus);
  if (query.paymentStatus) params = params.set('paymentStatus', query.paymentStatus);

 if (query.startDate) {
  params = params.set('startDate', String(query.startDate));
}

if (query.endDate) {
  params = params.set('endDate', String(query.endDate));
}
  const request$ = this.http
    .get<BookingListResponse>(`${this.BASE_URL}/admin-list`, { params })
    .pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
      finalize(() => {
        if (this.pendingRequest?.key === key) {
          this.pendingRequest = null;
        }
      }),
      catchError(err => throwError(() => err))
    );

  this.pendingRequest = { key, observable: request$ };

  return request$;
}
  refundBooking(id: number | string): Observable<ApiResponse<void>> {
    return this.http
      .put<ApiResponse<void>>(`${this.BASE_URL}/${id}/refund`, {})
      .pipe(catchError(err => throwError(() => err)));
  }
  cancelBooking(id: number | string): Observable<ApiResponse<void>> {
    return this.http
      .put<ApiResponse<void>>(`${this.BASE_URL}/${id}/cancel`, {})
      .pipe(catchError(err => throwError(() => err)));
  }
   

}