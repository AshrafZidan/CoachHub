import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  afterNextRender,
  inject,
  Injector,
} from "@angular/core";
import { CurrencyPipe } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { SkeletonModule } from "primeng/skeleton";
import {
  loadStripe,
  Stripe,
  StripeElements,
  StripePaymentElement,
} from "@stripe/stripe-js";
import { firstValueFrom } from "rxjs";

import { environment } from "../../../../environments/environment.development";
import { PaymentService } from "../services/payment.service";

export interface StripePaymentIntentResponse {
  bookingId: number;
  paymentId: number;
  paymentIntentId: string;
  clientSecret: string;
  amount: number;
  amountMinor: number;
  currency: string;
  status: string;
}

@Component({
  selector: "app-payment-dialog",
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    CurrencyPipe,
    SkeletonModule,
  ],
  templateUrl: "./payment-dialog.component.html",
  styleUrl: "./payment-dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentDialogComponent {
  @Input() visible = false;
  @Input() paymentIntent: StripePaymentIntentResponse | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() paymentSuccess = new EventEmitter<number>();
  @Output() paymentError = new EventEmitter<string>();

  private readonly paymentService = inject(PaymentService);
  private readonly injector = inject(Injector);
  private readonly cdr = inject(ChangeDetectorRef);

  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;

  public paymentElement: StripePaymentElement | null = null;

  isInitializing = false;
  isProcessingPayment = false;
  isVerifyingPayment = false;

  paymentErrorMessage = "";

  async initializeStripe(): Promise<void> {
    if (
      !this.paymentIntent?.clientSecret ||
      this.isInitializing
    ) {
      return;
    }

    this.isInitializing = true;
    this.paymentErrorMessage = "";
    this.cdr.markForCheck();

    try {
      this.destroyPaymentElement();

      this.stripe ??= await loadStripe(
        environment.stripePublishableKey,
      );

      if (!this.stripe) {
        throw new Error("Stripe initialization failed.");
      }

      this.elements = this.stripe.elements({
        clientSecret: this.paymentIntent.clientSecret,
        appearance: {
          theme: "stripe",
        },
      });

   this.paymentElement = this.elements.create("payment", {
  layout: "tabs",
});

      this.paymentElement.once("ready", () => {
        this.isInitializing = false;
        this.cdr.markForCheck();
      });

      this.paymentElement.once("loaderror", (event) => {
        console.error(
          "Stripe payment element load error:",
          event,
        );

        this.isInitializing = false;

        this.handlePaymentError(
          "Unable to load the payment form. Please try again.",
        );
      });

      afterNextRender(
        () => {
          const container =
            document.getElementById("payment-element");

          if (!container || !this.paymentElement) {
            this.isInitializing = false;

            this.handlePaymentError(
              "Unable to load the payment form.",
            );

            return;
          }

          this.paymentElement.mount(container);
          this.cdr.markForCheck();
        },
        {
          injector: this.injector,
        },
      );
    } catch (error: unknown) {
      console.error(
        "Stripe initialization error:",
        error,
      );

      this.isInitializing = false;

      this.handlePaymentError(
        this.getErrorMessage(
          error,
          "Unable to initialize payment. Please try again.",
        ),
      );
    }
  }

  async pay(): Promise<void> {
    if (
      !this.stripe ||
      !this.elements ||
      !this.paymentIntent ||
      this.isProcessingPayment ||
      this.isVerifyingPayment
    ) {
      return;
    }

    this.isProcessingPayment = true;
    this.paymentErrorMessage = "";
    this.cdr.markForCheck();

    try {
      const result = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/result`,
        },
        redirect: "if_required",
      });

      console.log(
        "Stripe confirmPayment result:",
        result,
      );

      if (result.error) {
        console.error(
          "Stripe payment error:",
          result.error,
        );

        this.handlePaymentError(
          result.error.message ||
            "Payment failed. Please try again.",
        );

        return;
      }

      await this.verifyPaymentStatus();
    } catch (error: unknown) {
      console.error(
        "Unexpected payment exception:",
        error,
      );

      this.handlePaymentError(
        this.getErrorMessage(
          error,
          "Unable to process payment. Please try again.",
        ),
      );
    } finally {
      this.isProcessingPayment = false;
      this.cdr.markForCheck();
    }
  }

  private async verifyPaymentStatus(): Promise<void> {
    if (!this.paymentIntent?.paymentId) {
      this.handlePaymentError(
        "Payment information is missing.",
      );
      return;
    }

    this.isVerifyingPayment = true;
    this.paymentErrorMessage = "";
    this.cdr.markForCheck();

    try {
      const maxAttempts = 5;
      const delayMs = 2000;

      for (
        let attempt = 0;
        attempt < maxAttempts;
        attempt++
      ) {
        const response = await firstValueFrom(
          this.paymentService.getPaymentStatus(
            this.paymentIntent.paymentId,
          ),
        );

        const status = response.data;

        switch (status) {
          case "ACCEPTED":
            this.paymentSuccess.emit(
              this.paymentIntent.bookingId,
            );
            return;

          case "REJECTED":
            this.handlePaymentError(
              response.messageEn ||
                "Payment was rejected. Please try again.",
            );
            return;

          case "INPROGRESS":
            if (attempt < maxAttempts - 1) {
              await this.delay(delayMs);
            }
            break;

          default:
            this.handlePaymentError(
              "Unable to verify payment status.",
            );
            return;
        }
      }

      this.handlePaymentError(
        "Your payment is still being processed. Please try again shortly.",
      );
    } catch (error: unknown) {
      console.error(
        "Payment status verification error:",
        error,
      );

      this.handlePaymentError(
        this.getErrorMessage(
          error,
          "Unable to verify your payment. Please try again.",
        ),
      );
    } finally {
      this.isVerifyingPayment = false;
      this.cdr.markForCheck();
    }
  }

  private handlePaymentError(error: unknown): void {
    const message = this.getErrorMessage(
      error,
      "Payment failed. Please try again.",
    );

    this.paymentErrorMessage = message;
    this.paymentError.emit(message);
    this.cdr.markForCheck();
  }

  private getErrorMessage(
    error: unknown,
    fallback: string,
  ): string {
    if (typeof error === "string" && error.trim()) {
      return error;
    }

    if (
      error &&
      typeof error === "object" &&
      "message" in error
    ) {
      const message = error.message;

      if (
        typeof message === "string" &&
        message.trim()
      ) {
        return message;
      }
    }

    return fallback;
  }

  private delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  close(): void {
    if (
      this.isProcessingPayment ||
      this.isVerifyingPayment
    ) {
      return;
    }

    this.visibleChange.emit(false);
  }

  onDialogHide(): void {
    this.destroyPaymentElement();

    this.paymentErrorMessage = "";
    this.isInitializing = false;
    this.isProcessingPayment = false;
    this.isVerifyingPayment = false;

    this.cdr.markForCheck();
  }

  private destroyPaymentElement(): void {
    if (this.paymentElement) {
      this.paymentElement.destroy();
      this.paymentElement = null;
    }

    this.elements = null;
  }
}
