import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment.development";
import { AuthService } from "../../../core/services/auth.service";

export interface CoachTaskTemplate {
  id: number;
  title: string;
  description: string;
  active: boolean;
  questions: TaskQuestion[];
}

export interface CoacheeTask {
  assignmentId: number;
  templateId: number;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  coach: {
    profileImageUrl?: string;
    fullNameEn: string;
    fullNameAr?: string;
  };
}

export interface TaskQuestion {
  id: number;
  questionText: string;
  type: string;
  required: boolean;
  orderIndex: number;
  options: TaskOption[];
}

export interface TaskOption {
  id: number;
  optionText: string;
}

export interface TaskDetails {
  id: number;
  title: string;
  description: string;

  // Coach
  active?: boolean;

  // Coachee
  assignmentId?: number;
  templateId?: number;
  status?: string;
  dueDate?: string;
  coach?: {
    profileImageUrl?: string;
    fullNameEn: string;
    fullNameAr?: string;
  };

  questions: TaskQuestion[];
}

/**
 * Question returned from the coachee assignment-details API.
 *
 * Both SINGLE_CHOICE and MULTIPLE_CHOICE now use
 * a single selectedOptionId.
 */
export interface TaskAssignmentQuestion extends TaskQuestion {
  answerText?: string;
  selectedOptionId?: number;
  selectedOptionText?: string;
}

export interface TaskAssignmentDetails {
  assignmentId: number;
  status: string;
  dueDate: string;
  templateId: number;
  title: string;
  description: string;
  questions: TaskAssignmentQuestion[];
}

export interface TaskAssignmentDetailsResponse {
  httpStatus: string;
  code: string;
  timeStamp: string;
  messageEn: string;
  messageAr: string;
  data: TaskAssignmentDetails;
  count: number;
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  errors: {
    messageEn: string;
    messageAr: string;
  }[];
}

export interface TaskTemplateResponse {
  httpStatus: string;
  code: string;
  timeStamp: string;
  messageEn: string;
  messageAr: string;
  data: CoachTaskTemplate[] | CoacheeTask[];
  count: number;
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  errors: {
    messageEn: string;
    messageAr: string;
  }[];
}

export interface SubmitTaskAnswersRequest {
  assignmentId: number;
  answers: SubmitTaskAnswer[];
}

export interface SubmitTaskAnswer {
  questionId: number;
  answerText?: string;
  selectedOptionId?: number;
}

@Injectable({
  providedIn: "root",
})
export class ToDoService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly BASE = environment.apiUrl + "/mobile/api/task-template/";

  getTaskTemplates(
    pageIndex: number | null = 0,
    pageSize: number | null = 50,
    status?: string,
  ): Observable<TaskTemplateResponse> {
    const params: Record<string, string> = {};

    if (pageIndex !== null) {
      params["pageIndex"] = pageIndex.toString();
    }

    if (pageSize !== null) {
      params["pageSize"] = pageSize.toString();
    }

    if (status) {
      params["status"] = status.toLocaleLowerCase();
    }

    const endpoint = this.authService.isCoach()
      ? "get-for-coach"
      : "get-for-coachee";

    return this.http.get<TaskTemplateResponse>(this.BASE + endpoint, {
      params,
    });
  }

  getTaskAssignmentDetails(
    assignmentId: number,
  ): Observable<TaskAssignmentDetailsResponse> {
    return this.http.get<TaskAssignmentDetailsResponse>(
      `${this.BASE}get-task-assignment-details/${assignmentId}`,
    );
  }

  submitTaskAnswers(request: SubmitTaskAnswersRequest): Observable<unknown> {
    return this.http.post(`${this.BASE}submit-answer`, request);
  }
}
