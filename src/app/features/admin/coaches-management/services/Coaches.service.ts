import { ErrorHandler, Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, finalize, retry, shareReplay, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { ApiResponse } from '../../../../core/models/auth.model';
import { CoachDetailResponse, CoachesQuery, CoachesResponse } from '../Coaches.model';
import { ErrorHandlerService, } from '../../../../core/services/error.handler.service';
import { error } from 'console';

export interface PendingRequest {
  key: string;
  observable: Observable<CoachesResponse>;
}

@Injectable({ providedIn: 'root' })
export class CoachesService {
  private http     = inject(HttpClient);
  private BASE_URL = environment.apiUrl + '/portal/api/coaches';
  private pendingRequest: PendingRequest | null = null;
  private errorHandler = inject(ErrorHandlerService);

private handleError = (err: unknown) => {
    this.errorHandler.handle(err);
    return throwError(() => err);
  };

  /**
   * Fetches full coach profile by ID.
   * GET /portal/api/coaches/{coachId}
   * Requires: Bearer token (attached by authInterceptor)
   *
   * @param coachId  — numeric coach ID from the list
   * @returns        — Observable<CoachDetailResponse>
   */
   getCoachDetails(coachId: number | string): Observable<CoachDetailResponse> {
    return this.http
      .get<CoachDetailResponse>(`${this.BASE_URL}/${coachId}`)
      .pipe(
        retry({ count: 1, delay: 1000 }),
        catchError(this.handleError)
      );
  }


  // ─── GET all coaches (paginated) ──────────────────────
  getCoaches(query: CoachesQuery): Observable<CoachesResponse> {
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
      .set('pageIndex',     query.pageIndex.toString())
      .set('pageSize', query.pageSize.toString());

    if (query.name)  params = params.set('name',  query.name);
    if (query.sortBy)  params = params.set('sortBy',  query.sortBy);
    if (query.sortDir) params = params.set('sortDir', query.sortDir);

    const request$ = this.http
      .get<CoachesResponse>(`${this.BASE_URL}/admin-list`, { params })
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

  // ─── Activate coach ───────────────────────────────────
  activateCoach(id: number | string): Observable<ApiResponse<void>> {
    return this.http
      .put<ApiResponse<void>>(`${this.BASE_URL}/${id}/enable`, {})
      .pipe(catchError(err => throwError(() => err)));
  }

  // ─── Approve coach with price ─────────────────────────
  approveCoach(id: number | string, prices: any): Observable<ApiResponse<void>> {
    return this.http
      .put<ApiResponse<void>>(`${this.BASE_URL}/approve/${id}`, prices)
      .pipe(catchError(err => throwError(() => err)));
  }

  // ─── Deactivate coach ─────────────────────────────────
  deactivateCoach(id: number | string): Observable<ApiResponse<void>> {
    return this.http
      .put<ApiResponse<void>>(`${this.BASE_URL}/${id}/disable`, {})
      .pipe(catchError(err => throwError(() => err)));
  }

  // ─── Reject coach ─────────────────────────────────────
  rejectCoach(id: number | string): Observable<ApiResponse<void>> {
    return this.http
      .put<ApiResponse<void>>(`${this.BASE_URL}/portal/api/coaches/reject/${id}`, {})
      .pipe(catchError(err => throwError(() => err)));
  }

  // ─── Delete coach ─────────────────────────────────────
  deleteCoach(id: number | string): Observable<ApiResponse<void>> {
    return this.http
      .delete<ApiResponse<void>>(`${this.BASE_URL}/coaches/${id}`)
      .pipe(catchError(err => throwError(() => err)));
  }

  
}