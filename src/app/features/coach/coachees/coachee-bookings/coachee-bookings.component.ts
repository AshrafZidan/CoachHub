import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  inject,
} from "@angular/core";

import { CommonModule } from "@angular/common";

import { Subject, finalize, takeUntil } from "rxjs";

import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { SkeletonModule } from "primeng/skeleton";

import {
  BookingSession,
  Coachee,
  CoacheeService,
  TaskAssignment,
  TaskAssignmentDetails,
} from "../coach-coachees.service";

type ViewState = "bookings" | "session-detail" | "task-answers";

@Component({
  selector: "app-coachee-bookings-modal",
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule, SkeletonModule],
  templateUrl: "./coachee-bookings.component.html",
  styleUrls: ["./coachee-bookings.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoacheeBookingsComponent implements OnChanges, OnDestroy {
  // =========================================================
  // Dependencies
  // =========================================================

  private readonly coacheeService = inject(CoacheeService);

  private readonly cdr = inject(ChangeDetectorRef);

  private readonly destroy$ = new Subject<void>();

  // =========================================================
  // Inputs / Outputs
  // =========================================================

  @Input() visible = false;

  @Input() coachee: Coachee | null = null;

  @Output() onClose = new EventEmitter<void>();

  // =========================================================
  // Data
  // =========================================================

  bookings: BookingSession[] = [];

  sessionTasks: TaskAssignment[] = [];

  taskAssignmentDetails: TaskAssignmentDetails | null = null;

  // =========================================================
  // Loading
  // =========================================================

  bookingsLoading = false;

  tasksLoading = false;

  answersLoading = false;

  // =========================================================
  // IDs
  // =========================================================

  private coacheeId: number | null = null;

  private loadedCoacheeId: number | null = null;

  private currentBookingId: number | null = null;

  private currentTaskAssignmentId: number | null = null;

  // =========================================================
  // View
  // =========================================================

  currentView: ViewState = "bookings";

  // =========================================================
  // Lifecycle
  // =========================================================

  ngOnChanges(changes: SimpleChanges): void {
    /*
     * Coachee changed.
     */
    if (changes["coachee"]) {
      if (!this.coachee) {
        this.resetState();
        return;
      }

      const newCoacheeId = this.coachee.id;

      /*
       * New coachee.
       */
      if (this.coacheeId !== newCoacheeId) {
        this.coacheeId = newCoacheeId;

        this.resetViewState();

        this.loadBookings();

        return;
      }

      /*
       * Same coachee but modal opened again.
       *
       * We intentionally reload because
       * bookings/tasks may have changed while
       * the modal was closed.
       */
      if (changes["visible"] && changes["visible"].currentValue === true) {
        this.resetViewState();

        this.loadBookings();
      }
    }

    /*
     * Modal opened.
     *
     * Reload the current coachee's bookings.
     */
    if (
      changes["visible"] &&
      changes["visible"].currentValue === true &&
      this.coachee
    ) {
      /*
       * Avoid double loading when the coachee
       * itself changed at the same time.
       */
      if (!changes["coachee"]) {
        this.resetViewState();

        this.loadBookings();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =========================================================
  // Change Detection
  // =========================================================

  private refreshView(): void {
    /*
     * Mark the component and its OnPush view dirty.
     *
     * Angular will render the updated state on
     * the next change-detection pass.
     */
    this.cdr.markForCheck();
  }

  // =========================================================
  // Load Bookings
  // =========================================================

  private loadBookings(): void {
    if (this.coacheeId === null || this.coacheeId === undefined) {
      return;
    }

    if (this.bookingsLoading) {
      return;
    }

    const requestedCoacheeId = this.coacheeId;

    console.log("[CoacheeBookings] Loading bookings:", requestedCoacheeId);

    this.currentView = "bookings";

    this.bookingsLoading = true;

    this.bookings = [];

    this.sessionTasks = [];

    this.taskAssignmentDetails = null;

    this.currentBookingId = null;

    this.currentTaskAssignmentId = null;

    this.refreshView();

    this.coacheeService
      .getCoacheeBookings(requestedCoacheeId)
      .pipe(
        takeUntil(this.destroy$),

        finalize(() => {
          /*
           * Ignore a response belonging to an
           * old coachee.
           */
          if (this.coacheeId !== requestedCoacheeId) {
            return;
          }

          this.bookingsLoading = false;

          this.refreshView();

          console.log(
            "[CoacheeBookings] Bookings loading:",
            this.bookingsLoading,
          );
        }),
      )
      .subscribe({
        next: (res) => {
          if (this.coacheeId !== requestedCoacheeId) {
            return;
          }

          console.log("[CoacheeBookings] Bookings response:", res);

          this.bookings = res?.data ?? [];

          this.loadedCoacheeId = requestedCoacheeId;

          /*
           * This is the important part.
           *
           * API finished -> update state ->
           * tell Angular that OnPush view changed.
           */
          this.refreshView();
        },

        error: (err) => {
          console.error("[CoacheeBookings] Bookings error:", err);

          this.bookings = [];

          this.refreshView();
        },
      });
  }

  // =========================================================
  // Load Session Tasks
  // =========================================================

  private loadSessionDetail(bookingId: number): void {
    if (bookingId === null || bookingId === undefined) {
      return;
    }

    if (this.tasksLoading && this.currentBookingId === bookingId) {
      return;
    }

    console.log("[CoacheeBookings] Loading tasks:", bookingId);

    this.currentBookingId = bookingId;

    this.currentView = "session-detail";

    this.tasksLoading = true;

    this.sessionTasks = [];

    this.taskAssignmentDetails = null;

    this.currentTaskAssignmentId = null;

    this.refreshView();

    this.coacheeService
      .getBookingDetail(bookingId)
      .pipe(
        takeUntil(this.destroy$),

        finalize(() => {
          this.tasksLoading = false;

          this.refreshView();

          console.log("[CoacheeBookings] Tasks loading:", this.tasksLoading);
        }),
      )
      .subscribe({
        next: (res) => {
          console.log("[CoacheeBookings] Tasks response:", res);

          this.sessionTasks = res?.data ?? [];

          this.refreshView();
        },

        error: (err) => {
          console.error("[CoacheeBookings] Tasks error:", err);

          this.sessionTasks = [];

          this.refreshView();
        },
      });
  }

  // =========================================================
  // Load Task Answers
  // =========================================================

  private loadTaskAssignmentAnswers(assignmentId: number): void {
    if (assignmentId === null || assignmentId === undefined) {
      return;
    }

    if (this.answersLoading && this.currentTaskAssignmentId === assignmentId) {
      return;
    }

    console.log("[CoacheeBookings] Loading task answers:", assignmentId);

    this.currentTaskAssignmentId = assignmentId;

    this.currentView = "task-answers";

    this.answersLoading = true;

    this.taskAssignmentDetails = null;

    this.refreshView();

    this.coacheeService
      .getTaskAssignmentDetails(assignmentId)
      .pipe(
        takeUntil(this.destroy$),

        finalize(() => {
          this.answersLoading = false;

          this.refreshView();

          console.log(
            "[CoacheeBookings] Answers loading:",
            this.answersLoading,
          );
        }),
      )
      .subscribe({
        next: (res) => {
          console.log("[CoacheeBookings] Task answers response:", res);

          this.taskAssignmentDetails = res?.data ?? null;

          this.refreshView();
        },

        error: (err) => {
          console.error("[CoacheeBookings] Task answers error:", err);

          this.taskAssignmentDetails = null;

          this.refreshView();
        },
      });
  }

  // =========================================================
  // Actions
  // =========================================================

  openSession(booking: BookingSession): void {
    if (!booking || booking.id === null || booking.id === undefined) {
      return;
    }

    this.loadSessionDetail(booking.id);
  }

  openTaskAnswers(task: TaskAssignment): void {
    if (
      !task ||
      task.assignmentId === null ||
      task.assignmentId === undefined
    ) {
      return;
    }

    this.loadTaskAssignmentAnswers(task.assignmentId);
  }

  // =========================================================
  // Navigation
  // =========================================================

  goBackToBookings(): void {
    console.log("[CoacheeBookings] Back to bookings");

    this.currentView = "bookings";

    this.currentBookingId = null;

    this.currentTaskAssignmentId = null;

    this.taskAssignmentDetails = null;

    this.tasksLoading = false;

    this.answersLoading = false;

    this.refreshView();
  }

  goBackToTasks(): void {
    console.log("[CoacheeBookings] Back to tasks");

    this.currentView = "session-detail";

    this.currentTaskAssignmentId = null;

    this.taskAssignmentDetails = null;

    this.answersLoading = false;

    this.refreshView();
  }

  // =========================================================
  // Close
  // =========================================================

  close(): void {
    this.resetToFirstView();

    this.onClose.emit();
  }

  private resetToFirstView(): void {
    this.currentView = "bookings";

    this.currentBookingId = null;

    this.currentTaskAssignmentId = null;

    this.taskAssignmentDetails = null;

    this.sessionTasks = [];

    this.bookingsLoading = false;

    this.tasksLoading = false;

    this.answersLoading = false;

    this.refreshView();
  }

  // =========================================================
  // Full Reset
  // =========================================================

  private resetState(): void {
    this.coacheeId = null;

    this.loadedCoacheeId = null;

    this.resetToFirstView();

    this.bookings = [];
  }

  // =========================================================
  // Reset View State
  // =========================================================

  private resetViewState(): void {
    this.currentView = "bookings";

    this.currentBookingId = null;

    this.currentTaskAssignmentId = null;

    this.sessionTasks = [];

    this.taskAssignmentDetails = null;

    this.bookingsLoading = false;

    this.tasksLoading = false;

    this.answersLoading = false;

    this.refreshView();
  }

  // =========================================================
  // Date
  // =========================================================

  formatDate(dateStr?: string): string {
    if (!dateStr) {
      return "—";
    }

    const date = new Date(dateStr);

    if (Number.isNaN(date.getTime())) {
      return dateStr;
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // =========================================================
  // Time
  // =========================================================

  formatTime(dateStr?: string): string {
    if (!dateStr) {
      return "—";
    }

    const date = new Date(dateStr);

    if (Number.isNaN(date.getTime())) {
      return dateStr;
    }

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  // =========================================================
  // Duration
  // =========================================================

  formatDuration(minutes: number): string {
    if (!minutes) {
      return "0m";
    }

    if (minutes < 60) {
      return `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);

    const mins = minutes % 60;

    return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
  }

  // =========================================================
  // Task Submit Date
  // =========================================================

  formatTaskSubmitDate(dateStr?: string): string {
    if (!dateStr) {
      return "Not submitted";
    }

    const date = new Date(dateStr);

    if (Number.isNaN(date.getTime())) {
      return dateStr;
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // =========================================================
  // Status
  // =========================================================

  getStatusClass(status?: string): string {
    return (status ?? "").toLowerCase().replace(/\s+/g, "-");
  }

  // =========================================================
  // Booking Helpers
  // =========================================================

  hasDiscount(booking: BookingSession): boolean {
    return (
      booking.discount !== null &&
      booking.discount !== undefined &&
      Number(booking.discount) > 0
    );
  }

  // =========================================================
  // Question Helpers
  // =========================================================

  isTextQuestion(question: any): boolean {
    return question?.type === "TEXT";
  }

  isMultipleChoice(question: any): boolean {
    return question?.type === "MULTIPLE_CHOICE";
  }

  getQuestionAnswer(questionId: number): any {
    const questions = this.taskAssignmentDetails?.questions;

    if (!questions || questions.length === 0) {
      return null;
    }

    return questions.find((question) => question.id === questionId) ?? null;
  }

  isAnswerArray(answer: any): boolean {
    return Array.isArray(answer);
  }
}
