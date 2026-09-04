import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { TaskTemplate } from '../services/todo-bookings.service';


@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDetailsComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  task: TaskTemplate | null = null;

  isLoading = true;
  hasError = false;

  ngOnInit(): void {
    this.loadTaskFromState();
  }

  private loadTaskFromState(): void {

    const navigation = this.router.getCurrentNavigation();

    const taskFromNavigation =
      navigation?.extras?.state?.['task'];

    const taskFromHistory =
      history.state?.task;

    this.task =
      taskFromNavigation ??
      taskFromHistory ??
      null;

    this.isLoading = false;

    if (!this.task) {

      this.hasError = true;

      console.error(
        '[TaskDetails] No task data was provided'
      );

    } else {

      this.hasError = false;

    }

    this.cdr.markForCheck();
  }

  goBack(): void {

    this.router.navigate([
      '/coach/todo'
    ]);

  }

  isMultipleChoice(
    type: string | null | undefined
  ): boolean {

    return type === 'MULTIPLE_CHOICE';

  }

}