import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor() {}
 private http     = inject(HttpClient);
  private BASE_URL = environment.apiUrl + '/portal/api/dashboard';


  getIndustryPaidBookings(filters?: any) {

  return this.http.get( `${this.BASE_URL}/industry-paid-bookings`, {
    params:filters
  });
}

  getBookingStatusCounts(filters?: any) {
    return this.http.get<any>(
      `${this.BASE_URL}/booking-status-counts`,
      { params: filters }
    );
  }

  getCoachBookings(startDate: string, endDate: string, pageIndex: number = 0, pageSize: number = 20) {
    const params: any = {
      pageIndex,
      pageSize
    };
    
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return this.http.get<any>(`${this.BASE_URL}/coach-bookings`, { params });
  }

  getRevenue(filters?: any) {
    const params = {
      startDate: filters?.startDate,
      endDate: filters?.endDate
    };

    return this.http.get(`${this.BASE_URL}/revenue`, { params });
  }

    getCoachTasks(startDate: string, endDate: string, pageIndex: number = 0, pageSize: number = 20) {
    const params: any = {
      pageIndex,
      pageSize
    };
    
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return this.http.get<any>(`${this.BASE_URL}/tasks`, { params });
  }

}