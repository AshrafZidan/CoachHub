import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportFiltersComponent } from './components/filters/filters';
import { BarChartComponent } from './components/charts/bar-chart';
import { PieChartComponent } from './components/charts/pie-chart';
import { TabsModule } from 'primeng/tabs';



@Component({
  selector: 'app-report-page',
  standalone: true,
  imports: [
    CommonModule,
    ReportFiltersComponent,
    BarChartComponent,
    PieChartComponent,
    TabsModule
  ],
  templateUrl: './reports.html',
  styleUrls: ['./reports.scss']
})
export class ReportPageComponent {
  activeTabIndex = 0;

  onApplyFilters(filters: any) {
    this.filters = { ...filters };
  }

  onClearFilters() {
    this.filters = {};
  }

  onTabChange(event: any) {
    this.activeTabIndex = event.index;
  }
  filters: any = {
  startDate: this.getDefaultStartDate(),
  endDate: this.getDefaultEndDate()
};

private getDefaultStartDate() {
  const d = new Date();
  d.setDate(1); // first day of month
  return d.toISOString().split('T')[0];
}

private getDefaultEndDate() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}
}