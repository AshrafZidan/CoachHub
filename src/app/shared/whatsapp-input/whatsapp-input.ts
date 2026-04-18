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
    return;
  }

  this.fullValue = value;

  // try parsing immediately if country is ready
  this.applyPhoneFormat();
}
private applyPhoneFormat(): void {
  const dialCode = this.selectedCountry?.dialCode;

  if (!dialCode || !this.fullValue) {
    return; // wait until country is ready
  }

  if (this.fullValue.startsWith(dialCode)) {
    this.value = this.fullValue.slice(dialCode.length);
    this.code = dialCode;
  } else {
    this.value = this.fullValue;
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
    this.code = country?.phoneCode || '';
    this.emitValue();
  }

  private emitValue() {
    const fullNumber = `${this.code}${this.value}`;
    this.onChange(fullNumber); 
  }
  setValue(val: string) {
  this.value = val;

  const fullNumber = `${this.selectedCountry?.dialCode || ''}${val}`;
  this.onChange(fullNumber);
}

}