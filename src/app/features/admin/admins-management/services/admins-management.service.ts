import { ErrorHandler, Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, finalize, retry, shareReplay, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { ApiResponse } from '../../../../core/models/auth.model';
import { ErrorHandlerService, } from '../../../../core/services/error.handler.service';
import { AdminPostData, AdminsQuery, AdminsResponse  } from '../admins.model';

export interface PendingRequest {
  key: string;
  observable: Observable<AdminsResponse>;
}

@Injectable({ providedIn: 'root' })
export class Adminservice {
  private http = inject(HttpClient);
  private BASE_URL = environment.apiUrl + '/portal/api/admins';
  private errorHandler = inject(ErrorHandlerService);
  private pendingRequest: PendingRequest | null = null;

  private handleError = (err: unknown) => {
    this.errorHandler.handle(err);
    return throwError(() => err);
  };


  // ─── GET all Admins (paginated) ──────────────────────
  getAdmins(query: AdminsQuery): Observable<AdminsResponse> {
    const key = JSON.stringify({
      pageIndex: query.pageIndex,
      pageSize: query.pageSize,
      search: query.search ?? null,
      sortBy: query.sortBy ?? null,
      sortDir: query.sortDir ?? null
    });

    if (this.pendingRequest?.key === key) {
      return this.pendingRequest.observable;
    }

    let params = new HttpParams()
      .set('pageIndex', query.pageIndex.toString())
      .set('pageSize', query.pageSize.toString());

    if (query.search) params = params.set('search', query.search);
    if (query.sortBy) params = params.set('sortBy', query.sortBy);
    if (query.sortDir) params = params.set('sortDir', query.sortDir);

    const request$ = this.http
      .get<AdminsResponse>(`${this.BASE_URL}/admin-list`, { params })
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

  createAdminAccount(adminData: AdminPostData): Observable<ApiResponse<void>> {
    return this.http
      .post<ApiResponse<void>>(`${this.BASE_URL}/invite`, adminData)
      .pipe(catchError(this.handleError));
  }
    sendForgetPasswordMail(id:number|string){
    return this.http
      .post<ApiResponse<void>>(`${this.BASE_URL}/${id}/reset-password`, {})
      .pipe(catchError(err => throwError(() => err)));
  }

   deleteAdmin(id:number|string){
    return this.http
      .delete<ApiResponse<void>>(`${this.BASE_URL}/${id}`, {})
      .pipe(catchError(err => throwError(() => err)));
  }

    activate(id: number|string) {
    return this.http.put(`${this.BASE_URL}/${id}/enable`, {});
  }

  deactivate(id: number| string) {
    return this.http.put(`${this.BASE_URL}/${id}/disable`, {});
  }
}