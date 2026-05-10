import { Component, inject, Input, OnChanges, OnInit, SimpleChanges, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule],
  templateUrl: './pie-chart.html'
})
export class PieChartComponent implements OnInit, OnChanges {
  private dashboardService = inject(DashboardService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  @Input() filters: any;

  chartData: any;
  chartOptions: any;
  loading = false;

  ngOnInit() {
    // Initial load when page opens
    if (this.filters?.startDate && this.filters?.endDate) {
      this.loadData(this.filters.startDate, this.filters.endDate);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Only reload if filters changed (not on initial)
    if (changes['filters'] && !changes['filters'].firstChange && this.filters) {
      const { startDate, endDate } = this.filters;

      if (!startDate || !endDate) return;

      this.loadData(startDate, endDate);
    }
  }

  loadData(startDate: string, endDate: string) {
    this.loading = true;

    this.dashboardService
      .getIndustryPaidBookings(startDate, endDate)
      .subscribe({
        next: (res: any) => {
          this.ngZone.run(() => {
            this.chartData = {
              labels: res.data.map((x: any) => x.industryNameEn),
              datasets: [
                {
                  data: res.data.map((x: any) => x.paidBookingCount),
                  backgroundColor: this.generateColors(res.data.length)
                }
              ]
            };
            this.loading = false;
            this.cdr.markForCheck();
            this.cdr.detectChanges();
          });
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }
  generateColors(count: number): string[] {
  const baseColors = [
    '#42A5F5','#66BB6A','#FFA726','#EF5350','#AB47BC',
    '#26C6DA','#FF7043','#9CCC65','#5C6BC0','#EC407A',
    '#FFCA28','#8D6E63','#78909C','#26A69A','#D4E157'
  ];

  // 🔥 important: always return at least 1 color
  if (!count || count <= 0) {
    return ['#42A5F5'];
  }

  return Array.from({ length: count }, (_, i) =>
    baseColors[i % baseColors.length]
  );
}
}