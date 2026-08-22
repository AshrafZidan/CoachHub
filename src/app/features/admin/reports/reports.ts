import {
  Component,
  ChangeDetectionStrategy,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { FilterDates, ReportFiltersComponent } from './components/filters/filters';
import { CoachTasksTableComponent } from './components/tables/coach-tasks-table/coach-tasks-table';
import { PieChartComponent } from './components/charts/pie-chart';
import { BarChartComponent } from './components/charts/bar-chart';
import { CoachBookingsTableComponent } from './components/tables/coach-bookings-table/coach-bookings-table';
import { LineChartComponent } from './components/charts/line-chart';

@Component({
  selector: 'app-report-page',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    PieChartComponent,
    BarChartComponent,
    LineChartComponent,
    ReportFiltersComponent,
    CoachBookingsTableComponent,
    CoachTasksTableComponent
  ],
  templateUrl: './reports.html',
  styleUrls: ['./reports.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportPageComponent {

  // ✅ Signal with empty strings - will load ALL data
  filters = signal<any>({
   startDate : this.formatDate(new Date(new Date().getFullYear(), 0, 1)),
   endDate :this.formatDate(new Date())
    
  });

  /**
   * Apply filters from filter component
   */
  onApplyFilters(newFilters: FilterDates): void {
    // ✅ Create new object reference to trigger signal change
    this.filters.set({ ...newFilters });
  }

  /**
   * Clear all filters - back to empty (all data)
   */
  onClearFilters(): void {
    this.filters.set({
      startDate: '',
      endDate: ''
    });
  }
    private formatDate(date: Date | null): string | null {
    if (!date) return null;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}