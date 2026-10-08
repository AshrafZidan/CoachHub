import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment.development";
export type PaymentStatus = "ACCEPTED" | "INPROGRESS" | "REJECTED";
export interface PaymentStatusResponse {
  httpStatus: string;
  code: string;
  timeStamp: string;
  messageEn: string;
  messageAr: string;
  data: PaymentStatus;
  count: number;
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  errors: Array<{ messageEn: string; messageAr: string }>;
}
@Injectable({ providedIn: "root" })
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  getPaymentStatus(paymentId: number): Observable<PaymentStatusResponse> {
    return this.http.get<PaymentStatusResponse>(
      `${this.baseUrl}/mobile/api/payments/${paymentId}/status`,
    );
  }
}
