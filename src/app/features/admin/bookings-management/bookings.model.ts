
// ─── Booking Status Enum ──────────────────────────────────
export enum PaymentStatus {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  PAID = 'PAID'
  

}
export enum  BookingStatus{
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  UPCOMING= "UPCOMING",
  PAST = "PAST",
  CANCELED="CANCELED"
}

export enum SlotType {
  HALF_HOUR = 'HALF_HOUR',
  ONE_HOUR = 'ONE_HOUR',
  TWO_HOURS = 'TWO_HOURS',
  FULL_DAY = 'FULL_DAY'
}

// ─── Booking Data Model ───────────────────────────────────
export interface Booking {
  id: number;
  startTime: string; // ISO DateTime
  endTime: string; // ISO DateTime
  periodMinutes: number;
  slotType: SlotType;
  price: number;
  discount: number;
  finalPrice: number;
  paymentStatus: PaymentStatus;
  paymentDateTime?: string; // ISO DateTime
  paymentTransaction?: string;
  coachFullNameEn: string;
  coachFullNameAr: string;
  coachEmail: string;
  coachId:number|string;
  coacheeId:number|string;
  coacheeFullName: string;
  coacheeEmail: string;
  bookingStatus:BookingStatus
}

export interface BookingsQuery {
  pageIndex: number;
  pageSize: number;
  sortBy?: string;
  sortDir?: string;

  // 🔍 search
  search?: string;
  transaction?: string;

  // filters
  coachId?: number | null;
  coacheeId?: number | null;
  bookingStatus?: string | null;
  paymentStatus?: string | null;

  startDate?: Date | null;
  endDate?: Date | null;
}

// ─── Booking List Request ─────────────────────────────────
export interface BookingListRequest {
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string; // e.g., "startTime", "paymentStatus"
  sortOrder?: 'asc' | 'desc';
  
  // Filters
  paymentStatus?: PaymentStatus;
  coachEmail?: string;
  coacheeEmail?: string;
  startDate?: string; // ISO Date
  endDate?: string; // ISO Date
  searchTerm?: string; // Search in coach or coachee names/emails
}

// ─── Booking List Response ────────────────────────────────
export interface BookingListResponse extends ApiResponse<Booking[]> {
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  count: number;
}

// ─── Booking Action Request ───────────────────────────────
export interface BookingActionRequest {
  bookingId: number;
  action: 'APPROVE' | 'REJECT' | 'CANCEL' | 'REFUND';
  reason?: string;
}

export interface BookingActionResponse extends ApiResponse<Booking> {}

// ─── Error Response ───────────────────────────────────────
export interface ErrorDetail {
  messageEn: string;
  messageAr: string;
}

export interface ApiResponse<T> {
  httpStatus: string;
  code: string;
  timeStamp: string;
  messageEn: string;
  messageAr: string;
  data: T;
  count?: number;
  pageIndex?: number;
  pageCount?: number;
  pageSize?: number;
  errors?: ErrorDetail[];
}

// ─── Filter Model ─────────────────────────────────────────
export interface BookingFilters {
  paymentStatus?: PaymentStatus | null;
  startDate?: Date | null;
  endDate?: Date | null;
  searchTerm?: string;
  coachEmail?: string;
  coacheeEmail?: string;
}

// ─── Table Column Definition ──────────────────────────────
export interface BookingColumn {
  field: keyof Booking | 'actions';
  header: string;
  sortable: boolean;
  width: string;
  template?: string;
}