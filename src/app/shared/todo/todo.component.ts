import {
  Component,
  OnInit,
  OnDestroy,
  Injector,
  inject,
  signal,
  computed,
  afterNextRender,
} from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

import { AuthService } from "../../core/services/auth.service";

import { SkeletonModule } from "primeng/skeleton";
import {
  CoacheeTask,
  CoachTaskTemplate,
  TaskTemplateResponse,
  ToDoService,
} from "../../features/coach/services/todo-bookings.service";

@Component({
  selector: "app-todo",
  standalone: true,
  imports: [CommonModule, DatePipe, SkeletonModule],
  templateUrl: "./todo.component.html",
  styleUrls: ["./todo.component.scss"],
})
export class TodoComponent implements OnInit, OnDestroy {
  private readonly service = inject(ToDoService);
  public readonly authService = inject(AuthService);

  private readonly router = inject(Router);
  private readonly injector = inject(Injector);

  private readonly subs: Subscription[] = [];

  tabs = ["Pending", "Completed"];
  activeTab = signal<string>("");

  // Used by the initial-loading skeleton @for — kept stable so `track i` is happy.
  readonly skeletonPlaceholders = [1, 2, 3];

  // --------------------------------------------------
  // Role
  // --------------------------------------------------

  readonly isCoach = computed(() => this.authService.isCoach());

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  private readonly _pageIndex = signal(0);
  private readonly _pageCount = signal(0);

  readonly pageSize = 50;

  // --------------------------------------------------
  // State
  // --------------------------------------------------

  readonly loading = signal(false);
  readonly hasMore = signal(true);

  // --------------------------------------------------
  // Data
  // --------------------------------------------------

  tasks = signal<(CoachTaskTemplate | CoacheeTask)[]>([]);

  readonly isEmpty = computed(
    () => !this.loading() && this.tasks().length === 0,
  );

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------

  ngOnInit(): void {
    /*
     * IMPORTANT:
     *
     * Kicking off loadPage() (and the resulting signal writes)
     * synchronously here can race Angular's SSR hydration pass —
     * hydration reconciles this view against its server-rendered
     * snapshot (loading = false, tasks = [], before any data
     * arrived), which can leave the DOM in a mixed state where
     * the skeleton and the empty-state both appear.
     *
     * afterNextRender guarantees this runs only after hydration
     * has fully completed, so there's no race.
     */
    afterNextRender(
      () => {
        window.addEventListener("scroll", this.onWindowScroll, {
          passive: true,
        });

        if (!this.authService.isCoach()) {
          this.activeTab.set("Pending");
        }

        this.loadPage();
      },
      { injector: this.injector },
    );
  }

  ngOnDestroy(): void {
    window.removeEventListener("scroll", this.onWindowScroll);

    this.subs.forEach((sub) => sub.unsubscribe());
  }

  // --------------------------------------------------
  // Reset
  // --------------------------------------------------

  private resetAndLoad(): void {
    this._pageIndex.set(0);
    this._pageCount.set(0);

    this.tasks.set([]);

    this.hasMore.set(true);

    this.loadPage();
  }

  // --------------------------------------------------
  // Task Details
  // --------------------------------------------------

  showTaskDetails(task: CoachTaskTemplate | CoacheeTask): void {
    if ("active" in task) {
      this.router.navigate(["/coach/task-details", task.id], {
        state: { task },
      });
      return;
    }

    this.router.navigate(["/coachee/task-details", task.assignmentId], {
      state: { task },
    });
  }

  // --------------------------------------------------
  // Load Tasks
  // --------------------------------------------------

  private loadPage(): void {
    if (this.loading() || !this.hasMore()) {
      return;
    }

    this.loading.set(true);

    const pageIndex = this._pageIndex();

    const subscription = this.service
      .getTaskTemplates(pageIndex, this.pageSize, this.activeTab())
      .subscribe({
        next: (response: TaskTemplateResponse) => {
          const responseTasks = response?.data ?? [];

          const newTasks = responseTasks.map((task) => this.mapTask(task));

          this.tasks.update((currentTasks) => [...currentTasks, ...newTasks]);

          this._pageCount.set(response?.pageCount ?? 0);

          this._pageIndex.update((index) => index + 1);

          this.hasMore.set(
            newTasks.length > 0 && this._pageIndex() < this._pageCount(),
          );

          this.loading.set(false);
        },

        error: (error: unknown) => {
          console.error("Failed to load tasks", error);

          this.loading.set(false);
        },
      });

    this.subs.push(subscription);
  }

  // --------------------------------------------------
  // Normalize API Response
  // --------------------------------------------------

  private mapTask(
    task: CoachTaskTemplate | CoacheeTask,
  ): CoachTaskTemplate | CoacheeTask {
    if (this.authService.isCoach()) {
      const coachTask = task as CoachTaskTemplate;

      return {
        id: coachTask.id,
        title: coachTask.title,
        description: coachTask.description,
        active: coachTask.active,
        questions: coachTask.questions,
      };
    }

    const coacheeTask = task as CoacheeTask;

    return {
      id: coacheeTask.assignmentId,
      assignmentId: coacheeTask.assignmentId,
      templateId: coacheeTask.templateId,
      title: coacheeTask.title,
      description: coacheeTask.description,
      status: coacheeTask.status,
      dueDate: coacheeTask.dueDate,
      coach: coacheeTask.coach,
    };
  }

  // --------------------------------------------------
  // Infinite Scroll
  // --------------------------------------------------

  private onWindowScroll = (): void => {
    if (this.loading() || !this.hasMore()) {
      return;
    }

    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    const viewport =
      window.innerHeight || document.documentElement.clientHeight;

    const fullHeight = document.documentElement.scrollHeight;

    const reachedBottom = scrollTop + viewport >= fullHeight - 300;

    if (reachedBottom) {
      this.loadPage();
    }
  };

  // --------------------------------------------------
  // Add Task
  // --------------------------------------------------

  addNewTask(): void {
    this.router.navigate(["/coach/todo/add"]);
  }

  // --------------------------------------------------
  // Track By
  // --------------------------------------------------

  taskTrackId(task: CoachTaskTemplate | CoacheeTask): number {
    return this.isCoachTask(task) ? task.id : task.assignmentId;
  }

  isCoachTask(
    task: CoachTaskTemplate | CoacheeTask,
  ): task is CoachTaskTemplate {
    return "active" in task;
  }

  isCoacheeTask(task: CoachTaskTemplate | CoacheeTask): task is CoacheeTask {
    return "assignmentId" in task;
  }

  setTab(tab: string): void {
    if (this.activeTab() === tab) {
      return;
    }

    this.activeTab.set(tab);
    this.resetAndLoad();
  }
}
