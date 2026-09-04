import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { StepperModule } from 'primeng/stepper';
import { SkeletonModule } from 'primeng/skeleton';
import { finalize } from 'rxjs';

import { CoachDetail } from '../../admin/coaches-management/Coaches.model';
import { CoachProfileService } from '../services/coach-profile.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-coach-profile',
  standalone: true,
  imports: [
    CommonModule,
    StepperModule,
    SkeletonModule
  ],
  templateUrl: './coach-profile.component.html',
  styleUrls: ['./coach-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoachProfileComponent implements OnInit {

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly profileService = inject(CoachProfileService);

  readonly baseUrl = environment.apiUrl;

  // =========================================================
  // STEPPER
  // =========================================================

  step = signal(1);

  readonly totalSteps = 3;

  readonly stepLabels = [
    'Information',
    'Profile',
    'Picture'
  ];

  // =========================================================
  // LOADING / PROFILE
  // =========================================================

  readonly isLoading = signal(true);

  readonly profile = signal<CoachDetail | null>(null);

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {
    this.loadProfile();
  }

  // =========================================================
  // LOAD PROFILE
  // =========================================================

  private loadProfile(): void {

    // Always start with skeleton state
    this.isLoading.set(true);
    this.profile.set(null);

    this.profileService
      .getProfileDetails()
      .pipe(
        finalize(() => {
          this.isLoading.set(false);

          // Important for OnPush
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: response => {
          this.profile.set(
            response?.data ?? null
          );

          this.cdr.markForCheck();
        },

        error: error => {

          console.error(
            'Failed to load profile',
            error
          );

          this.profile.set(null);

          this.cdr.markForCheck();
        }
      });
  }

  // =========================================================
  // STEPPER
  // =========================================================

  onStepIconClick(
    value: number,
    activateCallback?: (...args: any[]) => void
  ): void {

    if (this.isLoading()) {
      return;
    }

    if (!this.profile()) {
      return;
    }

    this.step.set(value);

    activateCallback?.();

    this.cdr.markForCheck();
  }

  next(): void {

    if (this.isLoading()) {
      return;
    }

    if (!this.profile()) {
      return;
    }

    if (this.step() >= this.totalSteps) {
      return;
    }

    this.step.update(
      current => current + 1
    );

    this.cdr.markForCheck();
  }

  back(): void {

    if (this.isLoading()) {
      return;
    }

    if (this.step() <= 1) {
      return;
    }

    this.step.update(
      current => current - 1
    );

    this.cdr.detectChanges();
  }

  get activeStep(): number {
    return this.step();
  }

  set activeStep(value: number) {

    if (this.isLoading()) {
      return;
    }

    this.step.set(value);

    this.cdr.markForCheck();
  }

  // =========================================================
  // PROFILE HELPERS
  // =========================================================

  get industriesText(): string {

    const profile = this.profile();

    if (!profile?.coachingIndustries?.length) {
      return 'Not provided';
    }

    return profile.coachingIndustries
      .map(industry => industry.nameEn)
      .join(', ');
  }

  get languagesText(): string {

    const profile = this.profile();

    if (!profile?.languages?.length) {
      return 'Not provided';
    }

    return profile.languages
      .map(language => language.nameEn)
      .join(', ');
  }

  get countryText(): string {

    return this.profile()?.country?.nameEn
      || 'Not provided';
  }

  get nationalityText(): string {

    return this.profile()?.nationality?.nameEn
      || 'Not provided';
  }

  formatGender(
    gender: string | undefined
  ): string {

    if (!gender) {
      return 'Not provided';
    }

    return gender
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(
        /\b\w/g,
        character => character.toUpperCase()
      );
  }

  formatAvailability(
    available: boolean | undefined
  ): string {

    if (available === undefined) {
      return 'Not provided';
    }

    return available
      ? 'Yes'
      : 'No';
  }

  formatDate(
    date: string | undefined
  ): string {

    if (!date) {
      return 'Not provided';
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      'en-GB'
    );
  }

  // =========================================================
  // IMAGE
  // =========================================================

  getImageUrl(
    path: string | null
  ): string {

    if (!path) {
      return 'assets/default-avatar.png';
    }

    return path.startsWith('http') ||
      path.startsWith('data:')
      ? path
      : `${this.baseUrl}${path}`;
  }

  onImageError(
    event: Event
  ): void {

    (
      event.target as HTMLImageElement
    ).src = 'assets/default-avatar.png';
  }
}