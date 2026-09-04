import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface TaskTemplate {
  id: number;
  title: string;
  description: string;
  active: boolean;
  questions: TaskQuestion[];
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

export interface TaskTemplateResponse {
  httpStatus: string;
  code: string;
  timeStamp: string;
  messageEn: string;
  messageAr: string;
  data: TaskTemplate[];
  count: number;
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  errors: {
    messageEn: string;
    messageAr: string;
  }[];
}

@Injectable({ providedIn: 'root' })
export class CoachToDoService {
  private http = inject(HttpClient);
  private BASE = environment.apiUrl + '/mobile/api/task-template/';

 getTaskTemplatesForCoach(
  pageIndex: number | null = 0,
  pageSize: number | null = 50
): Observable<TaskTemplateResponse> {

  const params: Record<string, string> = {};

  if (pageIndex !== null) {
    params['pageIndex'] = pageIndex.toString();
  }

  if (pageSize !== null) {
    params['pageSize'] = pageSize.toString();
  }

  return this.http.get<TaskTemplateResponse>(
    this.BASE + 'get-for-coach',
    { params }
  );
}
}
