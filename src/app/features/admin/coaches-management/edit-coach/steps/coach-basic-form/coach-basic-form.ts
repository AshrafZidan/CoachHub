import {
  Component,
  Input,
  inject,
  OnInit,
  OnChanges,
  SimpleChanges
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
  @Input() countriesInput: any[] | null = null;

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
    // If parent provided countries, use them; otherwise load from service
    if (this.countriesInput && this.countriesInput.length) {
      this.countries = this.countriesInput.map((c: any) => ({
        label: c.nameEn,
        value: c.id,
        flag: c.flags?.png,
        dialCode: c.code,
        countryId: c.id
      }));
      
      this.matchFormValuesWithCountries();
    } else {
      this.loadCountries();
    }

    // Listen for country selection changes
    this.form.get('countryId')?.valueChanges.subscribe(countryId => {
      const numCountryId = Number(countryId);
      this.selectedCountry = this.countries.find(c => c.value === numCountryId);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['countriesInput'] && changes['countriesInput'].currentValue) {
      const list = changes['countriesInput'].currentValue as any[];
      this.countries = list.map((c: any) => ({
        label: c.nameEn,
        value: c.id,
        flag: c.flags?.png,
        dialCode: c.code,
        countryId: c.id
      }));

      this.matchFormValuesWithCountries();
    }
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
  
    this.service.getCountriesfrombackend().subscribe((res:any) => {
      this.isLoading = false;

      this.countries = res?.data?.map((c: any) => ({
        label: c.nameEn,
        value: c.id,
        flag: c.flags?.png,
        dialCode: c.code,
        countryId: c.id
      }));
      this.matchFormValuesWithCountries();
    });
  }

  private matchFormValuesWithCountries(): void {
    const countryIdValue = this.form.get('countryId')?.value;
    const nationalityIdValue = this.form.get('nationalityId')?.value;
    
    // Convert to number for comparison since dropdown values are numbers
    const countryId = countryIdValue ? Number(countryIdValue) : null;
    const nationalityId = nationalityIdValue ? Number(nationalityIdValue) : null;
    
    if (countryId) {
      const match = this.countries.find(c => c.value === countryId);
      if (match) {
        this.selectedCountry = match;
        this.form.get('countryId')?.setValue(countryId, { emitEvent: false });
      }
    }
    
    if (nationalityId) {
      const matchNa = this.countries.find(c => c.value === nationalityId);
      if (matchNa) {
        this.form.get('nationalityId')?.setValue(nationalityId, { emitEvent: false });
      }
    }

    // If form values are empty but countries exist, parent may still be loading coach data
    // Retry after a delay to catch values once parent patches the form
    if (!countryId && !nationalityId && this.countries.length) {
      setTimeout(() => this.matchFormValuesWithCountries(), 300);
    }
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