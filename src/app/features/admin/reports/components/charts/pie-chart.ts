import {
  Component,
  inject,
  input,
  ChangeDetectionStrategy,
  DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DashboardService } from '../../dashboard.service';
import { signal } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

export interface FilterDates {
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule, ProgressSpinnerModule],
  templateUrl: './pie-chart.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieChartComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly destroyRef = inject(DestroyRef);

  // ✅ Input signal
  filters = input<FilterDates>({
    startDate: '',
    endDate: ''
  });

  // ✅ State signals
  chartData = signal<any>(null);
  chartOptions = signal<any>(null);
  loading = signal(false);
    private lastFilters = signal<string>('');


  constructor() {
    
    // ✅ Use toObservable to properly watch the input signal changes
    toObservable(this.filters)
      .pipe(
        distinctUntilChanged((prev, curr) => {
          const prevKey = `${prev?.startDate}|${prev?.endDate}`;
          const currKey = `${curr?.startDate}|${curr?.endDate}`;
          return prevKey === currKey;
        }),
        debounceTime(100),
        switchMap(filters => {
          const filterKey = `${filters.startDate}|${filters.endDate}`;
          console.log('[PieChart] Observable triggered with filters:', filters);
          console.log('[PieChart] Filter key:', filterKey);
          console.log('[PieChart] Last filters key:', this.lastFilters());
          
          if (filterKey === this.lastFilters()) {
            console.log('[PieChart] Filters unchanged, skipping API call');
            return [];
          }
          
          console.log('[PieChart] Filters changed, calling API');
          this.lastFilters.set(filterKey);
          this.loadData(filters);
          return [];
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * Load industry paid bookings data
   */
  private loadData(filters: FilterDates): void {
    console.log('[PieChart] loadData called with:', filters);
    this.loading.set(true);

    this.dashboardService
      .getIndustryPaidBookings(filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          console.log('[PieChart] Data received:', res);

          this.chartData.set({
            labels: res.data.map((x: any) => x.industryNameEn),
            datasets: [
              {
                data: res.data.map((x: any) => x.paidBookingCount),
                backgroundColor: this.generateColors(res.data.length),
                borderWidth: 0
              }
            ]
          });

          this.chartOptions.set({
            plugins: {
              legend: {
                position: 'bottom'
              }
            },
            maintainAspectRatio: false
          });

          this.loading.set(false);
          console.log('[PieChart] Chart updated successfully');
        },
        error: (error: any) => {
          console.error('[PieChart] Error loading data:', error);
          this.loading.set(false);
        }
      });
  }

  /**
   * Generate colors for chart data
   */
  private generateColors(count: number): string[] {
    const baseColors = [
      '#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC',
      '#26C6DA', '#FF7043', '#9CCC65', '#5C6BC0', '#EC407A',
      '#FFCA28', '#8D6E63', '#78909C', '#26A69A', '#D4E157'
    ];

    return Array.from(
      { length: Math.max(count, 1) },
      (_, i) => baseColors[i % baseColors.length]
    );
  }
}