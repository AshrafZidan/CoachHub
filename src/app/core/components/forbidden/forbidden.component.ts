import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  template: `
    <div class="forbidden-container">
      <div class="forbidden-content">
        <!-- Error Code -->
        <h1 class="error-code">403</h1>

        <!-- Error Title -->
        <h2 class="error-title">Access Denied</h2>

        <!-- Error Description -->
        <p class="error-description">
          You don't have permission to access this resource. Please contact your
          administrator if you believe this is a mistake.
        </p>

        <!-- Permission Info -->
        <div class="permission-info">
          <p class="info-label">Requested URL:</p>
          <p class="info-value">{{ requestedUrl }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button
            pButton
            type="button"
            label="Go to Coaches"
            icon="pi pi-home"
            class="p-button-primary p-button-lg"
            (click)="goToCoaches()"
          ></button>

          <button
            pButton
            type="button"
            label="Go Back"
            icon="pi pi-arrow-left"
            class="p-button-secondary p-button-lg"
            (click)="goBack()"
          ></button>
        </div>
      </div>

      <!-- Decorative Element -->
      <div class="forbidden-decoration">
        <i class="pi pi-lock"></i>
      </div>
    </div>
  `,
  styles: [`
    .forbidden-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    .forbidden-content {
      background: white;
      border-radius: 12px;
      padding: 3rem;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      text-align: center;
      z-index: 10;
      position: relative;
    }

    .error-code {
      font-size: 5rem;
      font-weight: 700;
      color: #667eea;
      margin: 0;
      line-height: 1;
      letter-spacing: -2px;
    }

    .error-title {
      font-size: 1.875rem;
      color: #1f2937;
      margin: 1rem 0;
      font-weight: 600;
    }

    .error-description {
      font-size: 1rem;
      color: #6b7280;
      margin: 1.5rem 0 2rem;
      line-height: 1.6;
    }

    .permission-info {
      background: #f3f4f6;
      border-left: 4px solid #667eea;
      padding: 1rem;
      margin: 2rem 0;
      border-radius: 4px;
      text-align: left;
    }

    .info-label {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0 0 0.5rem 0;
      font-weight: 500;
    }

    .info-value {
      font-size: 0.875rem;
      color: #1f2937;
      margin: 0;
      font-family: 'Monaco', 'Menlo', monospace;
      word-break: break-all;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .action-buttons button {
      flex: 1;
      min-width: 200px;
    }

    .forbidden-decoration {
      position: absolute;
      top: -50px;
      right: -50px;
      width: 300px;
      height: 300px;
      opacity: 0.1;
      z-index: 1;
    }

    .forbidden-decoration i {
      font-size: 300px;
      color: white;
    }

    @media (max-width: 640px) {
      .forbidden-container {
        padding: 1rem;
      }

      .forbidden-content {
        padding: 2rem 1.5rem;
      }

      .error-code {
        font-size: 3rem;
      }

      .error-title {
        font-size: 1.5rem;
      }

      .action-buttons {
        flex-direction: column;
      }

      .action-buttons button {
        min-width: auto;
      }
    }
  `],
})
export class ForbiddenComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  requestedUrl = '';

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.requestedUrl = params['returnUrl'] || '/admin';
    });
  }

  goToCoaches(): void {
    this.router.navigate(['/admin/coaches']);
  }

  goBack(): void {
    window.history.back();
  }
}