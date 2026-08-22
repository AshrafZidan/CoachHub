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
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule, ProgressSpinnerModule],
  templateUrl: './line-chart.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly destroyRef = inject(DestroyRef);
  totalRevenue:number = 0;
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
    
    effect(() => {
      const currentFilters = this.filters();
      const filterKey = `${currentFilters.startDate}|${currentFilters.endDate}`;
      
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
   * Load revenue data
   */
  private loadData(filters: FilterDates): void {
    console.log('[BarChart] loadData called with:', filters);
    this.loading.set(true);

    this.dashboardService
      .getRevenue(filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (res: any) => {
  const monthly = res?.data?.monthlyRevenue ?? [];
  this.totalRevenue = (res?.data?.totalRevenue ?? 0);

  // ✅ Extract labels + data
  const labels = monthly.map((m: any) => m.monthNameEn);
  const data = monthly.map((m: any) => m.revenue);

  // ✅ Set chart data
  this.chartData.set({
    labels,
    datasets: [
      {
        label: 'Revenue',
        data,
        fill: false,
        tension: 0.4,
        borderColor: '#42A5F5',
        backgroundColor: '#42A5F5',
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  });

  // ✅ (keep your options or improve below)
  this.chartOptions.set({
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#000' }
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `$${ctx.raw}`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#666' },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#666',
          callback: (value: number) => `$${value}`
        }
      }
    }
  });

  this.loading.set(false);
},
        error: (error: any) => {
          console.error('[LineChart] Error loading data:', error);
          this.loading.set(false);
        }
      });
  }

}