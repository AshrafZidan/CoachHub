import { Component, Input, Output, EventEmitter, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Booking, BookingStatus, PaymentStatus, SlotType } from '../bookings.model';
import { BookingsService } from '../services/bookings.service';

@Component({
  selector: 'app-booking-details-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    DividerModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService],
  templateUrl: './booking-details-modal.html',
  styleUrls: ['./booking-details-modal.scss']
})
export class BookingDetailsModalComponent {
  private bookingsService = inject(BookingsService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  // ─── Inputs: Regular @Input() properties ───────────────────────
  @Input() visible = false;
  @Input() booking: Booking | null = null;

  // ─── Outputs ───────────────────────────────────────────────────
  @Output() onClose = new EventEmitter<void>();
  @Output() onActionComplete = new EventEmitter<Booking>();

  // ─── State ────────────────────────────────────────────────────
  isLoading = signal(false);

  // ─── Permissions ──────────────────────────────────────────────
  // canApproveBooking = computed(() =>
  //   this.permissionService.hasPermission('approve_bookings')
  // );
  // canRejectBooking = computed(() =>
  //   this.permissionService.hasPermission('reject_bookings')
  // );
  // canRefundBooking = computed(() =>
  //   this.permissionService.hasPermission('refund_bookings')
  // );
  // canCancelBooking = computed(() =>
  //   this.permissionService.hasPermission('cancel_bookings')
  // );

  // ─── Status Maps ──────────────────────────────────────────────
  statusClassMap: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: 'pending',
    [PaymentStatus.FAILED]: 'failed',
    [PaymentStatus.CANCELLED]: 'cancelled',
    [PaymentStatus.REFUNDED]: 'refunded',
    [PaymentStatus.PAID]: 'paid'
  };

  statusSeverityMap: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: 'warning',
    [PaymentStatus.FAILED]: 'danger',
    [PaymentStatus.CANCELLED]: 'secondary',
    [PaymentStatus.REFUNDED]: 'info',
    [PaymentStatus.PAID]: 'paid'
  };

  // ─── Computed ─────────────────────────────────────────────────
  canTakeAction = computed(() => {
    return this.booking ? this.booking.paymentStatus === PaymentStatus.PENDING : false;
  });

  

  hasDiscount = computed(() => {
    return this.booking ? this.booking.discount > 0 : false;
  });

  discountPercentage = computed(() => {
    if (!this.booking || this.booking.discount === 0 || this.booking.discount == null) return 0;
    return Math.round((this.booking.discount / this.booking.price) * 100);
  });

  // ─── Dialog ────────────────────────────────────────────────────
  close(): void {
    this.onClose.emit();
  }

  // ─── Actions ───────────────────────────────────────────────────
  // approveBooking(): void {
  //   if (!this.booking) return;

  //   this.confirmationService.confirm({
  //     message: `Approve booking for ${this.booking.coacheeFullName}?`,
  //     header: 'Confirm Approval',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.isLoading.set(true);
  //       this.bookingsService.approveBooking(this.booking!.id).subscribe({
  //         next: (response) => {
  //           this.isLoading.set(false);
  //           this.messageService.add({
  //             severity: 'success',
  //             summary: 'Success',
  //             detail: 'Booking approved successfully'
  //           });
  //           this.onActionComplete.emit(response.data);
  //           this.close();
  //         },
  //         error: (error) => {
  //           this.isLoading.set(false);
  //           this.messageService.add({
  //             severity: 'error',
  //             summary: 'Error',
  //             detail: 'Failed to approve booking'
  //           });
  //         }
  //       });
  //     }
  //   });
  // }

  // rejectBooking(): void {
  //   if (!this.booking) return;

  //   this.confirmationService.confirm({
  //     message: `Reject booking for ${this.booking.coacheeFullName}?`,
  //     header: 'Confirm Rejection',
  //     icon: 'pi pi-exclamation-triangle',
  //     acceptButtonStyleClass: 'p-button-danger',
  //     accept: () => {
  //       this.isLoading.set(true);
  //       this.bookingsService.rejectBooking(this.booking!.id).subscribe({
  //         next: (response) => {
  //           this.isLoading.set(false);
  //           this.messageService.add({
  //             severity: 'success',
  //             summary: 'Success',
  //             detail: 'Booking rejected successfully'
  //           });
  //           this.onActionComplete.emit(response.data);
  //           this.close();
  //         },
  //         error: (error) => {
  //           this.isLoading.set(false);
  //           this.messageService.add({
  //             severity: 'error',
  //             summary: 'Error',
  //             detail: 'Failed to reject booking'
  //           });
  //         }
  //       });
  //     }
  //   });
  // }

  // refundBooking(): void {
  //   if (!this.booking) return;

  //   this.confirmationService.confirm({
  //     message: `Refund ${this.formatCurrency(this.booking.finalPrice)} for ${this.booking.coacheeFullName}?`,
  //     header: 'Confirm Refund',
  //     icon: 'pi pi-exclamation-triangle',
  //     acceptButtonStyleClass: 'p-button-danger',
  //     accept: () => {
  //       this.isLoading.set(true);
  //       this.bookingsService.refundBooking(this.booking!.id).subscribe({
  //         next: (response) => {
  //           this.isLoading.set(false);
  //           this.messageService.add({
  //             severity: 'success',
  //             summary: 'Success',
  //             detail: 'Booking refunded successfully'
  //           });
  //           this.onActionComplete.emit(response.data);
  //           this.close();
  //         },
  //         error: (error) => {
  //           this.isLoading.set(false);
  //           this.messageService.add({
  //             severity: 'error',
  //             summary: 'Error',
  //             detail: 'Failed to refund booking'
  //           });
  //         }
  //       });
  //     }
  //   });
  // }

  // cancelBooking(): void {
  //   if (!this.booking) return;

  //   this.confirmationService.confirm({
  //     message: `Cancel booking for ${this.booking.coacheeFullName}?`,
  //     header: 'Confirm Cancellation',
  //     icon: 'pi pi-exclamation-triangle',
  //     acceptButtonStyleClass: 'p-button-danger',
  //     accept: () => {
  //       this.isLoading.set(true);
  //       this.bookingsService.cancelBooking(this.booking!.id).subscribe({
  //         next: (response) => {
  //           this.isLoading.set(false);
  //           this.messageService.add({
  //             severity: 'success',
  //             summary: 'Success',
  //             detail: 'Booking cancelled successfully'
  //           });
  //           this.onActionComplete.emit(response.data);
  //           this.close();
  //         },
  //         error: (error) => {
  //           this.isLoading.set(false);
  //           this.messageService.add({
  //             severity: 'error',
  //             summary: 'Error',
  //             detail: 'Failed to cancel booking'
  //           });
  //         }
  //       });
  //     }
  //   });
  // }

  // ─── Utility Methods ───────────────────────────────────────────
  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  formatCurrency(amount: number | undefined): string {
    if (amount === undefined || amount === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getSlotTypeLabel(slotType: SlotType | undefined): string {
    if (!slotType) return '-';
    const labels: Record<SlotType, string> = {
      [SlotType.HALF_HOUR]: 'Half Hour',
      [SlotType.ONE_HOUR]: '1 Hour',
      [SlotType.TWO_HOURS]: '2 Hours',
      [SlotType.FULL_DAY]: 'Full Day'
    };
    return labels[slotType] || slotType;
  }

  getStatusSeverity(status: PaymentStatus | undefined): string {
    if (!status) return 'secondary';
    return this.statusSeverityMap[status] || 'secondary';
  }

  getStatusLabel(status: PaymentStatus | undefined): string {
    if (!status) return '-';
    const labels: Record<PaymentStatus, string> = {
      [PaymentStatus.PENDING]: 'pending',
      [PaymentStatus.FAILED]: 'Failed',
      [PaymentStatus.CANCELLED]: 'Cancelled',
      [PaymentStatus.REFUNDED]: 'refunded',
      [PaymentStatus.PAID]: 'paid'
    };
    return labels[status] || status;
  }

    getBookingStatusLabel(status: BookingStatus | undefined): string {
    if (!status) return '-';
    const labels: Record<BookingStatus, string> = {
      [BookingStatus.COMPLETED]: 'completed',
      [BookingStatus.PAST]: 'past',
      [BookingStatus.RUNNING]: 'running',
      [BookingStatus.UPCOMING]: 'upcoming',
      [BookingStatus.CANCELED]: 'canceled',

    };
    return labels[status] || status;
  }
}