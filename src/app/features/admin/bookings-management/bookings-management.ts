import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, finalize } from 'rxjs';

// PrimeNG
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';

// App imports
import { TableConfig } from '../../../core/models/table-config';
import { SearchService } from '../services/global-table-search.service';
import { BookingsService } from './services/bookings.service';
import { Booking, BookingsQuery, BookingStatus, PaymentStatus } from './bookings.model';
import { ToastService } from '../../../core/services/toast.service';
import { BookingDetailsModalComponent } from './booking-details-modal/booking-details-modal';
import { RescheduleBookingModalComponent } from './reschedule-booking-modal.component/reschedule-booking-modal.component';
import { Coach } from '../coaches-management/Coaches.model';
import { LookupsService } from '../services/lookups.service';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-booking',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CheckboxModule,
    ButtonModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    SelectModule,
    DialogModule,
    DatePicker,
    InputTextModule,
    BookingDetailsModalComponent,
    RescheduleBookingModalComponent

  ],
  providers: [ConfirmationService],
  templateUrl: './bookings-management.html',
  styleUrls: ['./bookings-management.scss']
})
export class BookingsManagement implements OnInit, OnDestroy {
  private bookingsService = inject(BookingsService);
  private lookupService = inject(LookupsService)
  private confirmationService = inject(ConfirmationService);
  private toastServices = inject(ToastService);

  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private searchService = inject(SearchService);

  statusClassMap: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: 'pending',
    [PaymentStatus.FAILED]: 'failed',
    [PaymentStatus.CANCELLED]: 'cancelled',
    [PaymentStatus.REFUNDED]: 'refunded',
    [PaymentStatus.PAID]: 'paid'
  };

  bookingstatusClassMap: Record<BookingStatus, string> = {
    [BookingStatus.COMPLETED]: 'completed',
    [BookingStatus.PAST]: 'past',
    [BookingStatus.RUNNING]: 'running',
    [BookingStatus.UPCOMING]: 'upcoming',
    [BookingStatus.CANCELED]: 'canceled',
  };

  coaches: Coach[] = [];
  coachees: any[] = [];
  bookingStatusOptions: BookingStatus[] = [
    BookingStatus.CANCELED,
    BookingStatus.COMPLETED,
    BookingStatus.PAST,
    BookingStatus.RUNNING,
    BookingStatus.UPCOMING,
  ];
  paymentStatusOptions: PaymentStatus[] = [
    PaymentStatus.CANCELLED,
    PaymentStatus.FAILED,
    PaymentStatus.PENDING,
    PaymentStatus.PAID,
    PaymentStatus.REFUNDED,
  ]


  // ─── State ────────────────────────────────────────────
  bookings = signal<Booking[]>([]);
  isLoading = signal(false);
  selectedRows = signal<Booking[]>([]);
  rescheduleModalVisible = signal(false);
  bookingToReschedule = signal<Booking | null>(null);

  // ─── Modal State (Regular properties, not signals) ────
  detailsModalVisible = signal(false);
  selectedBooking = signal<Booking | null>(null);

  // ─── Table config ─────────────────────────────────────
  tableConfig = new TableConfig({
    defaultSortField: 'fullNameEn',
    defaultSortOrder: 'ASC',
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100]
  });

  pageSizeOptions = computed(() =>
    this.tableConfig.pageSizeOptions().map(size => ({ label: size.toString(), value: size }))
  );

  pageItems = this.tableConfig.pageItems;
  totalPages = this.tableConfig.totalPages;

  trackByCoachId = (_: number, coach: Booking) => coach.id;
  trackByPageItem = (_: number, item: { type: string; value: number }) =>
    `${item.type}-${item.value}`;

  isAllSelected = computed(() =>
    this.bookings().length > 0 && this.selectedRows().length === this.bookings().length
  );

  constructor() {
    toObservable(this.searchService.searchTerm)
      .pipe(
        debounceTime(400),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(term => {
        this.loadBookings();
      });
  }

  // ─── Lifecycle ────────────────────────────────────────
  ngOnInit(): void {
    this.searchService.searchVisible.set(false);
    this.loadBookings();
    this.loadCoaches();
    this.loadCoachees();

  }

  ngOnDestroy(): void {
    this.searchService.clearSearch();
    this.searchService.searchOptions.set([]); // Reset options for next page
  }

  // ─── Load Bookings ────────────────────────────────────
  loadBookings(): void {
    if (this.isLoading()) return;
    this.isLoading.set(true);

    const query: BookingsQuery = {
      pageIndex: this.tableConfig.backendPageIndex(), // 0-based for API
      pageSize: this.tableConfig.pageSize(),
      sortBy: '',
      sortDir: this.tableConfig.sortOrder(),
    };

    this.bookingsService.getBookings(query)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: res => {
          this.bookings.set(res.data);
          this.tableConfig.totalRecords.set(res.count);
          this.tableConfig.pageCount.set(res.pageCount);
          this.tableConfig.pageIndex.set((res.pageIndex ?? 0) + 1); // keep UI 1-based
        },
        error: () => {
          this.toastServices.show(
            'error',
            'Error',
            'Failed to load Bookings'
          );
        }
      });
  }
  refundBoking(booking: Booking): void {
    if (!booking) return;

    this.confirmationService.confirm({
      message: `Are you sure you want to refund <strong>${this.formatCurrency(booking.finalPrice)}</strong> for <strong>${booking.coacheeFullName}</strong>?`,
      header: 'Confirm Refund',
      acceptLabel: 'Refund',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'no-radius p-button-danger p-button-sm',
      rejectButtonStyleClass: 'no-radius p-button-secondary p-button-sm',

      accept: () => {
        if (this.isLoading()) return;

        this.isLoading.set(true);

        this.bookingsService.refundBooking(booking.id)
          .pipe(
            finalize(() => {
              this.isLoading.set(false);
              this.loadBookings();
            }),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe({
            next: () => {
              this.toastServices.show(
                'success',
                'Refund Successful',
                'The booking has been refunded successfully'
              );
            }
          });
      }
    });
  }
  cancelBooking(booking: Booking): void {
    if (!booking) return;

    this.confirmationService.confirm({
      message: `Are you sure you want to cancel The Session for <strong>${booking.coacheeFullName}</strong>?`,
      header: 'Confirm Cancel',
      acceptLabel: 'Cancel',
      rejectLabel: 'Close',
      acceptButtonStyleClass: 'no-radius p-button-danger p-button-sm',
      rejectButtonStyleClass: 'no-radius p-button-secondary p-button-sm',

      accept: () => {
        if (this.isLoading()) return;

        this.isLoading.set(true);

        this.bookingsService.cancelBooking(booking.id)
          .pipe(
            finalize(() => {
              this.isLoading.set(false);
              this.loadBookings();
            }),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe({
            next: () => {
              this.toastServices.show(
                'success',
                'Canceled Successfully',
                'The booking has been canceled successfully'
              );
            }
          });
      }
    });
  }

  onRescheduleComplete(updatedBooking: Booking): void {
    this.closeRescheduleModal();

    this.loadBookings();

    // ✅ Optional: instant UI update (better UX)
    this.bookings.update(list =>
      list.map(b => (b.id === updatedBooking.id ? updatedBooking : b))
    );
  }
  openRescheduleModal(booking: Booking): void {
    this.bookingToReschedule.set(booking);
    this.rescheduleModalVisible.set(true);
  }
  closeRescheduleModal(): void {
    this.rescheduleModalVisible.set(false);
    this.bookingToReschedule.set(null);
  }

  // ─── Sorting ──────────────────────────────────────────
  onSort(field: string): void {
    this.tableConfig.onSort(field);
    this.loadBookings();
  }

  // ─── Pagination ───────────────────────────────────────
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.tableConfig.onPageChange(page);
    this.loadBookings();
  }

  onPageSizeChange(size: number): void {
    this.tableConfig.onPageSizeChange(size);
    this.loadBookings();
  }

  // ─── Row selection ────────────────────────────────────
  toggleSelectAll(checked: boolean): void {
    this.selectedRows.set(checked ? [...this.bookings()] : []);
  }

  toggleRow(booking: Booking, checked: boolean): void {
    if (checked) {
      this.selectedRows.update(rows => [...rows, booking]);
    } else {
      this.selectedRows.update(rows => rows.filter(r => r.id !== booking.id));
    }
  }

  isRowSelected(booking: Booking): boolean {
    return this.selectedRows().some(r => r.id === booking.id);
  }

  // ─── Modal Actions ────────────────────────────────────
  /**
   * Open booking details modal
   * ✅ Pass regular values, not signals
   */
  viewBooking(booking: Booking): void {
    this.selectedBooking.set(booking);
    this.detailsModalVisible.set(true);
  }

  /**
   * Close modal
   */
  closeDetailsModal(): void {
    this.detailsModalVisible.set(false);
    this.selectedBooking.set(null);
  }



  /**
   * Handle action complete from modal
   * Refresh the list after an action is taken
   */
  onBookingActionComplete(updatedBooking: Booking): void {
    // Update the booking in the list
    this.bookings.update(bookings =>
      bookings.map(b => b.id === updatedBooking.id ? updatedBooking : b)
    );

    // Show success message
    this.toastServices.show('success', 'Success', 'Booking action completed successfully');

    // Reload bookings to get latest data
    setTimeout(() => {
      this.loadBookings();
    }, 500);
  }
  formatCurrency(amount: number | undefined): string {
    if (amount === undefined || amount === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  loadCoaches(){
    this.lookupService.loadCoaches()
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (res:any) => {
          this.coaches = res.data;          
        }
      });
  }
 loadCoachees(){
    this.lookupService.loadCoachees()
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (res:any) => {
          this.coachees = res.data;          
        }
      });
  }
  
  // filters logic
  filtersOpen = signal(false);

  filters = signal({
    coachId: null,
    coacheeId: null,
    bookingStatus: null,
    paymentStatus: null,
    dateRange: null as Date[] | null,
    transaction: ''
  });

  toggleFilters() {
    this.filtersOpen.update(v => !v);
  }

  updateFilter(key: string, value: any) {
    this.filters.update(f => ({
      ...f,
      [key]: value
    }));
  }

  clearFilters() {
    this.filters.set({
      coachId: null,
      coacheeId: null,
      bookingStatus: null,
      paymentStatus: null,
      dateRange: null,
      transaction: ''
    });
  }

 applyFilters() {
  const f = this.filters();

  const query: BookingsQuery = {
    pageIndex: this.tableConfig.backendPageIndex(),
    pageSize: this.tableConfig.pageSize(),

    coachId: f.coachId,
    coacheeId: f.coacheeId,
    bookingStatus: f.bookingStatus,
    paymentStatus: f.paymentStatus,
    transaction: f.transaction,

    startDate: f.dateRange?.[0] || null,
    endDate: f.dateRange?.[1] || null,

    search: this.searchService.searchTerm()?.trim() || ''
  };

  this
  .loadBookingsWithFilters(query);
}
loadBookingsWithFilters(query: BookingsQuery): void {
  if (this.isLoading()) return;

  this.isLoading.set(true);

  this.bookingsService.getBookings(query)
    .pipe(
      finalize(() => this.isLoading.set(false)),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe({
      next: res => {
        this.bookings.set(res.data);
        this.tableConfig.totalRecords.set(res.count);
        this.tableConfig.pageCount.set(res.pageCount);
        this.tableConfig.pageIndex.set((res.pageIndex ?? 0) + 1);
      }
    });
}
hasActiveFilters = computed(() => {
  const f = this.filters();
  return !!(
    f.coachId ||
    f.coacheeId ||
    f.bookingStatus ||
    f.paymentStatus ||
    f.transaction ||
    f.dateRange?.length
  );
});
}