import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';

import {
  BookingSession,
  Coachee,
  CoacheeService
} from '../coach-coachees.service';

@Component({
  selector: 'app-coachee-bookings-modal',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    SkeletonModule
  ],
  templateUrl: './coachee-bookings.component.html',
  styleUrls: ['./coachee-bookings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoacheeBookingsComponent
  implements OnChanges, OnDestroy {

  private coacheeService = inject(CoacheeService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  // =========================================================
  // Inputs
  // =========================================================

  @Input() visible = false;
  @Input() coachee: Coachee | null = null;

  // =========================================================
  // Outputs
  // =========================================================

  @Output() onClose = new EventEmitter<void>();

  // =========================================================
  // Data
  // =========================================================

  bookings: BookingSession[] = [];
  loading = false;

  private coacheeId: number | null = null;

  // =========================================================
  // Lifecycle
  // =========================================================

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['coachee'] && this.coachee) {

      this.coacheeId = this.coachee.id;

      this.loadBookings();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =========================================================
  // API
  // =========================================================

  private loadBookings(): void {

    if (!this.coacheeId) {
      return;
    }

    this.loading = true;
    this.bookings = [];

    this.cdr.markForCheck();

    this.coacheeService
      .getCoacheeBookings(this.coacheeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {

          this.bookings = res.data ?? [];
          this.loading = false;
          this.cdr.markForCheck();
        },

        error: err => {

          console.error('Bookings error:', err);

          this.bookings = [];
          this.loading = false;

          this.cdr.markForCheck();
        }
      });
  }

  // =========================================================
  // Actions
  // =========================================================

  openSession(booking: BookingSession): void {
    console.log('Open session:', booking);
  }

  close(): void {
    this.onClose.emit();
  }

  // =========================================================
  // Helpers
  // =========================================================

  getStatusClass(status: string): string {
    return status
      ?.toLowerCase()
      ?.replace(/\s+/g, '-') ?? '';
  }

 

 formatDuration(minutes: number): string {

  if (!minutes) {
    return '0m';
  }

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}


  hasDiscount(booking: BookingSession): boolean {
  return booking.discount !== null &&
         booking.discount !== undefined &&
         Number(booking.discount) > 0;
}
}