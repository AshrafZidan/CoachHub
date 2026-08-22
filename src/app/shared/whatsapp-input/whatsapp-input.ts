import { NgIf } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-whatsapp-input',
  templateUrl: './whatsapp-input.html',
  styleUrls: ['./whatsapp-input.scss'],
  imports: [NgIf,InputTextModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WhatsappInputComponent),
      multi: true
    }
  ]
})
export class WhatsappInputComponent implements ControlValueAccessor {

  @Input() countries: any[] = [];
  @Input() selectedCountry: any;

  value: string = '';
  code: string = '';
  private fullValue: string = '';

  onChange = (_: any) => {};
  onTouched = () => {};
  ngOnChanges(): void {
    this.applyPhoneFormat();
}

  writeValue(value: any): void {
    if (!value) {
      this.value = '';
      this.fullValue = '';
      this.code = '';
      return;
    }

    this.fullValue = value.toString();

    // normalize to digits-only for internal handling
    const digitsOnly = this.fullValue.replace(/\D+/g, '');
    const dialCode = (this.selectedCountry?.dialCode || '').toString().replace(/\D+/g, '');

    if (dialCode && digitsOnly.startsWith(dialCode)) {
      this.code = dialCode;
      this.value = digitsOnly.slice(dialCode.length);
    } else {
      this.value = digitsOnly;
      this.code = dialCode || '';
    }
}
  private applyPhoneFormat(): void {
    if (!this.fullValue) return;

    const digitsOnly = this.fullValue.toString().replace(/\D+/g, '');
    const dialCode = (this.selectedCountry?.dialCode || '').toString().replace(/\D+/g, '');

    if (dialCode && digitsOnly.startsWith(dialCode)) {
      this.code = dialCode;
      this.value = digitsOnly.slice(dialCode.length);
    } else {
      this.value = digitsOnly;
      this.code = dialCode || '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInputChange(val: string) {
    this.value = val;
    this.emitValue();
  }

  onCountryChange(country: any) {
    // ensure we store numeric dial code only
    this.code = (country?.dialCode || '').toString().replace(/\D+/g, '');
    this.selectedCountry = country;
    this.emitValue();
  }

  private emitValue() {
    const digitsValue = (this.value || '').toString().replace(/\D+/g, '');
    const dial = (this.code || (this.selectedCountry?.dialCode || '')).toString().replace(/\D+/g, '');
    const fullDigits = `${dial}${digitsValue}`.replace(/\D+/g, '');
    // emit digits-only full number (no +)
    this.onChange(fullDigits || '');
  }
  setValue(val: string) {
    const digitsOnly = (val || '').toString().replace(/\D+/g, '');
    this.value = digitsOnly;
    this.emitValue();
}

}