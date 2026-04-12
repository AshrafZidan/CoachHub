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

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setValue(val: string) {
    this.value = val;
    this.onChange(val);
  }
}