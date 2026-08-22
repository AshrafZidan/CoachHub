import {
  Component,
  inject,
  output,
  ChangeDetectionStrategy,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastService } from '../../../../../core/services/toast.service';

export interface FilterDates {
  startDate: string | Date;
  endDate: string | Date;
}

@Component({
  selector: 'app-report-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DatePickerModule, CardModule],
  templateUrl: './filters.html',
  styleUrls: ['./filters.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportFiltersComponent {
      private toast   = inject(ToastService);
    
  // ✅ Output signals for type-safe event emission
  apply = output<FilterDates>();
  clear = output<void>();

  startDate = signal<Date | null>(new Date(new Date().getFullYear(), 0, 1));
endDate = signal<Date | null>(new Date());
  filtersOpen = signal(true);

  // ✅ Computed signal to check if filters are active
  hasActiveFilters = computed(() => {
    const start = this.startDate();
    const end = this.endDate();
    return !!(start && end);
  });

  /**
   * Toggle filters visibility
   */
  toggleFilters(): void {
    this.filtersOpen.update(v => !v);
  }

  /**
   * Apply filters
   */
  onApply(): void {
    const start = this.startDate();
    const end = this.endDate();

    if (!start || !end) {
               this.toast.warn('Please select both start and end dates', 'Filters');
      return;
    }

    if (start > end) {
    this.toast.warn('Please ensure the start date is before the end date', 'Filters');

      return;
    }

    console.log('[ReportFilters] Applying filters:', {
      startDate: this.formatDate(start),
      endDate: this.formatDate(end)
    });

    // ✅ Emit new object with formatted dates
    this.apply.emit({
      startDate: this.formatDate(start),
      endDate: this.formatDate(end)
    });
  }

  /**
   * Clear filters
   */
  onClear(): void {
    this.startDate.set(null);
    this.endDate.set(null);
    this.clear.emit();
  }

  /**
   * Format date to YYYY-MM-DD string
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
  
