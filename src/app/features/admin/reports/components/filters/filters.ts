import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-report-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, FormsModule,DatePicker],
  templateUrl: './filters.html',
  styleUrl: './filters.scss'

})
export class ReportFiltersComponent {

filters = signal({
  startDate: null,
  endDate: null
});
filtersOpen = signal(true); // default open


  @Output() apply = new EventEmitter<any>();
  @Output() clear = new EventEmitter<void>();

 form!: FormGroup;

constructor(private fb: FormBuilder) {
  this.form = this.fb.group({
    dateFrom: [''],
    dateTo: [''],
    status: ['']
  });
}

   

  applyFilters() {
  const f = this.filters();

  this.apply.emit({
    startDate: f.startDate,
    endDate: f.endDate
  });
}

  updateFilter(key: 'startDate' | 'endDate', value: any) {
  this.filters.update(f => ({
    ...f,
    [key]: value
  }));
}

 clearFilters() {
  this.filters.set({
    startDate: null,
    endDate: null
  });

  this.clear.emit();
}
 hasActiveFilters(): boolean {
  const f = this.filters();

  if (!f.startDate || !f.endDate) return false;

  return new Date(f.startDate) <= new Date(f.endDate);
}

toggleFilters() {
  this.filtersOpen.update(value => !value);
}
}