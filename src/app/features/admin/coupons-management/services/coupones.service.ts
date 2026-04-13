import { ErrorHandler, Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, finalize, retry, shareReplay, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { ApiResponse } from '../../../../core/models/auth.model';
import { ErrorHandlerService, } from '../../../../core/services/error.handler.service';
import { CouponPostData, CouponQuery, CouponsResponse } from '../coupones.model';

export interface PendingRequest {
  key: string;
  observable: Observable<CouponsResponse>;
}

@Injectable({ providedIn: 'root' })
export class CouponsService {
  private http = inject(HttpClient);
  private BASE_URL = environment.apiUrl + '/portal/api/coupons';
  private errorHandler = inject(ErrorHandlerService);
  private pendingRequest: PendingRequest | null = null;

  private handleError = (err: unknown) => {
    this.errorHandler.handle(err);
    return throwError(() => err);
  };


  // ─── GET all coupons (paginated) ──────────────────────
  getCoupons(query: CouponQuery): Observable<CouponsResponse> {
    const key = JSON.stringify({
      pageIndex: query.pageIndex,
      pageSize: query.pageSize,
      name: query.name ?? null,
      sortBy: query.sortBy ?? null,
      sortDir: query.sortDir ?? null
    });

    if (this.pendingRequest?.key === key) {
      return this.pendingRequest.observable;
    }

    let params = new HttpParams()
      .set('pageIndex', query.pageIndex.toString())
      .set('pageSize', query.pageSize.toString());

    if (query.name) params = params.set('name', query.name);
    if (query.sortBy) params = params.set('sortBy', query.sortBy);
    if (query.sortDir) params = params.set('sortDir', query.sortDir);

    const request$ = this.http
      .get<CouponsResponse>(`${this.BASE_URL}/admin-list`, { params })
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

  createCoupon(couponData: CouponPostData): Observable<ApiResponse<void>> {
    return this.http
      .post<ApiResponse<void>>(`${this.BASE_URL}`, couponData)
      .pipe(catchError(this.handleError));
  }
}