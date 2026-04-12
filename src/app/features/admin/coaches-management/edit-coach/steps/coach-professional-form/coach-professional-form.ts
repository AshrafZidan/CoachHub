import { Component, inject, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgIf  } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { LookupsService } from '../../../../services/lookups.service';
import {  map, shareReplay } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';
import { CoachDetail } from '../../../Coaches.model';

@Component({
  selector: 'app-coach-professional-form',
  standalone: true,
  imports: [AsyncPipe,MultiSelectModule,ReactiveFormsModule, NgIf, InputTextModule, CheckboxModule, SelectModule],
  templateUrl: './coach-professional-form.html',
  styleUrls: ['./coach-professional-form.scss']
})
export class CoachProfessionalForm {
  @Input() form!: FormGroup;

  private service = inject(LookupsService);
  constructor() {
  }

  coachingIndustriesOptions$ = this.service.getCoachingIndustries().pipe(
    map((res: any) =>
      (res.data ?? []).map((item: any) => ({
        label: item.nameEn,
        value: item.id
      }))
    ),
    shareReplay(1)
  );
  languagesOptions$ = this.service.getLanguages().pipe(
    map((res: any) =>
      (res.data ?? []).map((item: any) => ({
        label: item.nameEn,
        value: item.id
      }))
    ),
    shareReplay(1)
  );

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