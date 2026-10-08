import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { CoachDetail } from "../../../admin/coaches-management/Coaches.model";
import { BookingsService } from "../../../admin/bookings-management/services/bookings.service";
import {
  ApplyCouponRequest,
  StripePaymentIntentApiResponse,
  StripePaymentIntentResponse,
  UserBookingsService,
} from "../../services/user-bookings.service";
import { ToastService } from "../../../../core/services/toast.service";
import { RadioButtonModule } from "primeng/radiobutton";
import { PaymentDialogComponent } from "../../payment-dialog/payment-dialog.component";
import { Router } from "@angular/router";

export interface BookingSummary {
  bookingId: number | string;
  coach: CoachDetail | null;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  originalPrice: number;
  discount: number;
  finalPrice: number;
}

@Component({
  selector: "app-booking-summary-dialog",
  standalone: true,
  imports: [
    DialogModule,
    RadioButtonModule,
    PaymentDialogComponent,
    InputTextModule,
    ButtonModule,
    FormsModule,
    DatePipe,
  ],
  templateUrl: "./booking-summary.component.html",
  styleUrl: "./booking-summary.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingSummaryDialogComponent {
  private bookingsService = inject(UserBookingsService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() visible = false;
  @Input() bookingSummary: BookingSummary | null = null;

  @Input() isValidatingCoupon = false;
  @Input() isCreatingBooking = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  //   @Output() validateCoupon = new EventEmitter<string>();
  @Output() continueToPayment = new EventEmitter<void>();
  couponCode = "";
  couponError = "";
  isRemovingCoupon = false;
  selectedPaymentMethod = "STRIPE";
  isCreatingPaymentIntent = false;
  showPaymentDialog = false;

  paymentIntent: StripePaymentIntentResponse | null = null;

  onValidateCoupon(): void {
    const code = this.couponCode.trim();

    if (!code) {
      return;
    }
    this.validateCoupon(code);
  }

  onVisibleChange(visible: boolean): void {
    this.visibleChange.emit(visible);
  }

  validateCoupon(code: string): void {
    if (!this.bookingSummary?.bookingId || this.isValidatingCoupon) {
      return;
    }

    this.isValidatingCoupon = true;
    this.couponError = "";

    const request: ApplyCouponRequest = {
      code,
      bookingId: Number(this.bookingSummary.bookingId),
    };

    this.bookingsService.applyCoupon(request).subscribe({
      next: (response) => {
        this.isValidatingCoupon = false;

        const booking = response.data;

        if (!booking) {
          this.couponError = "Invalid coupon code. Please try another coupon.";
          this.cdr.detectChanges();
          return;
        }

        this.couponCode = code;

        this.bookingSummary = {
          ...this.bookingSummary!,
          discount: booking.discount ?? 0,
          finalPrice: booking.finalPrice,
        };

        this.cdr.detectChanges();
      },

      error: (error) => {
        this.isValidatingCoupon = false;
        this.cdr.detectChanges();

        this.couponError =
          error?.error?.messageEn ||
          "Invalid coupon code. Please try another coupon.";
      },
    });
    this.cdr.detectChanges();
  }

  removeCoupon(): void {
    if (!this.bookingSummary?.bookingId || this.isRemovingCoupon) {
      return;
    }

    this.isRemovingCoupon = true;
    this.couponError = "";

    this.bookingsService
      .deleteCoupon(Number(this.bookingSummary.bookingId))
      .subscribe({
        next: (response: any) => {
          this.isRemovingCoupon = false;

          const booking = response?.data;

          this.couponCode = "";

          this.bookingSummary = {
            ...this.bookingSummary!,
            discount: booking?.discount ?? 0,
            finalPrice:
              booking?.finalPrice ?? this.bookingSummary!.originalPrice,
          };
          this.cdr.detectChanges();
        },

        error: () => {
          this.isRemovingCoupon = false;

          this.couponError = "Unable to remove the coupon. Please try again.";
          this.cdr.detectChanges();
        },
      });
  }
  onCouponInput(): void {
    this.couponError = "";

    if (this.bookingSummary?.discount) {
      this.bookingSummary = {
        ...this.bookingSummary,
        discount: 0,
        finalPrice: this.bookingSummary.originalPrice,
      };
    }
  }

  get hasAppliedCoupon(): boolean {
    return !!this.bookingSummary?.discount && this.bookingSummary.discount > 0;
  }

  onContinueToPayment(): void {
    if (!this.bookingSummary?.bookingId || this.isCreatingPaymentIntent) {
      return;
    }

    this.isCreatingPaymentIntent = true;
    this.couponError = "";

    this.bookingsService
      .createStripePaymentIntent(Number(this.bookingSummary.bookingId))
      .subscribe({
        next: (response: StripePaymentIntentApiResponse) => {
          this.isCreatingPaymentIntent = false;

          const paymentIntent = response.data;

          if (!paymentIntent?.clientSecret) {
            this.toastService.error(
              "Unable to initialize payment. Please try again.",
            );
            this.cdr.detectChanges();
            return;
          }

          // Store the payment intent
          this.paymentIntent = paymentIntent;

          // Then open the payment dialog
          this.showPaymentDialog = true;

          this.cdr.detectChanges();
        },

        error: (error) => {
          this.isCreatingPaymentIntent = false;

          this.toastService.error(
            error?.error?.messageEn ||
              "Unable to initialize payment. Please try again.",
          );

          this.cdr.detectChanges();
        },
      });
  }

  onPaymentSuccess(bookingId: number): void {
    this.showPaymentDialog = false;
    this.cdr.markForCheck();
    this.toastService.show(
      "success",
      "Payment successful",
      "Your booking has been confirmed successfully.",
      1500,
    );
    setTimeout(() => {
      this.router.navigate(["/coachee/bookings"]);
    }, 500);
  }

  onPaymentError(message: string): void {
     this.toastService.show( "error", "Payment failed", message, 4000, );
    this.cdr.markForCheck();
   }
  paymentVisibleChange(visible: boolean): void {
     this.showPaymentDialog = visible; 
     this.cdr.markForCheck();
   }
}
