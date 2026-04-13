
// src/app/core/services/search.service.ts
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, Observable, shareReplay, throwError } from 'rxjs';
import { ApiError } from '../../../core/models/auth.model';

interface ICountry {
  id: number;
  code: string;
  nameEn: string;
  nameAr: string;
}
interface ICoachingIndustry {
  httpStatus: string;
  code: string;
  timeStamp: string;
  messageEn: string;
  messageAr: string;
  data: [{ id: number; nameEn: string; nameAr: string }];
  count: number;
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  errors: ApiError[];
}
@Injectable({ providedIn: 'root' })
export class LookupsService {
  private http     = inject(HttpClient);
  private BASE_URL = environment.apiUrl + '/portal/api/lookup';

  
private countries$?: Observable<any[]>;
private coachingIndustries$?: Observable<any[]>;
private languages$?: Observable<any[]>;
private coaches$?:Observable<any[]>;


getCountries(): Observable<ICountry[]> {
  if (!this.countries$) {
    this.countries$ = this.http
      .get<ICountry[]>(
        'https://restcountries.com/v3.1/all?fields=name,cca2,flags,idd'
      )
      .pipe(
        shareReplay(1)
      );
  }

  return this.countries$;
}

getCoachingIndustries(): Observable<ICoachingIndustry[]> {
  if (!this.coachingIndustries$) {
    this.coachingIndustries$ = this.http
      .get<ICoachingIndustry[]>(
       this.BASE_URL + '/coaching-industries'
      )
      .pipe(
        shareReplay(1)
      );
  }

  return this.coachingIndustries$;
}
getCoaches():Observable<any[]> {
     if (!this.coaches$) {
    this.coaches$ = this.http
      .get<any[]>(
       environment.apiUrl + 'portal/api/coaches/coaches-lookup'
      )
      .pipe(
        shareReplay(1)
      );
  }

  return this.coaches$;

}
getLanguages(): Observable<any[]> {
  if (!this.languages$) {
    this.languages$ = this.http
      .get<any[]>(
       this.BASE_URL + '/languages'
      )
      .pipe(
        shareReplay(1)
      );
  }

  return this.languages$;
}
}