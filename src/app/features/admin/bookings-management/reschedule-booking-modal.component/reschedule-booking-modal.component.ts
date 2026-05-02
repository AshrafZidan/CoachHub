import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  DestroyRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Booking } from '../bookings.model';
import { RescheduleService } from '../services/reschedule.model.service';
import { AvailableSlotsDay, CoachSlot } from '../reschedule.model';

import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-reschedule-booking-modal',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    DatePickerModule,
    ButtonModule,
    FormsModule
],
  templateUrl: './reschedule-booking-modal.html',
  styleUrls: ['./reschedule-booking-modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RescheduleBookingModalComponent implements OnChanges {

  // ─── Services ─────────────────────
  private readonly service = inject(RescheduleService);
  private readonly destroyRef = inject(DestroyRef);

  // ─── Inputs ───────────────────────
  @Input() visible: boolean = false;
  @Input() booking: Booking | null = null;

  // ─── Outputs ──────────────────────
  @Output() onClose = new EventEmitter<void>();
  @Output() onRescheduleComplete = new EventEmitter<Booking>();

  // ─── State ────────────────────────
  isLoading = signal(false);
  isSubmitting = signal(false);

  selectedDate = signal<Date | null>(null);
  selectedSlot = signal<CoachSlot | null>(null);
  availableDays = signal<AvailableSlotsDay[]>([]);

  // ─── Computed ─────────────────────
  slotsForSelectedDate = computed(() => {
    const date = this.selectedDate();
    if (!date) return [];

    const now = new Date();
    const dateStr = this.formatDate(date);

    return (
      this.availableDays()
        .find(d => d.date === dateStr)
        ?.slots.filter(
          s =>
            s.status === 'AVAILABLE' 
        ) || []
    );
  });

  canSubmit = computed(() => !!this.selectedSlot());

  // ─── Lifecycle ────────────────────
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      if (this.visible && this.booking) {
        this.loadSlots();
      }

      if (!this.visible) {
        this.reset();
      }
    }
  }

  // ─── API Calls ────────────────────
  loadSlots(): void {
    if (!this.booking) return;

    this.isLoading.set(true);
    this.service
      .getAvailableSlots(this.booking.coachId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.isLoading.set(false);

          const mapped = res.data.map(d => ({
            date: d.date,
            slots: d.slots.map(s => ({
              ...s,
              slotType: s.slotType ?? 'SESSION'
            }))
          }));

          this.availableDays.set(mapped);

          if (mapped.length) {
            this.selectedDate.set(new Date(mapped[0].date));
          }
        },
        error: () => this.isLoading.set(false)
      });
  }

  submit(): void {
    if (!this.booking || !this.selectedSlot()) return;

    this.isSubmitting.set(true);

    this.service
      .rescheduleBooking({
        bookingId: this.booking.id,
        coachSlotId: this.selectedSlot()!.id
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.isSubmitting.set(false);

          this.onRescheduleComplete.emit({
            ...this.booking!,
            startTime: res.data.startTime,
            endTime: res.data.endTime
          });

          this.close();
        },
        error: () => this.isSubmitting.set(false)
      });
  }

  // ─── Actions ──────────────────────
  selectDate(date: Date): void {
    this.selectedDate.set(date);
    this.selectedSlot.set(null);
  }

  selectSlot(slot: CoachSlot): void {
    this.selectedSlot.set(slot);
  }

  close(): void {
    this.onClose.emit();
  }

  reset(): void {
    this.selectedDate.set(null);
    this.selectedSlot.set(null);
    this.availableDays.set([]);
  }

  // ─── Helpers ──────────────────────
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatTime(date: string): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    });
  }
}