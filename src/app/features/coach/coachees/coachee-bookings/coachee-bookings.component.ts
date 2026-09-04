import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Subject,
  finalize,
  takeUntil,
} from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';

import {
  BookingSession,
  Coachee,
  CoacheeService,
  TaskAssignment,
  TaskAssignmentDetails,
} from '../coach-coachees.service';


type ViewState =
  | 'bookings'
  | 'session-detail'
  | 'task-answers';


@Component({
  selector: 'app-coachee-bookings-modal',

  standalone: true,

  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    SkeletonModule,
  ],

  templateUrl: './coachee-bookings.component.html',

  styleUrls: [
    './coachee-bookings.component.scss',
  ],
})
export class CoacheeBookingsComponent
  implements OnChanges, OnDestroy {

  // =========================================================
  // Dependencies
  // =========================================================

  private readonly coacheeService =
    inject(CoacheeService);

  private readonly cdr =
    inject(ChangeDetectorRef);

  private readonly zone =
    inject(NgZone);

  private readonly destroy$ =
    new Subject<void>();


  // =========================================================
  // Inputs / Outputs
  // =========================================================

  @Input() visible = false;

  @Input() coachee: Coachee | null = null;

  @Output() onClose =
    new EventEmitter<void>();


  // =========================================================
  // Data
  // =========================================================

  bookings: BookingSession[] = [];

  sessionTasks: TaskAssignment[] = [];

  taskAssignmentDetails:
    TaskAssignmentDetails | null = null;


  // =========================================================
  // Loading States
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
  // View State
  // =========================================================

  currentView: ViewState =
    'bookings';


  // =========================================================
  // Lifecycle
  // =========================================================

  ngOnChanges(
    changes: SimpleChanges
  ): void {

    /*
     * Only load bookings when the coachee
     * actually changes.
     *
     * We intentionally DO NOT load bookings
     * when only `visible` changes.
     */

    if (
      changes['coachee'] &&
      this.coachee
    ) {

      const newCoacheeId =
        this.coachee.id;

      /*
       * Same coachee:
       * don't call the API again.
       */
      if (
        this.loadedCoacheeId ===
        newCoacheeId
      ) {
        return;
      }

      this.coacheeId =
        newCoacheeId;

      this.loadBookings();
    }
  }


  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();
  }


  // =========================================================
  // Load Bookings
  // =========================================================

  private loadBookings(): void {

    if (
      this.coacheeId === null ||
      this.coacheeId === undefined
    ) {
      return;
    }

    /*
     * Prevent duplicate request.
     */
    if (this.bookingsLoading) {
      return;
    }

    console.log(
      '[CoacheeBookings] Loading bookings:',
      this.coacheeId
    );


    this.zone.run(() => {

      this.currentView =
        'bookings';

      this.bookingsLoading =
        true;

      this.bookings = [];

      this.sessionTasks = [];

      this.taskAssignmentDetails =
        null;

      this.currentBookingId =
        null;

      this.currentTaskAssignmentId =
        null;

      this.cdr.detectChanges();

    });


    this.coacheeService
      .getCoacheeBookings(
        this.coacheeId
      )

      .pipe(

        takeUntil(
          this.destroy$
        ),

        finalize(() => {

          this.zone.run(() => {

            this.bookingsLoading =
              false;

            this.cdr.detectChanges();

            console.log(
              '[CoacheeBookings] Bookings loading:',
              this.bookingsLoading
            );

          });

        })

      )

      .subscribe({

        next: res => {

          this.zone.run(() => {

            console.log(
              '[CoacheeBookings] Bookings response:',
              res
            );

            this.bookings =
              res.data ?? [];

            /*
             * Remember that this coachee
             * has already been loaded.
             */
            this.loadedCoacheeId =
              this.coacheeId;

            this.cdr.detectChanges();

          });

        },

        error: err => {

          this.zone.run(() => {

            console.error(
              '[CoacheeBookings] Bookings error:',
              err
            );

            this.bookings = [];

            this.cdr.detectChanges();

          });

        },

      });
  }


  // =========================================================
  // Load Session Tasks
  // =========================================================

  private loadSessionDetail(
    bookingId: number
  ): void {

    if (
      bookingId === null ||
      bookingId === undefined
    ) {
      return;
    }

    /*
     * Prevent duplicate request
     * for the same booking.
     */
    if (
      this.tasksLoading &&
      this.currentBookingId ===
      bookingId
    ) {
      return;
    }

    console.log(
      '[CoacheeBookings] Loading tasks:',
      bookingId
    );


    this.zone.run(() => {

      this.currentBookingId =
        bookingId;

      this.currentView =
        'session-detail';

      this.tasksLoading =
        true;

      this.sessionTasks = [];

      this.taskAssignmentDetails =
        null;

      this.currentTaskAssignmentId =
        null;

      this.cdr.detectChanges();

    });


    this.coacheeService
      .getBookingDetail(
        bookingId
      )

      .pipe(

        takeUntil(
          this.destroy$
        ),

        finalize(() => {

          this.zone.run(() => {

            this.tasksLoading =
              false;

            this.cdr.detectChanges();

            console.log(
              '[CoacheeBookings] Tasks loading:',
              this.tasksLoading
            );

          });

        })

      )

      .subscribe({

        next: res => {

          this.zone.run(() => {

            console.log(
              '[CoacheeBookings] Tasks response:',
              res
            );

            this.sessionTasks =
              res.data ?? [];

            this.cdr.detectChanges();

          });

        },

        error: err => {

          this.zone.run(() => {

            console.error(
              '[CoacheeBookings] Tasks error:',
              err
            );

            this.sessionTasks = [];

            this.cdr.detectChanges();

          });

        },

      });
  }


  // =========================================================
  // Load Task Answers
  // =========================================================

  private loadTaskAssignmentAnswers(
    assignmentId: number
  ): void {

    if (
      assignmentId === null ||
      assignmentId === undefined
    ) {
      return;
    }

    /*
     * Prevent duplicate request
     * for the same assignment.
     */
    if (
      this.answersLoading &&
      this.currentTaskAssignmentId ===
      assignmentId
    ) {
      return;
    }

    console.log(
      '[CoacheeBookings] Loading task answers:',
      assignmentId
    );


    this.zone.run(() => {

      this.currentTaskAssignmentId =
        assignmentId;

      this.currentView =
        'task-answers';

      this.answersLoading =
        true;

      this.taskAssignmentDetails =
        null;

      this.cdr.detectChanges();

    });


    this.coacheeService
      .getTaskAssignmentDetails(
        assignmentId
      )

      .pipe(

        takeUntil(
          this.destroy$
        ),

        finalize(() => {

          this.zone.run(() => {

            this.answersLoading =
              false;

            this.cdr.detectChanges();

            console.log(
              '[CoacheeBookings] Answers loading:',
              this.answersLoading
            );

          });

        })

      )

      .subscribe({

        next: res => {

          this.zone.run(() => {

            console.log(
              '[CoacheeBookings] Task answers response:',
              res
            );

            this.taskAssignmentDetails =
              res.data ?? null;

            this.cdr.detectChanges();

          });

        },

        error: err => {

          this.zone.run(() => {

            console.error(
              '[CoacheeBookings] Task answers error:',
              err
            );

            this.taskAssignmentDetails =
              null;

            this.cdr.detectChanges();

          });

        },

      });
  }


  // =========================================================
  // Actions
  // =========================================================

  openSession(
    booking: BookingSession
  ): void {

    if (
      !booking ||
      booking.id === null ||
      booking.id === undefined
    ) {
      return;
    }

    this.loadSessionDetail(
      booking.id
    );
  }


  openTaskAnswers(
    task: TaskAssignment
  ): void {

    if (
      !task ||
      task.assignmentId === null ||
      task.assignmentId === undefined
    ) {
      return;
    }

    this.loadTaskAssignmentAnswers(
      task.assignmentId
    );
  }


  // =========================================================
  // Navigation
  // =========================================================

  goBackToBookings(): void {

    console.log(
      '[CoacheeBookings] Back to bookings'
    );

    this.zone.run(() => {

      this.currentView =
        'bookings';

      this.currentBookingId =
        null;

      this.currentTaskAssignmentId =
        null;

      this.taskAssignmentDetails =
        null;

      /*
       * Do NOT clear bookings.
       *
       * Do NOT call bookings API.
       */

      this.bookingsLoading =
        false;

      this.cdr.detectChanges();

    });
  }


  goBackToTasks(): void {

    console.log(
      '[CoacheeBookings] Back to tasks'
    );

    this.zone.run(() => {

      this.currentView =
        'session-detail';

      this.currentTaskAssignmentId =
        null;

      this.taskAssignmentDetails =
        null;

      /*
       * Do NOT clear sessionTasks.
       *
       * Do NOT call tasks API.
       */

      this.tasksLoading =
        false;

      this.cdr.detectChanges();

    });
  }


  // =========================================================
  // Close
  // =========================================================

  close(): void {
      this.resetToFirstView();

this.onClose.emit();
  }

  private resetToFirstView(): void {

  this.currentView = 'bookings';

  this.currentBookingId = null;

  this.currentTaskAssignmentId = null;

  this.taskAssignmentDetails = null;

  this.sessionTasks = [];

  this.bookingsLoading = false;

  this.tasksLoading = false;

  this.answersLoading = false;

  this.cdr.detectChanges();
}


  // =========================================================
  // Date
  // =========================================================

  formatDate(
    dateStr?: string
  ): string {

    if (!dateStr) {
      return '—';
    }

    const date =
      new Date(dateStr);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return dateStr;
    }

    return date.toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }
    );
  }


  // =========================================================
  // Time
  // =========================================================

  formatTime(
    dateStr?: string
  ): string {

    if (!dateStr) {
      return '—';
    }

    const date =
      new Date(dateStr);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return dateStr;
    }

    return date.toLocaleTimeString(
      'en-US',
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }
    );
  }


  // =========================================================
  // Duration
  // =========================================================

  formatDuration(
    minutes: number
  ): string {

    if (!minutes) {
      return '0m';
    }

    if (minutes < 60) {
      return `${minutes}m`;
    }

    const hours =
      Math.floor(
        minutes / 60
      );

    const mins =
      minutes % 60;

    return mins === 0
      ? `${hours}h`
      : `${hours}h ${mins}m`;
  }


  // =========================================================
  // Task Submit Date
  // =========================================================

  formatTaskSubmitDate(
    dateStr?: string
  ): string {

    if (!dateStr) {
      return 'Not submitted';
    }

    const date =
      new Date(dateStr);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return dateStr;
    }

    return date.toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }
    );
  }


  // =========================================================
  // Status
  // =========================================================

  getStatusClass(
    status?: string
  ): string {

    return (status ?? '')
      .toLowerCase()
      .replace(
        /\s+/g,
        '-'
      );
  }


  // =========================================================
  // Booking Helpers
  // =========================================================

  hasDiscount(
    booking: BookingSession
  ): boolean {

    return (
      booking.discount !== null &&
      booking.discount !== undefined &&
      Number(booking.discount) > 0
    );
  }


  // =========================================================
  // Question Helpers
  // =========================================================

  isTextQuestion(
    question: any
  ): boolean {

    return (
      question?.type === 'TEXT'
    );
  }


  isMultipleChoice(
    question: any
  ): boolean {

    return (
      question?.type ===
      'MULTIPLE_CHOICE'
    );
  }


  getQuestionAnswer(
    questionId: number
  ): any {

    const questions =
      this.taskAssignmentDetails
        ?.questions;

    if (
      !questions ||
      questions.length === 0
    ) {
      return null;
    }

    return questions.find(
      question =>
        question.id === questionId
    ) ?? null;
  }


  isAnswerArray(
    answer: any
  ): boolean {

    return Array.isArray(
      answer
    );
  }
}