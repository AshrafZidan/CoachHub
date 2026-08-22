export type TaskQuestionType = 'TEXT' | 'MULTIPLE_CHOICE';

export interface TaskTemplateOption {
  optionText: string;
}

export interface TaskTemplateQuestion {
  questionText: string;
  type: TaskQuestionType;
  required: boolean;
  orderIndex: number;
  options: TaskTemplateOption[];
}

export interface CreateTaskTemplateRequest {
  title: string;
  description: string;
  questions: TaskTemplateQuestion[];
}

/**
 * Represents the value coming from the Angular form.
 */
export interface TaskFormOption {
  optionText: string;
}

export interface TaskFormQuestion {
  questionText: string;
  type: TaskQuestionType;
  required: boolean;
  orderIndex: number;
  options: TaskFormOption[];
}

export interface TaskFormValue {
  title: string;
  description: string;
  questions: TaskFormQuestion[];
}
export interface TaskAssignmentOption {
  id: number;
  optionText: string;
}

export interface TaskAssignmentQuestion {
  id: number;
  questionText: string;
  type: string;
  required: boolean;
  options: TaskAssignmentOption[];
  answerText: string | null;
  selectedOptionId: number | null;
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
  errors: Array<{
    messageEn: string;
    messageAr: string;
  }>;
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TaskTemplateService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl + '/mobile/api/task-template';

  /**
   * Creates a new task template.
   */
  createTaskTemplate(
    payload: CreateTaskTemplateRequest
  ): Observable<CreateTaskTemplateRequest> {

    return this.http.post<CreateTaskTemplateRequest>(
      this.baseUrl,
      payload
    );
  }
  getTaskAssignmentDetails(
  assignmentId: number
) {
  return this.http.get<TaskAssignmentDetailsResponse>(
    this.baseUrl + `/get-task-assignment-details/${assignmentId}`
  );
}
}