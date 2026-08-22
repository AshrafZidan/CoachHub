import {
  Component,
  inject,
  input,
  ChangeDetectionStrategy,
  DestroyRef,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs';
import { signal, effect } from '@angular/core';
import { TableConfig } from '../../../../../../core/models/table-config';
import { DashboardService } from '../../../dashboard.service';

export interface FilterDates {
  startDate: string;
  endDate: string;
}

interface CoachBooking {
 coachId: number;

  coachFullNameEn: string;
  coachFullNameAr: string;

  bookingCount: number;
  totalRevenue: number;

  cancelledBookingCount: number;
  upcomingBookingCount: number;
  completedBookingCount: number;
  lostCoacheeCount: number;
}

@Component({
  selector: 'app-coach-bookings-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    ToastModule
  ],
  templateUrl: './coach-bookings-table.html',
  styleUrls: ['./coach-bookings-table.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoachBookingsTableComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly destroyRef = inject(DestroyRef);

  // ✅ Input signal
  filters = input<FilterDates>({
    startDate: '',
    endDate: ''
  });

  // ✅ State signals
  bookings = signal<CoachBooking[]>([]);
  isLoading = signal(false);
  selectedRows = signal<CoachBooking[]>([]);

  // ✅ Table configuration
  tableConfig = new TableConfig({
    defaultSortField: 'coachFullName',
    defaultSortOrder: 'ASC',
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100]
  });

  // ✅ Computed values
  pageSizeOptions = computed(() =>
    this.tableConfig.pageSizeOptions().map(size => ({ label: size.toString(), value: size }))
  );

  pageItems = this.tableConfig.pageItems;
  totalPages = this.tableConfig.totalPages;

  isAllSelected = computed(() =>
    this.bookings().length > 0 && this.selectedRows().length === this.bookings().length
  );

  // ✅ Track by functions
  trackByBookingId = (_: number, booking: CoachBooking) => booking.coachId;
  trackByPageItem = (_: number, item: { type: string; value: number }) =>
    `${item.type}-${item.value}`;

  // ✅ Track last filters to prevent duplicate calls
  private lastFilters = signal<string>('');
  private isLoadingData = signal(false);

  constructor() {
    // ✅ Effect triggers only when FILTERS change (not table config)
    effect(
      () => {
        const currentFilters = this.filters();
        const filterKey = `${currentFilters.startDate}|${currentFilters.endDate}`;

        // ✅ IMPORTANT: Only load if filters actually changed
        if (filterKey === this.lastFilters()) {
          return;
        }

        this.lastFilters.set(filterKey);
        this.tableConfig.onPageChange(1); // Reset to page 1
        this.loadBookings();
      },
      { allowSignalWrites: true }
    );
  }

  /**
   * Load coach bookings
   * ✅ IMPORTANT: This is only called from effect or pagination/sorting
   */
  private loadBookings(): void {
    // ✅ Prevent multiple simultaneous requests
    if (this.isLoadingData()) {
      return;
    }

    if (this.isLoading()) {
      return;
    }

    const filters = this.filters();

    this.isLoading.set(true);
    this.isLoadingData.set(true);

    const pageIndex = this.tableConfig.backendPageIndex();
    const pageSize = this.tableConfig.pageSize();



    this.dashboardService
      .getCoachBookings(filters.startDate, filters.endDate, pageIndex, pageSize)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
          this.isLoadingData.set(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (res: any) => {

          this.bookings.set(res.data || []);
          this.tableConfig.totalRecords.set(res.count || 0);
          this.tableConfig.pageCount.set(res.pageCount || 0);
          this.tableConfig.pageIndex.set((res.pageIndex ?? 0) + 1);

          // Clear selection on new data
          this.selectedRows.set([]);
        },
        error: (err) => {
          console.error('[CoachBookingsTable] Error loading bookings:', err);
          this.bookings.set([]);
        }
      });
  }

  /**
   * Handle sorting - triggers API call
   */
  onSort(field: string): void {
    this.tableConfig.onSort(field);
    this.loadBookings();
  }

  /**
   * Handle pagination - triggers API call
   */
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;

    this.tableConfig.onPageChange(page);
    this.loadBookings();
  }

  /**
   * Handle page size change - triggers API call
   */
  onPageSizeChange(size: number): void {
    this.tableConfig.onPageSizeChange(size);
    this.loadBookings();
  }

  /**
   * Toggle select all rows
   */
  toggleSelectAll(checked: boolean): void {
    this.selectedRows.set(checked ? [...this.bookings()] : []);
  }



  /**
   * Format currency
   */
  formatCurrency(amount: number | undefined): string {
    if (amount === undefined || amount === null) return '-';

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  /**
   * Format date
   */
  formatDate(date: string): string {
    if (!date) return '-';

    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}