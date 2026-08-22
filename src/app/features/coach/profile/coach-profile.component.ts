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
import { CoachDetail } from '../../admin/coaches-management/Coaches.model';
import { CoachProfileService } from '../services/coach-profile.service';
import { finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';



@Component({
  selector: 'app-coach-profile',
  standalone: true,
  imports: [
    CommonModule,
    StepperModule
  ],
  templateUrl: './coach-profile.component.html',
  styleUrls: ['./coach-profile.component.scss'],
})
export class CoachProfileComponent implements OnInit {

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly profileService = inject(CoachProfileService);
  readonly baseUrl = environment.apiUrl;

  step = signal(1);

  readonly totalSteps = 3;

  readonly stepLabels = [
    'Information',
    'Profile',
    'Picture'
  ];

  isLoading = true;

  profile: CoachDetail | null = null;

  ngOnInit(): void {
    this.loadProfile();
  }

 
 private loadProfile(): void {
  this.isLoading = true;
  this.profile = null;

  this.cdr.detectChanges();

  this.profileService.getProfileDetails()
    .pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: response => {
        this.profile = response?.data ?? null;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Failed to load profile', error);
        this.profile = null;
        this.cdr.detectChanges();
      }
    });
}

  onStepIconClick(
    value: number,
    activateCallback?: (...args: any[]) => void
  ): void {

    const current = this.step();

    /*
     * Allow moving backward and
     * moving to current step.
     */
    if (value <= current) {

      this.step.set(value);

      if (activateCallback) {
        activateCallback();
      }

      this.cdr.markForCheck();

      return;
    }

    
    this.step.set(value);

    if (activateCallback) {
      activateCallback();
    }

    this.cdr.markForCheck();
  }

  next(): void {

    if (this.step() >= this.totalSteps) {
      return;
    }

    this.step.update(
      current => current + 1
    );

    this.cdr.markForCheck();
  }

  back(): void {

    if (this.step() <= 1) {
      return;
    }

    this.step.update(
      current => current - 1
    );

    this.cdr.markForCheck();
  }

  get activeStep(): number {
    return this.step();
  }

  set activeStep(value: number) {
    this.step.set(value);
  }

  get industriesText(): string {

    if (!this.profile?.coachingIndustries?.length) {
      return 'Not provided';
    }

    return this.profile.coachingIndustries
      .map(industry => industry.nameEn)
      .join(', ');
  }


  get languagesText(): string {

    if (!this.profile?.languages?.length) {
      return 'Not provided';
    }

    return this.profile.languages
      .map(language => language.nameEn)
      .join(', ');
  }

  get countryText(): string {
    return this.profile?.country?.nameEn || 'Not provided';
  }

  get nationalityText(): string {
    return this.profile?.nationality?.nameEn || 'Not provided';
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

    return available ? 'Yes' : 'No';
  }

  formatDate(
    date: string | undefined
  ): string {

    if (!date) {
      return 'Not provided';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      'en-GB'
    );
  }

    getImageUrl(path: string | null): string {
    if (!path) return 'assets/default-avatar.png';

    return path.startsWith('http') || path.startsWith('data:')
      ? path
      : `${this.baseUrl}${path}`;

  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/default-avatar.png';
  }
}