import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor() {}
 private http     = inject(HttpClient);
  private BASE_URL = environment.apiUrl + '/portal/api/dashboard';


  getIndustryPaidBookings(startDate: string, endDate: string) {
  const params = {
    startDate,
    endDate
  };

  return this.http.get( `${this.BASE_URL}/industry-paid-bookings`, {
    params
  });
}

  getBookingStatusCounts(filters?: any) {
    return this.http.get<any>(
      `${this.BASE_URL}/booking-status-counts`,
      { params: filters }
    );
  }
}