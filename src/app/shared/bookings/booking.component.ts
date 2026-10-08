import {
  Component,
  signal,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConfirmationService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ToastService } from "../../core/services/toast.service";
import { Subscription } from "rxjs";
import {
  CoachBookingsService,
  MobileBooking,
} from "../../features/coach/services/coach-bookings.service";
import { SkeletonModule } from "primeng/skeleton";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment.development";
import { AuthService } from "../../core/services/auth.service";

interface ViewBooking {
  id: number;
  name: string;
  title?: string;
  price?: number | null;
  discount?: number | null;
  finalPrice?: number | null;
  date: string;
  status: "running" | "upcoming" | "past" | "completed" | "canceled" | string;
  avatar?: string | null;
  raw?: MobileBooking;
}

@Component({
  selector: "app-coach-booking",
  standalone: true,
  imports: [CommonModule, ConfirmDialogModule, SkeletonModule],
  providers: [ConfirmationService],
  templateUrl: "./booking.component.html",
  styleUrls: ["./booking.component.scss"],
})
export class BookingComponent implements OnInit, OnDestroy {
  private service = inject(CoachBookingsService);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private authService = inject(AuthService);


  private subs: Subscription[] = [];

  tabs = ["Upcoming", "History"];
  activeTab = signal<string>("Upcoming");

  // =========================================================
  // PAGINATION
  // =========================================================

  pageIndex = 0;
  pageSize = 50;
  hasMore = true;
  loading = false;

  // =========================================================
  // BOOKING STATE
  // =========================================================

  startingBookingId: number | null = null;

  bookings: ViewBooking[] = [];

  ngOnInit(): void {
    window.addEventListener("scroll", this.onWindowScroll, { passive: true });

    this.resetAndLoad();
  }

  ngOnDestroy(): void {
    window.removeEventListener("scroll", this.onWindowScroll);

    this.subs.forEach((sub) => sub.unsubscribe());
  }

  // =========================================================
  // TABS
  // =========================================================

  setTab(tab: string): void {
    if (this.activeTab() === tab) {
      return;
    }

    this.activeTab.set(tab);
    this.resetAndLoad();
  }

  // =========================================================
  // PAGINATION
  // =========================================================

  private resetAndLoad(): void {
    this.pageIndex = 0;
    this.bookings = [];
    this.hasMore = true;

    this.loadPage();
  }

  private onWindowScroll = (): void => {
    if (this.loading || !this.hasMore) {
      return;
    }

    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    const viewport =
      window.innerHeight || document.documentElement.clientHeight;

    const fullHeight = document.documentElement.scrollHeight;

    if (scrollTop + viewport >= fullHeight - 300) {
      this.loadPage();
    }
  };

  private loadPage(): void {
    if (this.loading || !this.hasMore) {
      return;
    }

    this.loading = true;

    const tab = this.activeTab();

    const request$ =
      tab === "Upcoming"
        ? this.service.upcomingBookings(this.pageIndex, this.pageSize)
        : this.service.pastBookings(this.pageIndex, this.pageSize);

    const sub = request$.subscribe({
      next: (res) => {
        const items = res.data ?? [];

        const mapped = items.map((item) => this.mapToView(item));

        this.bookings = [...this.bookings, ...mapped];

        const pageCount =
          res.pageCount ??
          Math.ceil((res.count ?? 0) / (res.pageSize ?? this.pageSize));

        /**
         * pageIndex is zero-based.
         *
         * Example:
         * pageCount = 3
         *
         * pageIndex:
         * 0 -> first page
         * 1 -> second page
         * 2 -> third page
         *
         * After loading the third page,
         * there are no more pages.
         */
        this.pageIndex++;

        this.hasMore = this.pageIndex < pageCount;

        /**
         * If API doesn't provide enough information,
         * use returned item count as a fallback.
         */
        if (res.pageCount == null && res.count == null) {
          this.hasMore = items.length === this.pageSize;
        }

        this.loading = false;

        this.cdr.markForCheck();
      },

      error: () => {
        this.loading = false;
        this.hasMore = false;

        this.toastService.error("Failed to load bookings. Please try again.");

        this.cdr.markForCheck();
      },
    });

    this.subs.push(sub);
  }

  // =========================================================
  // MAP API MODEL → VIEW MODEL
  // =========================================================

  private mapToView(booking: MobileBooking): ViewBooking {
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);

    const dateStr =
      `${start.toLocaleDateString()} ` +
      `${start.toLocaleTimeString()} to ` +
      `${end.toLocaleTimeString()}`;

    const isCoach = this.service.isCoach();

    return {
      id: booking.id,

      /**
       * COACH:
       *   coacheeFullName
       *
       * COACHEE:
       *   coachFullNameEn
       */
      name: isCoach
        ? booking.coacheeFullName ?? "Unknown"
        : booking.coachFullNameEn ?? "Unknown",

      /**
       * COACH:
       *   Coachee
       *
       * COACHEE:
       *   Coach industries
       */
      title: isCoach ? "Coachee" : this.getCoachTitle(booking),

      price: booking.price ?? null,

      discount: booking.discount ?? null,

      finalPrice: booking.finalPrice ?? null,

      date: dateStr,

      status: (booking.status ?? "").toLowerCase(),

      /**
       * COACH:
       *   coacheeProfileImageUrl
       *
       * COACHEE:
       *   coachProfileImageUrl
       */
   		avatar: this.getImageUrl(
			isCoach
				? booking.coacheeProfileImageUrl
				: booking.coachProfileImageUrl
		),


      raw: booking,
    };
  }

  private getCoachTitle(booking: MobileBooking): string {
    if (!booking.coachIndustries?.length) {
      return "Coach";
    }

    return booking.coachIndustries
      .map((industry) => industry.nameEn)
      .join(", ");
  }

  // =========================================================
  // FILTERED BOOKINGS
  // =========================================================

  get filteredBookings(): ViewBooking[] {
    const tab = this.activeTab();

    if (tab === "Upcoming") {
      return this.bookings;
    }

    if (tab === "History") {
      return this.bookings.filter(
        (booking) =>
          booking.status === "past" ||
          booking.status === "completed" ||
          booking.status === "canceled" ||
          booking.status === "cancelled"
      );
    }

    return this.bookings;
  }

 // =========================================================
  // Reschedule
  // =========================================================

  reschedule(b: ViewBooking): void {
    if (!b) {
      return;
    }

    this.confirmationService.confirm({
      message:
        `Are you sure you want to cancel the session for ` +
        `<strong>${b.name}</strong>?`,

      header: "Confirm Cancel",

      acceptLabel: "Cancel",

      rejectLabel: "Close",

      acceptButtonStyleClass: "no-radius p-button-danger p-button-sm",

      rejectButtonStyleClass: "no-radius p-button-secondary p-button-sm",

      accept: () => {
        const sub = this.service.cancelBooking(b.id).subscribe({
          next: () => {
            this.toastService.success(
              "The booking has been canceled successfully",
              "Canceled Successfully"
            );

            this.resetAndLoad();
          },

          error: (err) => {
            const message =
              err?.error?.messageEn ||
              "Failed to cancel the booking. Please try again.";

            this.toastService.error(message);

            this.cdr.markForCheck();
          },
        });

        this.subs.push(sub);
      },
    });
  }


  // =========================================================
  // CANCEL
  // =========================================================

  cancel(b: ViewBooking): void {
    if (!b) {
      return;
    }

    this.confirmationService.confirm({
      message:
        `Are you sure you want to cancel the session for ` +
        `<strong>${b.name}</strong>?`,

      header: "Confirm Cancel",

      acceptLabel: "Cancel",

      rejectLabel: "Close",

      acceptButtonStyleClass: "no-radius p-button-danger p-button-sm",

      rejectButtonStyleClass: "no-radius p-button-secondary p-button-sm",

      accept: () => {
        const sub = this.service.cancelBooking(b.id).subscribe({
          next: () => {
            this.toastService.success(
              "The booking has been canceled successfully",
              "Canceled Successfully"
            );

            this.resetAndLoad();
          },

          error: (err) => {
            const message =
              err?.error?.messageEn ||
              "Failed to cancel the booking. Please try again.";

            this.toastService.error(message);

            this.cdr.markForCheck();
          },
        });

        this.subs.push(sub);
      },
    });
  }

  // =========================================================
  // BOOKING ACTIONS
  // =========================================================

  hasStartAction(b: ViewBooking): boolean {
    if (b.status !== "upcoming") {
      return false;
    }

    return !!b.raw?.actions?.some((action) => action.value === "START");
  }

  hasJoinAction(b: ViewBooking): boolean {
    return (
      b.status === "running" &&
      !!b.raw?.actions?.some(
        (action) => action.value === "START" || action.value === "JOIN"
      )
    );
  }

  hasCancelAction(b: ViewBooking): boolean {
    return !!b.raw?.actions?.some((action) => action.value === "CANCEL");
  }

  hasRescheduleAction(b: ViewBooking): boolean {
    return !!b.raw?.actions?.some((action) => action.value === "CANCEL");
  }

  // =========================================================
  // START / JOIN SESSION
  // =========================================================

  isStarting(b: ViewBooking): boolean {
    return this.startingBookingId === b.id;
  }

  startNow(b: ViewBooking): void {
    if (!b) {
      return;
    }

    if (b.status !== "upcoming" && b.status !== "running") {
      return;
    }

    if (b.status === "upcoming" && !this.hasStartAction(b)) {
      return;
    }

    if (b.status === "running" && !this.hasJoinAction(b)) {
      return;
    }

    if (this.startingBookingId !== null) {
      return;
    }

    this.startingBookingId = b.id;

    this.cdr.markForCheck();

    const sub = this.service.startSession(b.id).subscribe({
      next: (res) => {
        this.startingBookingId = null;

        const sessionUrl = res?.data?.sessionUrl;

        if (!sessionUrl) {
          this.toastService.error(
            "Unable to start the session. No meeting URL was returned."
          );

          this.cdr.markForCheck();
          return;
        }
          if (this.authService.isCoach()) {
            this.router.navigate(["/coach/session", b.id], {
              state: {
                sessionUrl,
              },
            });
          }else{
            this.router.navigate(["/coachee/session", b.id], {
              state: {
                sessionUrl,
              },
            });
          }
        
      },

      error: (err) => {
        this.startingBookingId = null;

        const message =
          err?.error?.messageEn ||
          "Failed to start the session. Please try again.";

        this.toastService.error(message);

        this.cdr.markForCheck();
      },
    });

    this.subs.push(sub);
  }

  private getImageUrl(
	avatar: string | null | undefined
): string | null {
	if (!avatar) {
		return null;
	}

	if (
		avatar.startsWith('http://') ||
		avatar.startsWith('https://')
	) {
		return avatar;
	}

	return `${environment.apiUrl.replace(/\/$/, '')}/${avatar.replace(/^\//, '')}`;
}
}