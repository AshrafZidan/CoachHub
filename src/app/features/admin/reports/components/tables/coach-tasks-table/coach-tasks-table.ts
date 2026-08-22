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

export interface CoachTask {
  id: number;
  taskTitle: string;
  dueDate: string;
  status: string;
  coachFullNameEn: string;
  coachFullNameAr: string;
  coacheeFullName: string;
  coacheePhoneNumber: string;
}

@Component({
  selector: 'app-coach-tasks-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    ToastModule
  ],
  templateUrl: './coach-tasks-table.html',
  styleUrls: ['./coach-tasks-table.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoachTasksTableComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly destroyRef = inject(DestroyRef);

  // ✅ Input signal
  filters = input<FilterDates>({
    startDate: '',
    endDate: ''
  });

  // ✅ State signals
  tasks = signal<CoachTask[]>([]);
  isLoading = signal(false);
  selectedRows = signal<CoachTask[]>([]);

  // ✅ Table configuration
  tableConfig = new TableConfig({
    defaultSortField: 'taskTitle',
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
    this.tasks().length > 0 && this.selectedRows().length === this.tasks().length
  );

  // ✅ Track by functions
  trackByTaskId = (_: number, task: CoachTask) => task.id;
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
        this.loadTasks();
      },
      { allowSignalWrites: true }
    );
  }

  /**
   * Load coach tasks
   * ✅ IMPORTANT: This is only called from effect or pagination
   */
  private loadTasks(): void {
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
      .getCoachTasks(filters.startDate, filters.endDate, pageIndex, pageSize)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
          this.isLoadingData.set(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (res: any) => {

          this.tasks.set(res.data || []);
          this.tableConfig.totalRecords.set(res.count || 0);
          this.tableConfig.pageCount.set(res.pageCount || 0);
          this.tableConfig.pageIndex.set((res.pageIndex ?? 0) + 1);

          // Clear selection on new data
          this.selectedRows.set([]);
        },
        error: (err) => {
          console.error('[CoachTasksTable] Error loading tasks:', err);
          this.tasks.set([]);
        }
      });
  }

  /**
   * Handle pagination - triggers API call
   */
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;

    this.tableConfig.onPageChange(page);
    this.loadTasks();
  }

  /**
   * Handle page size change - triggers API call
   */
  onPageSizeChange(size: number): void {
    this.tableConfig.onPageSizeChange(size);
    this.loadTasks();
  }

  /**
   * Toggle select all rows
   */
  toggleSelectAll(checked: boolean): void {
    this.selectedRows.set(checked ? [...this.tasks()] : []);
  }

  /**
   * Toggle row selection
   */
  toggleRow(task: CoachTask, checked: boolean): void {
    const selected = this.selectedRows();

    if (checked) {
      if (!selected.find(t => t.id === task.id)) {
        this.selectedRows.set([...selected, task]);
      }
    } else {
      this.selectedRows.set(selected.filter(t => t.id !== task.id));
    }
  }

  /**
   * Check if row is selected
   */
  isRowSelected(task: CoachTask): boolean {
    return this.selectedRows().some(t => t.id === task.id);
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