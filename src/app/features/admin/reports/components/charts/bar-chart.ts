import { ChangeDetectorRef, Component, inject, Input, OnChanges, OnInit, NgZone, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule],
  templateUrl: './bar-chart.html'
})
export class BarChartComponent implements OnInit, OnChanges {
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  @Input() filters: any;
  chartData: any;
  loading = false;

  constructor() {}

  ngOnInit() {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Only reload if filters changed (not on initial)
    if (changes['filters'] && !changes['filters'].firstChange) {
      this.loadData();
    }
  }

  loadData() {
    this.loading = true;

    this.dashboardService.getBookingStatusCounts(this.filters)
      .subscribe({
        next: (res) => {
          this.ngZone.run(() => {
            const statuses = res.data.statusCounts.map((x: any) => x.nameEn);
            const counts = res.data.statusCounts.map((x: any) => x.count);

            this.chartData = {
              labels: statuses,
              datasets: [
                {
                  label: 'Bookings',
                  data: counts,
                  backgroundColor: this.generateColors(counts.length)
                }
              ]
            };
            this.loading = false;
            this.cdr.markForCheck();
            this.cdr.detectChanges();
          });
        },
        error: (err) => {
          console.error('Error loading chart data:', err);
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

  if (!count || count <= 0) {
    return ['#42A5F5'];
  }

  return Array.from({ length: count }, (_, i) =>
    baseColors[i % baseColors.length]
  );
}
}