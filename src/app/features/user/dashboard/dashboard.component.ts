import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="dashboard-container">
      <h1>{{ 'USER.DASHBOARD_TITLE' | translate }}</h1>
      <p>{{ 'USER.WELCOME' | translate }}</p>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class DashboardComponent {}
