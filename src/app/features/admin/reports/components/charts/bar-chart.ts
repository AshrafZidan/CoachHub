import {
  Component,
  inject,
  input,
  ChangeDetectionStrategy,
  DestroyRef,
  signal,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DashboardService } from '../../dashboard.service';

export interface FilterDates {
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule, ProgressSpinnerModule],
  templateUrl: './bar-chart.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarChartComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly destroyRef = inject(DestroyRef);
  
  // ✅ Input signal with default
  filters = input<FilterDates>({
    startDate: '',
    endDate: ''
  });
  
  // ✅ State signals
  chartData = signal<any>(null);
  chartOptions = signal<any>(null);
  loading = signal(false);

  private lastLoadedKey = signal<string>('');

  constructor() {
    console.log('[BarChart] Component constructed');
    
    // ✅ Use effect to watch filters input and trigger load
    effect(() => {
      const currentFilters = this.filters();
      const filterKey = `${currentFilters.startDate}|${currentFilters.endDate}`;
      
      console.log('[BarChart] Effect running');
      console.log('[BarChart] Current filters:', currentFilters);
      console.log('[BarChart] Current key:', filterKey);
      console.log('[BarChart] Last loaded key:', this.lastLoadedKey());

      // ✅ Only load if filter values have actually changed
      if (filterKey === this.lastLoadedKey()) {
        console.log('[BarChart] Filters unchanged, skipping API call');
        return;
      }

      console.log('[BarChart] Filters changed, calling API');
      this.lastLoadedKey.set(filterKey);
      this.loadData(currentFilters);
    });
  }

  /**
   * Load booking status counts
   */
  private loadData(filters: FilterDates): void {
    console.log('[BarChart] loadData called with:', filters);
    this.loading.set(true);

    this.dashboardService
      .getBookingStatusCounts(filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          console.log('[BarChart] Data received:', res);

          const statuses = res.data?.statusCounts?.map((x: any) => x.nameEn) || [];
          const counts = res.data?.statusCounts?.map((x: any) => x.count) || [];

          console.log('[BarChart] Statuses:', statuses);
          console.log('[BarChart] Counts:', counts);

          this.chartData.set({
            labels: statuses,
            datasets: [
              {
                label: 'Bookings',
                data: counts,
                backgroundColor: this.generateColors(counts.length),
                borderRadius: 4,
                borderSkipped: false
              }
            ]
          });

          this.chartOptions.set({
            indexAxis: 'x',
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            },
            maintainAspectRatio: false
          });

          this.loading.set(false);
          console.log('[BarChart] Chart updated successfully');
        },
        error: (error: any) => {
          console.error('[BarChart] Error loading data:', error);
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