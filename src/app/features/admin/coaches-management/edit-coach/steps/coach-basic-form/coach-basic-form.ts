import {
  Component,
  Input,
  inject,
  OnInit
} from '@angular/core';

import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

import { SelectModule } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { LookupsService } from '../../../../services/lookups.service';
import { WhatsappInputComponent } from '../../../../../../shared/whatsapp-input/whatsapp-input';
import { log } from 'console';

@Component({
  selector: 'app-coach-basic-form',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    SelectModule,
    DatePicker,
    InputTextModule,
    WhatsappInputComponent
  ],
  templateUrl: './coach-basic-form.html',
  styleUrl: './coach-basic-form.scss',
})
export class CoachBasicForm implements OnInit {

  @Input() form!: FormGroup;

  private service = inject(LookupsService);

  // =========================
  // STATE
  // =========================
  countries: any[] = [];
  selectedCountry: any = null;
  isLoading = false;

  // =========================
  // DROPDOWNS
  // =========================
  genders = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' }
  ];

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {
    this.loadCountries();

    this.form.get('countryId')?.valueChanges.subscribe(countryId => {
      this.selectedCountry = this.countries.find(c => c.value === countryId);
    });
  }

  // =========================
  // COUNTRIES
  // =========================
  loadCountries(): void {
  this.isLoading = true;

   this.form.patchValue({
    halfHourPrice: this.form.get('halfHourPrice')?.value ?? 0,
    hourlyPrice: this.form.get('hourlyPrice')?.value ?? 0,
    oneAndHalfHourPrice: this.form.get('oneAndHalfHourPrice')?.value ?? 0,
    twoHoursPrice: this.form.get('twoHoursPrice')?.value ?? 0,
  });
  
  this.service.getCountries().subscribe(res => {
    this.countries = res?.map((c: any) => ({
      label: c.name?.common,
      value: c.cca2,
      flag: c.flags?.png,
      dialCode: c.idd?.root + (c.idd?.suffixes?.[0] || ''),
      countryId:c.cca2
    }));

    this.isLoading = false;

    setTimeout(() => {
      
      const countryId = this.form.get('countryId')?.value;
      const nationalityId = this.form.get('nationalityId')?.value;
      
      if (countryId ) {
        const match = this.countries.find(c => c.value === countryId);
        const matchNa = this.countries.find(c => c.value === nationalityId)
        if (match) {
          this.selectedCountry = match;
          
          this.form.get('countryId')?.setValue(countryId, { emitEvent: false });
        }
        
        if (matchNa) {
            this.form.get('nationalityId')?.setValue(nationalityId, { emitEvent: false });

        }
      }
    }, 10);
    });
  }

  // =========================
  // COUNTRY CHANGE
  // =========================
  onCountryChange(event: any) {
    const country = this.countries.find(c => c.value === event.value);
    if (!country) return;

    this.selectedCountry = country;

    // reset number when country changes
    this.form.get('whatsAppNumber')?.setValue('');
  }

  // =========================
  // VALIDATION
  // =========================
  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  hasError(controlName: string, error?: string): boolean {
    const control = this.form.get(controlName);
    if (!control) return false;

    const show = control.touched || control.dirty;

    return error
      ? control.hasError(error) && show
      : control.invalid && show;
  }
}