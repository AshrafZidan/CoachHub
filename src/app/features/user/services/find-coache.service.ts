import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import { CoachDetail } from '../../admin/coaches-management/Coaches.model';

export interface CoachSearchCriteria {
  name?: string;
  gender?: 'MALE' | 'FEMALE';
  minYearsOfExperience?: number;
  languageIds?: number[];
  coachingIndustryIds?: number[];
}

export interface FindCoachRequest {
  filter: CoachSearchCriteria;
  pageIndex: number;
  pageSize: number;
}

export interface FindCoachResponse {
  data: CoachDetail[];
  pageCount: number;
  pageIndex?: number;
  pageSize?: number;
  totalCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FindCoachService {

  private http = inject(HttpClient);

  private BASE =
    environment.apiUrl + '/mobile/api/coaches';

  getCoaches(
    pageIndex: number,
    pageSize: number,
    filter: CoachSearchCriteria = {}
  ): Observable<FindCoachResponse> {

    const body: FindCoachRequest = {
      filter,
      pageIndex,
      pageSize
    };

    return this.http.post<FindCoachResponse>(
      `${this.BASE}/search`,
      body
    );
  }
}