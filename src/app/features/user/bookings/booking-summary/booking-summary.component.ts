import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CoachDetail } from '../../../admin/coaches-management/Coaches.model';

export interface BookingSummary {
  coach: CoachDetail | null;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
}

@Component({
  selector: 'app-booking-summary-dialog',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    DatePipe,
  ],
  templateUrl: './booking-summary.component.html',
  styleUrl: './booking-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingSummaryDialogComponent {
  @Input() visible = false;
  @Input() bookingSummary: BookingSummary | null = null;

  @Input() isValidatingCoupon = false;
  @Input() isCreatingBooking = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() validateCoupon = new EventEmitter<string>();
  @Output() continueToPayment = new EventEmitter<void>();

  couponCode = '';

  onValidateCoupon(): void {
    const code = this.couponCode.trim();

    if (!code) {
      return;
    }

    this.validateCoupon.emit(code);
  }

  onContinueToPayment(): void {
    this.continueToPayment.emit();
  }

  onVisibleChange(visible: boolean): void {
    this.visibleChange.emit(visible);
  }
}