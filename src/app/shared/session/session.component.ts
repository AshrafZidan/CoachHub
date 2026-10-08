import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from "@angular/core";

import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";

import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

import {
  CoacheeService,
  TaskAssignment,
} from "../../features/coach/coachees/coach-coachees.service";

import { DialogModule } from "primeng/dialog";
import { DatePickerModule } from "primeng/datepicker";
import { SelectModule } from "primeng/select";
import { ButtonModule } from "primeng/button";
import { FormsModule } from "@angular/forms";

import {
  CoachTaskTemplate,
  ToDoService,
} from "../../features/coach/services/todo-bookings.service";

import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-session",
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: "./session.component.html",
  styleUrls: ["./session.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly coacheeService = inject(CoacheeService);
  private readonly todoService = inject(ToDoService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  bookingId!: number;

  sessionUrl = "";
  safeSessionUrl!: SafeResourceUrl;

  // --------------------------------------------------
  // Tasks
  // --------------------------------------------------

  loadingTasks = false;
  loadingTaskTemplates = false;
  assigningTask = false;

  showAssignTaskDialog = false;

  assignedTasks: TaskAssignment[] = [];

  taskTemplates: CoachTaskTemplate[] = [];

  selectedTask: CoachTaskTemplate | null = null;

  dueDate: Date | null = null;

  today = new Date();

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------

  ngOnInit(): void {
    this.bookingId = Number(this.route.snapshot.paramMap.get("bookingId"));

    const navigation = this.router.getCurrentNavigation();

    this.sessionUrl =
      navigation?.extras?.state?.["sessionUrl"] ||
      history.state?.sessionUrl ||
      "";

    if (!this.sessionUrl) {
      this.router.navigate(["/coach/bookings"]);
      return;
    }

    this.safeSessionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.sessionUrl,
    );

    this.loadAssignedTasks();

    this.cdr.markForCheck();
  }

  // --------------------------------------------------
  // Assigned Tasks
  // --------------------------------------------------

  private loadAssignedTasks(): void {
    this.loadingTasks = true;

    // Tell OnPush that loading state changed.
    this.cdr.markForCheck();

    this.coacheeService.getBookingDetail(this.bookingId).subscribe({
      next: (res) => {
        this.assignedTasks = res?.data ?? [];
        this.loadingTasks = false;

        /*
         * The API has completed, but the callback may not
         * automatically trigger Angular change detection.
         *
         * markForCheck() makes the new task state visible
         * immediately without requiring a mouse click.
         */
        this.cdr.markForCheck();
      },

      error: () => {
        this.assignedTasks = [];
        this.loadingTasks = false;

        this.cdr.markForCheck();
      },
    });
  }

  // --------------------------------------------------
  // Assign Task Dialog
  // --------------------------------------------------

  assignTask(): void {
    this.selectedTask = null;
    this.dueDate = null;

    this.showAssignTaskDialog = true;

    this.cdr.markForCheck();

    if (!this.taskTemplates.length) {
      this.loadTaskTemplates();
    }
  }

  // --------------------------------------------------
  // Task Templates
  // --------------------------------------------------

  private loadTaskTemplates(): void {
    this.loadingTaskTemplates = true;

    this.cdr.markForCheck();

    this.todoService.getTaskTemplates(null, null).subscribe({
      next: (res) => {
        this.taskTemplates = (res.data ?? []) as CoachTaskTemplate[];

        this.loadingTaskTemplates = false;

        this.cdr.markForCheck();
      },

      error: () => {
        this.taskTemplates = [];
        this.loadingTaskTemplates = false;

        this.cdr.markForCheck();
      },
    });
  }

  // --------------------------------------------------
  // Assign Selected Task
  // --------------------------------------------------

  assignSelectedTask(): void {
    if (!this.selectedTask || !this.dueDate) {
      return;
    }

    this.assigningTask = true;

    this.cdr.markForCheck();

    const request = {
      taskTemplateId: this.selectedTask.id,
      bookingId: this.bookingId,
      dueDate: this.formatDate(this.dueDate),
    };

    this.coacheeService.assignTaskToBooking(request).subscribe({
      next: () => {
        /*
         * Reset the dialog state first.
         */
        this.assigningTask = false;
        this.showAssignTaskDialog = false;

        this.selectedTask = null;
        this.dueDate = null;

        /*
         * Immediately update the UI.
         */
        this.cdr.markForCheck();

        /*
         * Reload the assigned tasks.
         */
        this.loadAssignedTasks();
      },

      error: () => {
        this.assigningTask = false;

        this.cdr.markForCheck();
      },
    });
  }

  // --------------------------------------------------
  // Session
  // --------------------------------------------------

  endSession(): void {
    // Call your end-session API here.
  }

  backToBookings(): void {
    this.router.navigate(["/coach/bookings"]);
  }

  // --------------------------------------------------
  // Date
  // --------------------------------------------------

  private formatDate(date: Date): string {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // --------------------------------------------------
  // User
  // --------------------------------------------------

  get isCoach(): boolean {
    return this.authService.isCoach();
  }
}
