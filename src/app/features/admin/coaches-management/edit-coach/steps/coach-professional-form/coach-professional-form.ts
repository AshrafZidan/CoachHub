import { Component, inject, Input, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgIf } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';

import { LookupsService } from '../../../../services/lookups.service';
import { forkJoin, map, shareReplay, finalize } from 'rxjs';
import { ProgressSpinner } from 'primeng/progressspinner';
@Component({
  selector: 'app-coach-professional-form',
  standalone: true,
  imports: [
    AsyncPipe,
    MultiSelectModule,
    ReactiveFormsModule,
    NgIf,
    InputTextModule,
    CheckboxModule,
    SelectModule,
    ProgressSpinner
  ],
  templateUrl: './coach-professional-form.html',
  styleUrls: ['./coach-professional-form.scss']
})
export class CoachProfessionalForm {
  @Input() form!: FormGroup;

  isLoading = signal(true); // ✅ يبدأ true
availabilityOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false }
];
  private service = inject(LookupsService);

  options$ = forkJoin({
    industries: this.service.getCoachingIndustries(),
    languages: this.service.getLanguages()
  }).pipe(
    map((res: any) => ({
      industries: (res.industries.data ?? []).map((item: any) => ({
        label: item.nameEn,
        value: item.id
      })),
      languages: (res.languages.data ?? []).map((item: any) => ({
        label: item.nameEn,
        value: item.id
      }))
    })),
    finalize(() => this.isLoading.set(false)),
    shareReplay(1)
  );

  // ─── Validation ───────────────────────────────
  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  getError(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !(control.touched || control.dirty)) return '';

    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('min')) return 'Value must be greater than 0';
    if (control.hasError('max')) return 'Value is too large';

    return '';
  }
}