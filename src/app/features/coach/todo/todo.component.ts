import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import {
  ToastService
} from '../../../core/services/toast.service';

import {
  CoachToDoService,
  TaskTemplate,
  TaskTemplateResponse
} from '../services/todo-bookings.service';

@Component({
  selector: 'app-coach-todo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit, OnDestroy {

  private service = inject(CoachToDoService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  private subs: Subscription[] = [];

  // -----------------------------
  // Pagination
  // -----------------------------

  private readonly _pageIndex = signal(0);
  private readonly _pageCount = signal(0);

  readonly pageSize = 10;

  // -----------------------------
  // State
  // -----------------------------

  readonly loading = signal(false);

  readonly hasMore = signal(true);

  // -----------------------------
  // Data
  // -----------------------------

  readonly tasks = signal<TaskTemplate[]>([]);

  readonly isEmpty = computed(() =>
    !this.loading() &&
    this.tasks().length === 0
  );

  ngOnInit(): void {
    window.addEventListener(
      'scroll',
      this.onWindowScroll,
      { passive: true }
    );

    this.loadPage();
  }

  ngOnDestroy(): void {
    window.removeEventListener(
      'scroll',
      this.onWindowScroll
    );

    this.subs.forEach(sub => sub.unsubscribe());
  }

  /**
   * Load first page.
   */
  private resetAndLoad(): void {
    this._pageIndex.set(0);
    this._pageCount.set(0);
    this.tasks.set([]);
    this.hasMore.set(true);

    this.loadPage();
  }

  showTaskDetails(task: TaskTemplate): void {
	this.router.navigate([
	  '/coach/task-details',
	  task.id
	]);
  }
  /**
   * Load next page.
   */
  private loadPage(): void {
    if (
      this.loading() ||
      !this.hasMore()
    ) {
      return;
    }

    this.loading.set(true);

    const pageIndex = this._pageIndex();

    const subscription = this.service
      .getTaskTemplatesForCoach(
        pageIndex,
        this.pageSize
      )
      .subscribe({
        next: (response: TaskTemplateResponse) => {
          const newTasks = response?.data ?? [];

          /*
           * Append instead of replacing.
           */
          this.tasks.update(currentTasks => [
            ...currentTasks,
            ...newTasks
          ]);

          this._pageCount.set(
            response?.pageCount ?? 0
          );

          /*
           * Move to next page.
           */
          this._pageIndex.update(
            index => index + 1
          );

          /*
           * Stop when we reach the last page.
           */
          this.hasMore.set(
            newTasks.length > 0 &&
            this._pageIndex() < this._pageCount()
          );

          this.loading.set(false);
        },

        error: (error: unknown) => {
          console.error(
            'Failed to load task templates',
            error
          );

          this.loading.set(false);

          this.toastService.error(
            'Failed to load tasks'
          );
        }
      });

    this.subs.push(subscription);
  }

  /**
   * Infinite scroll.
   */
  private onWindowScroll = (): void => {
    if (
      this.loading() ||
      !this.hasMore()
    ) {
      return;
    }

    const scrollTop =
      window.scrollY ||
      document.documentElement.scrollTop;

    const viewport =
      window.innerHeight ||
      document.documentElement.clientHeight;

    const fullHeight =
      document.documentElement.scrollHeight;

    const reachedBottom =
      scrollTop + viewport >=
      fullHeight - 300;

    if (reachedBottom) {
      this.loadPage();
    }
  };

  /**
   * Add new task.
   */
  addNewTask(): void {
    this.router.navigate([
      '/coach/todo/add'
    ]);
  }

  trackByTaskId(
    _index: number,
    task: TaskTemplate
  ): number {
    return task.id;
  }
}