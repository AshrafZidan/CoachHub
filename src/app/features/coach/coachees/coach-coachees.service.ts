import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface ApiResponse<T> {
  httpStatus?: string;
  code?: string;
  messageEn?: string;
  messageAr?: string;
  data?: T;
  count?: number;
  pageIndex?: number;
  pageCount?: number;
  pageSize?: number;
  errors?: Array<{
    messageEn?: string;
    messageAr?: string;
  }>;
}

// =========================================================
// Coachee
// =========================================================

export interface Coachee {
  id: number;
  fullName: string;
  birthDate?: string;
  profileImageUrl?: string;
  bookingCount: number;
  lastBookingDate?: string;
}

// =========================================================
// Booking / Session
// =========================================================

export interface BookingSession {
  id: number;
  title?: string;
  startTime: string;
  endTime: string;
  discount: number;
  price: number;
  finalPrice: number;
  periodMinutes: number;
  paymentStatus: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

// =========================================================
// Task Assignment
// Response from:
// GET /mobile/api/task-template/get-by-booking/{bookingId}
// =========================================================

export interface TaskAssignment {
  assignmentId: number;
  templateId: number;
  title: string;
  description?: string;
  status: 'PENDING' | 'COMPLETED';
  dueDate?: string;

  coach?: {
    profileImageUrl?: string;
    fullNameEn?: string;
    fullNameAr?: string;
  };
}

// =========================================================
// Task Assignment Details
// Response from:
// GET /task-template/get-task-assignment-details/{assignmentId}
// =========================================================

export interface TaskAssignmentDetails {
  assignmentId: number;
  templateId: number;
  title: string;
  description?: string;
  status: string;
  dueDate?: string;

  coach?: {
    profileImageUrl?: string;
    fullNameEn?: string;
    fullNameAr?: string;
  };

  questions?: TaskQuestion[];

  answers?: TaskAnswer[];
}

// =========================================================
// Task Question
// =========================================================

export interface TaskQuestion {
  id: number;
  questionText: string;
  type: string;
  required: boolean;

  options?: TaskQuestionOption[];
}

// =========================================================
// Task Question Option
// =========================================================

export interface TaskQuestionOption {
  id: number;
  optionText: string;
}

// =========================================================
// Task Answer
// =========================================================

export interface TaskAnswer {
  questionId: number;
  answerText?: string | string[];
  selectedOptionId?: number | null;
}

// =========================================================
// Session Detail
// =========================================================

export interface SessionDetail extends BookingSession {
  coacheeId?: number;
  coacheeName?: string;
  notes?: string;
}

export interface AssignTaskRequest {
	taskTemplateId: number;
	bookingId: number;
	dueDate: string;
}
// =========================================================
// Service
// =========================================================

@Injectable({
  providedIn: 'root'
})
export class CoacheeService {

  private http = inject(HttpClient);

  private baseUrl = environment.apiUrl;

  // =========================================================
  // Coachees
  // =========================================================

  /**
   * GET /mobile/api/coachees/get-for-coach
   *
   * Fetch coach's coachees with optional search.
   */
  getCoachees(
    pageIndex = 0,
    pageSize = 12,
    name?: string
  ): Observable<ApiResponse<Coachee[]>> {

    let params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize);

    if (name) {
      params = params.set('name', name);
    }

    return this.http.get<ApiResponse<Coachee[]>>(
      `${this.baseUrl}/mobile/api/coachees/get-for-coach`,
      { params }
    );
  }

  // =========================================================
  // Bookings
  // =========================================================

  /**
   * GET /mobile/api/booking/all-coachee-booking-with-coach/{coacheeId}
   *
   * Fetch all bookings for a specific coachee.
   */
  getCoacheeBookings(
    coacheeId: number
  ): Observable<ApiResponse<BookingSession[]>> {

    return this.http.get<ApiResponse<BookingSession[]>>(
      `${this.baseUrl}/mobile/api/booking/all-coachee-booking-with-coach/${coacheeId}`
    );
  }

  // =========================================================
  // Session Tasks
  // =========================================================

  /**
   * GET /mobile/api/task-template/get-by-booking/{bookingId}
   *
   * Fetch tasks assigned to a specific booking/session.
   *
   * IMPORTANT:
   * The API returns an ARRAY of TaskAssignment.
   */
  getBookingDetail(
    bookingId: number
  ): Observable<ApiResponse<TaskAssignment[]>> {

    return this.http.get<ApiResponse<TaskAssignment[]>>(
      `${this.baseUrl}/mobile/api/task-template/get-by-booking/${bookingId}`
    );
  }

  // =========================================================
  // Task Assignment Details
  // =========================================================

  /**
   * GET /task-template/get-task-assignment-details/{assignmentId}
   *
   * Fetch task details and client's answers.
   */
  getTaskAssignmentDetails(
    assignmentId: number
  ): Observable<ApiResponse<TaskAssignmentDetails>> {

    return this.http.get<ApiResponse<TaskAssignmentDetails>>(
      `${this.baseUrl}/mobile/api/task-template/get-task-assignment-details/${assignmentId}`
    );
  }
    assignTaskToBooking(request: AssignTaskRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/mobile/api/task-template/assign-to-booking`, 
      request
    );
  }
  
}