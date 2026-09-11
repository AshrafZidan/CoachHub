import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";

import { CommonModule, isPlatformBrowser } from "@angular/common";

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { Subject, takeUntil } from "rxjs";

import { ButtonModule } from "primeng/button";
import { DatePickerModule } from "primeng/datepicker";
import { DialogModule } from "primeng/dialog";
import { ToastModule } from "primeng/toast";

import { ConfirmationService, MessageService } from "primeng/api";

import { ConfirmDialogModule } from "primeng/confirmdialog";
import { SelectModule } from "primeng/select";

import {
  CoachProfileService,
  SlotData,
  Slot,
} from "../services/coach-profile.service";

import { environment } from "../../../../environments/environment.development";

import { ToastService } from "../../../core/services/toast.service";
import {
  Coach,
  CoachDetail,
} from "../../admin/coaches-management/Coaches.model";
import { BaseIcon } from "primeng/icons/baseicon";
import { SkeletonModule } from "primeng/skeleton";
import { AuthService } from "../../../core/services/auth.service";

interface TimeSlot {
  id: number;
  date: string;
  time: string;
  startTime: string;
  endTime: string;
  startTimeUtc: string;
  endTimeUtc: string;
  periodMinutes: number;
  status: string;
}

interface SelectOption<T = string> {
  label: string;
  value: T;
}

@Component({
  selector: "app-coach-add-appointment",

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePickerModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    SelectModule,
    SkeletonModule,
    BaseIcon,
  ],

  providers: [MessageService, ConfirmationService],

  templateUrl: "./coach-add-appointment.component.html",

  styleUrls: ["./coach-add-appointment.component.scss"],

  /*
   * IMPORTANT:
   *
   * We intentionally use Default here while fixing
   * the SSR / hydration / PrimeNG DatePicker issue.
   *
   * Once the refresh case is confirmed working,
   * OnPush can be restored safely.
   */
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CoachAddAppointmentComponent implements OnInit, OnDestroy {
  // =========================================================
  // Injected Services
  // =========================================================

  private readonly profileService = inject(CoachProfileService);

  private readonly messageService = inject(MessageService);

  private readonly cdr = inject(ChangeDetectorRef);

  private readonly toastService = inject(ToastService);

  private readonly confirmationService = inject(ConfirmationService);

  private readonly fb = inject(FormBuilder);

  private readonly destroy$ = new Subject<void>();

  private readonly authService = inject(AuthService);

  public isLoggedIn: boolean = false;
  public isCoach: boolean = false;

  public selectedTimeSlotToBook: TimeSlot | null = null;

  // =========================================================
  // Platform
  // =========================================================

  private readonly platformId = inject(PLATFORM_ID);

  /*
   * PrimeNG calendar must only be rendered in browser.
   */
  readonly isBrowser = isPlatformBrowser(this.platformId);

  // =========================================================
  // Profile
  // =========================================================

  coach: CoachDetail | null = null;

  coachId: number | null = null;
  coachInput = input<CoachDetail | null>(null);

  // =========================================================
  // Calendar
  // =========================================================

  selectedDate: Date | null = null;

  selectedDateStr = "";

  slotsForSelectedDate: TimeSlot[] = [];

  allAvailableSlots: SlotData[] = [];

  datesWithSlots = new Set<string>();

  private monthCache = new Map<string, SlotData[]>();

  private visibleMonth = new Date().getMonth() + 1;

  private visibleYear = new Date().getFullYear();

  // =========================================================
  // Dialog
  // =========================================================

  showAddDialog = false;

  form!: FormGroup;

  loading = false;

  loadingSlots = false;

  loadingAddSlot = false;

  // =========================================================
  // Select Options
  // =========================================================

  periodOptions: SelectOption[] = [
    {
      label: "30 Min",
      value: "HALF_HOUR",
    },

    {
      label: "1 Hour",
      value: "HOUR",
    },

    {
      label: "1.5 Hours",
      value: "ONE_AND_HALF_HOUR",
    },

    {
      label: "2 Hours",
      value: "TWO_HOURS",
    },
  ];

  timezones: SelectOption[] = [];

  // =========================================================
  // Constructor
  // =========================================================

  constructor() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isCoach = this.authService.isCoach();
  }

  // =========================================================
  // Lifecycle
  // =========================================================

  ngOnInit(): void {
    this.initializeTimezones();

    this.initializeForm();

    /*
     * Never start browser-only work during SSR.
     *
     * setTimeout allows hydration / initial render
     * to complete before PrimeNG calendar becomes active.
     */

    if (this.isBrowser) {
      setTimeout(() => {
        if (!this.coachInput()) {
          this.loadCoachProfile();
        } else {
          this.coach = this.coachInput();
          this.cdr.markForCheck();
          if (this.coach) {
            this.getAvailableSlotsforCoach(this.coach);
          }
        }
      }, 0);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();

    this.destroy$.complete();
  }

  // =========================================================
  // Form
  // =========================================================

  private initializeForm(): void {
    const userTimezone = this.getUserTimezone();

    this.form = this.fb.group({
      date: [null, Validators.required],

      time: [null, Validators.required],

      period: [null, Validators.required],

      timezone: [userTimezone, Validators.required],
    });
  }

  private resetForm(): void {
    this.form.reset({
      date: null,

      time: null,

      period: null,

      timezone: this.getUserTimezone(),
    });

    this.form.markAsPristine();

    this.form.markAsUntouched();
  }

  private getUserTimezone(): string {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    } catch {
      return "UTC";
    }
  }

  private initializeTimezones(): void {
    const userTimezone = this.getUserTimezone();

    let zones: string[] = [];

    try {
      zones = Intl.supportedValuesOf("timeZone");
    } catch {
      zones = [
        "UTC",

        "Africa/Cairo",

        "Europe/London",

        "Europe/Paris",

        "America/New_York",

        "America/Los_Angeles",

        "Asia/Dubai",

        "Asia/Riyadh",

        "Asia/Tokyo",
      ];
    }

    if (!zones.includes("UTC")) {
      zones.unshift("UTC");
    }

    if (!zones.includes(userTimezone)) {
      zones.unshift(userTimezone);
    }

    this.timezones = zones.map((timezone) => ({
      label: timezone,

      value: timezone,
    }));
  }

  private getAvailableSlotsforCoach(coach: CoachDetail): void {
    this.loading = true;

    this.cdr.markForCheck();

    this.profileService
      .getSlots(coach.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.cdr.markForCheck();
          console.log(res);
          // if (
          //     coach.id
          // ) {

          //     this.fetchMonthSlots(
          //         this.visibleMonth,
          //         this.visibleYear
          //     );

          // }
        },

        error: (error) => {
          this.loading = false;

          this.toast("error", "Failed to load coach slots");

          this.cdr.markForCheck();
        },
      });
  }

  // =========================================================
  // Profile
  // =========================================================

  private loadCoachProfile(): void {
    this.loading = true;

    this.cdr.markForCheck();

    this.profileService
      .getProfileDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.coach = res?.data ?? null;

          this.coachId = this.coach?.id ?? null;

          this.loading = false;

          /*
           * Render profile.
           */
          this.cdr.markForCheck();

          /*
           * Only load calendar data
           * after coach ID exists.
           */
          if (this.coachId) {
            this.fetchMonthSlots(this.visibleMonth, this.visibleYear);
          }
        },

        error: (error) => {
          this.coach = null;

          this.coachId = null;

          this.loading = false;

          this.toast("error", "Failed to load coach profile");

          this.cdr.markForCheck();
        },
      });
  }

  // =========================================================
  // Calendar Navigation
  // =========================================================

  onCalendarViewChange(event: { month?: number; year?: number }): void {
    const month = event.month ?? this.visibleMonth;

    const year = event.year ?? this.visibleYear;

    this.visibleMonth = month;

    this.visibleYear = year;

    const key = this.cacheKey(month, year);

    if (this.monthCache.has(key)) {
      return;
    }

    if (!this.coachId) {
      return;
    }

    this.fetchMonthSlots(month, year);
  }

  // =========================================================
  // Date Selection
  // =========================================================

  onDateSelect(date: Date): void {
    if (!date) {
      return;
    }

    this.selectedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    this.selectedDateStr = this.toDateStr(this.selectedDate);

    this.showSlotsForDate(this.selectedDateStr);

    this.cdr.markForCheck();
  }

  private showSlotsForDate(dateStr: string): void {
    const year = +dateStr.slice(0, 4);

    const month = +dateStr.slice(5, 7);

    const groups = this.monthCache.get(this.cacheKey(month, year)) ?? [];

    const day = groups.find((group) => group.date === dateStr);

    this.slotsForSelectedDate = (day?.slots ?? []).map((slot) =>
      this.toTimeSlot(slot, dateStr)
    );
  }

  // =========================================================
  // Fetch Month Slots
  // =========================================================

  private fetchMonthSlots(month: number, year: number): void {
    if (!this.coachId) {
      return;
    }

    const key = this.cacheKey(month, year);

    if (this.monthCache.has(key)) {
      return;
    }

    this.loadingSlots = true;

    this.cdr.markForCheck();

    this.profileService
      .getSlotsByMonthAndYear(this.coachId, month, year)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log("[Slots] API response:", res);

          const groups = res.data ?? [];

          this.monthCache.set(key, groups);

          this.rebuildDatesWithSlots();

          this.loadingSlots = false;

          // =================================================
          // AUTO SELECT TODAY
          // =================================================

          if (!this.selectedDate) {
            const today = new Date();

            const todayMonth = today.getMonth() + 1;

            const todayYear = today.getFullYear();

            if (todayMonth === month && todayYear === year) {
              const todayValue = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
              );

              const todayString = this.toDateStr(todayValue);

              this.selectedDate = todayValue;

              this.selectedDateStr = todayString;

              this.showSlotsForDate(todayString);

              /*
               * Let the calendar receive
               * the selected date after
               * the initial render.
               */
              setTimeout(() => {
                this.selectedDate = new Date(todayValue);

                this.selectedDateStr = todayString;

                this.cdr.markForCheck();
              }, 0);
            }
          } else {
            const selectedMonth = this.selectedDate.getMonth() + 1;

            const selectedYear = this.selectedDate.getFullYear();

            if (selectedMonth === month && selectedYear === year) {
              this.showSlotsForDate(this.selectedDateStr);
            }
          }

          this.cdr.markForCheck();
        },

        error: (err) => {
          console.error(`[Slots] Error (${key}):`, err);

          this.loadingSlots = false;

          this.toast("error", "Failed to load slots for this month");

          this.cdr.markForCheck();
        },
      });
  }

  // =========================================================
  // Calendar Indicators
  // =========================================================

  private rebuildDatesWithSlots(): void {
    const next = new Set<string>();

    this.monthCache.forEach((groups) => {
      groups.forEach((group) => {
        if (group.slots.length > 0) {
          next.add(group.date);
        }
      });
    });

    this.datesWithSlots = next;
  }

  hasSlots(date: { year: number; month: number; day: number }): boolean {
    const month = String(date.month + 1).padStart(2, "0");

    const day = String(date.day).padStart(2, "0");

    return this.datesWithSlots.has(`${date.year}-${month}-${day}`);
  }

  // =========================================================
  // Add Dialog
  // =========================================================

  openAddDialog(): void {
    this.resetForm();

    const defaultDate = this.selectedDate
      ? new Date(this.selectedDate)
      : new Date();

    this.form.patchValue({
      date: defaultDate,

      timezone: this.getUserTimezone(),
    });

    this.showAddDialog = true;

    this.cdr.markForCheck();
  }

  closeDialog(): void {
    if (this.loadingAddSlot) {
      return;
    }

    this.showAddDialog = false;

    this.resetForm();

    this.cdr.markForCheck();
  }

  // =========================================================
  // Add Slot
  // =========================================================

  addSlot(): void {
    if (this.form.invalid || this.loadingAddSlot) {
      this.form.markAllAsTouched();

      this.cdr.markForCheck();

      return;
    }

    const { date, time, period, timezone } = this.form.getRawValue();

    if (!date || !time || !period || !timezone) {
      this.form.markAllAsTouched();

      this.cdr.markForCheck();

      return;
    }

    this.loadingAddSlot = true;

    this.cdr.markForCheck();

    const startTime = this.toApiDateTime(date, time, timezone);

    const payload = {
      startTime,

      slotType: period,
    };

    console.log("Add slot payload:", payload);

    this.profileService
      .addSlot(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success("Slot added successfully", "Success");

          this.refreshMonthAfterAdd(date);

          this.loadingAddSlot = false;

          this.showAddDialog = false;

          this.resetForm();

          this.cdr.markForCheck();
        },

        error: (error) => {
          console.error("Add slot error:", error);

          this.loadingAddSlot = false;

          this.cdr.markForCheck();
        },
      });
  }

  // =========================================================
  // Refresh Month
  // =========================================================

  private refreshMonthAfterAdd(date: Date): void {
    const month = date.getMonth() + 1;

    const year = date.getFullYear();

    const key = this.cacheKey(month, year);

    this.monthCache.delete(key);

    this.rebuildDatesWithSlots();

    if (!this.coachId) {
      return;
    }

    this.fetchMonthSlots(month, year);
  }

  // =========================================================
  // Delete Slot
  // =========================================================

  removeSlot(slot: TimeSlot): void {
    if (!slot) {
      return;
    }

    this.confirmationService.confirm({
      message:
        `Are you sure you want to delete this slot ` +
        `<strong>${this.formatTimeFromUtc(slot.startTimeUtc)}</strong>?`,

      header: "Confirm Delete",

      acceptLabel: "Delete",

      rejectLabel: "Close",

      acceptButtonStyleClass: "no-radius p-button-danger p-button-sm",

      rejectButtonStyleClass: "no-radius p-button-secondary p-button-sm",

      accept: () => {
        this.profileService
          .deleteSlot(slot.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              const month = this.selectedDate
                ? this.selectedDate.getMonth() + 1
                : this.visibleMonth;

              const year = this.selectedDate
                ? this.selectedDate.getFullYear()
                : this.visibleYear;

              const key = this.cacheKey(month, year);

              const monthData = this.monthCache.get(key);

              if (monthData) {
                const day = monthData.find(
                  (item) => item.date === this.selectedDateStr
                );

                if (day) {
                  day.slots = day.slots.filter((item) => item.id !== slot.id);
                }
              }

              this.rebuildDatesWithSlots();

              if (this.selectedDateStr) {
                this.showSlotsForDate(this.selectedDateStr);
              } else {
                this.slotsForSelectedDate = [];
              }

              this.toastService.success(
                "The slot has been deleted successfully",
                "Deleted Successfully"
              );

              this.cdr.markForCheck();
            },

            error: (error) => {
              console.error("Delete slot error:", error);

              this.cdr.markForCheck();
            },
          });
      },
    });
  }

  // =========================================================
  // Form Validation
  // =========================================================

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);

    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(field: string): string {
    const control = this.form.get(field);

    if (control?.errors?.["required"]) {
      return "This field is required";
    }

    if (control?.errors?.["email"]) {
      return "Invalid email";
    }

    return "";
  }

  isLoading(): boolean {
    return this.loadingAddSlot;
  }

  // =========================================================
  // API Date / Time
  // =========================================================

  private toApiDateTime(date: Date, time: Date, timezone: string): string {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(time.getHours()).padStart(2, "0");

    const minutes = String(time.getMinutes()).padStart(2, "0");

    const localDateTime = `${year}-${month}-${day}T${hours}:${minutes}:00`;

    const offset = this.getTimezoneOffset(localDateTime, timezone);

    return `${localDateTime}${offset}`;
  }

  private getTimezoneOffset(localDateTime: string, timezone: string): string {
    const [datePart, timePart] = localDateTime.split("T");

    const [year, month, day] = datePart.split("-").map(Number);

    const [hour, minute, second] = timePart.split(":").map(Number);

    const utcDate = new Date(
      Date.UTC(year, month - 1, day, hour, minute, second)
    );

    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,

      timeZoneName: "longOffset",

      year: "numeric",

      month: "2-digit",

      day: "2-digit",

      hour: "2-digit",

      minute: "2-digit",

      second: "2-digit",

      hourCycle: "h23",
    });

    const parts = formatter.formatToParts(utcDate);

    const offset = parts.find((part) => part.type === "timeZoneName")?.value;

    if (!offset) {
      return "+00:00";
    }

    if (offset === "GMT") {
      return "+00:00";
    }

    const match = offset.match(/^GMT([+-])(\d{1,2})(?::(\d{2}))?$/);

    if (!match) {
      return "+00:00";
    }

    const [, sign, hours, minutes = "00"] = match;

    return `${sign}` + `${hours.padStart(2, "0")}` + `:${minutes}`;
  }

  bookSelectedSlotToUser(): void {
    if (!this.isLoggedIn) {
      this.toastService.warn("You must be logged in to book an appointment");
      return;
    }

    if (!this.selectedTimeSlotToBook) {
      this.toastService.warn(
        "You must select a time slot to book an appointment"
      );
      return;
    }
  }

  // =========================================================
  // Helpers
  // =========================================================

  getImageUrl(path?: string | null): string {
    if (!path) {
      return "";
    }

    if (path.startsWith("http")) {
      return path;
    }

    return `${environment.apiUrl}${path}`;
  }

  getInitial(): string {
    return (this.coach?.fullNameEn ?? "C").charAt(0).toUpperCase();
  }

  get pricingRows(): {
    label: string;
    value: number | undefined;
  }[] {
    return [
      {
        label: "30 MIN",

        value: this.coach?.halfHourPrice,
      },

      {
        label: "1 HOUR",

        value: this.coach?.hourlyPrice,
      },

      {
        label: "1.5 HRS",

        value: this.coach?.OneAndHalfHourPrice,
      },

      {
        label: "2 HOURS",

        value: this.coach?.twoHoursPrice,
      },
    ];
  }

  private cacheKey(month: number, year: number): string {
    return `${year}-` + `${String(month).padStart(2, "0")}`;
  }

  private toDateStr(date: Date): string {
    const y = date.getFullYear();

    const m = String(date.getMonth() + 1).padStart(2, "0");

    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
  }

  formatTimeFromUtc(utc: string): string {
    try {
      const d = new Date(utc);

      const hh = String(d.getHours()).padStart(2, "0");

      const mm = String(d.getMinutes()).padStart(2, "0");

      return `${hh}:${mm}`;
    } catch {
      return utc;
    }
  }

  private toTimeSlot(s: Slot, date: string): TimeSlot {
    return {
      id: s.id,

      date,

      time: this.formatTimeFromUtc(s.startTimeUtc),

      startTime: this.formatTimeFromUtc(s.startTimeUtc),

      endTime: this.formatTimeFromUtc(s.endTimeUtc),

      startTimeUtc: s.startTimeUtc,

      endTimeUtc: s.endTimeUtc,

      periodMinutes: s.periodMinutes,

      status: s.status,
    };
  }

  private toast(severity: "success" | "error" | "info", detail: string): void {
    this.messageService.add({
      severity,

      summary:
        severity === "error"
          ? "Error"
          : severity === "success"
          ? "Success"
          : "Info",

      detail,

      life: 3000,
    });
  }
  formatTime(time: string): string {
    if (!time) {
      return "";
    }

    const [hours, minutes] = time.split(":").map(Number);

    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;

    return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
  }
}