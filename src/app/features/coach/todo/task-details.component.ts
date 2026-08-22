import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  TaskTemplateService,
  TaskAssignmentDetails
} from '../services/task-template.service';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(TaskTemplateService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  assignmentId: number | null = null;

  task: TaskAssignmentDetails | null = null;

  isLoading = true;
  hasError = false;

  ngOnInit(): void {
    this.loadTaskDetails();
  }

  private loadTaskDetails(): void {

    const assignmentIdParam =
      this.route.snapshot.paramMap.get('assignmentId');

    if (!assignmentIdParam) {
 
      this.isLoading = false;
      this.hasError = true;

      this.cdr.markForCheck();

      return;
    }

    const assignmentId = Number(assignmentIdParam);

    if (!Number.isFinite(assignmentId)) {
      console.error(
        '[TaskDetails] Invalid assignmentId:',
        assignmentIdParam
      );

      this.isLoading = false;
      this.hasError = true;

      this.cdr.markForCheck();

      return;
    }

    this.assignmentId = assignmentId;

    this.isLoading = true;
    this.hasError = false;

    this.cdr.markForCheck();

    this.service
      .getTaskAssignmentDetails(assignmentId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading = false;

          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: response => {

       

          this.task = response.data;

          this.hasError = false;

          this.cdr.markForCheck();
        },

        error: error => {

          console.error(
            '[TaskDetails] Failed to load task details',
            error
          );

          this.task = null;
          this.hasError = true;

          this.cdr.markForCheck();
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/coach/bookings']);
  }

  getStatusClass(status: string | null | undefined): string {

    switch (status?.toUpperCase()) {

      case 'COMPLETED':
        return 'completed';

      case 'PENDING':
        return 'pending';

      case 'IN_PROGRESS':
        return 'upcoming';

      case 'OVERDUE':
        return 'failed';

      case 'CANCELLED':
        return 'cancelled';

      default:
        return 'refunded';
    }
  }

  isMultipleChoice(type: string | null | undefined): boolean {
    return type === 'MULTIPLE_CHOICE';
  }

  isSelectedOption(
    question: TaskAssignmentDetails['questions'][number],
    optionId: number
  ): boolean {

    return question.selectedOptionId === optionId;
  }

  formatStatus(status: string | null | undefined): string {

    if (!status) {
      return '';
    }

    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, character =>
        character.toUpperCase()
      );
  }
}