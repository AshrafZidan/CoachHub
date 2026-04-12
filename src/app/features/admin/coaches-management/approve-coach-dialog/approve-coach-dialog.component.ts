import {
  Component, inject,
  input, output,
  signal, computed, effect,
  ChangeDetectionStrategy,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { DialogModule }    from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule }    from 'primeng/button';
import { MessageService }  from 'primeng/api';

import { CoachesService } from '../services/Coaches.service';
import { Coach }          from '../Coaches.model';
import { MessageModule } from 'primeng/message';

// ─── Price fields config (DRY) ────────────────────────────
interface PriceField {
  key:   keyof CoachPrices;
  label: string;
}

interface CoachPrices {
  halfHourPrice:       number;
  hourlyPrice:         number;
  oneAndHalfHourPrice: number;
  twoHoursPrice:       number;
}

const PRICE_FIELDS: PriceField[] = [
  { key: 'halfHourPrice',       label: '30 Minutes' },
  { key: 'hourlyPrice',         label: '1 Hour'      },
  { key: 'oneAndHalfHourPrice', label: '1.5 Hours'  },
  { key: 'twoHoursPrice',       label: '2 Hours'     }
];

@Component({
  selector: 'app-approve-coach-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    MessageModule
  ],
  templateUrl: './approve-coach-dialog.component.html',
  styleUrls:   ['./approve-coach-dialog.component.scss']
})
export class ApproveCoachDialogComponent {
  private coachesService = inject(CoachesService);
  private messageService = inject(MessageService);

  private destroyRef = inject(DestroyRef);
  

  // ─── Inputs ───────────────────────────────────────────
  coach   = input.required<Coach>();
  visible = input.required<boolean>();

  // ─── Outputs ──────────────────────────────────────────
  visibleChange = output<boolean>();
  approved      = output<void>();

  // ─── Expose config to template ────────────────────────
  readonly priceFields = PRICE_FIELDS;

  // ─── Local state ──────────────────────────────────────
  isLoading = signal(false);

  prices = signal<CoachPrices>({
    halfHourPrice:       0,
    hourlyPrice:         0,
    oneAndHalfHourPrice: 0,
    twoHoursPrice:       0
  });

  isValid = computed(() =>
    Object.values(this.prices()).every(v => v !== null && v > 0)
  );
touched       = signal<Set<keyof CoachPrices>>(new Set());
formSubmitted = signal(false);

constructor() {
  effect(() => {
    const c = this.coach();

    const incoming: CoachPrices = {
      halfHourPrice:       c.halfHourPrice       ?? 0,
      hourlyPrice:         c.hourlyPrice         ?? 0,
      oneAndHalfHourPrice: c.oneAndHalfHourPrice ?? 0,
      twoHoursPrice:       c.twoHoursPrice       ?? 0
    };

    this.prices.set(incoming);
    this.formSubmitted.set(false);

   
    const preTouched = new Set<keyof CoachPrices>(
      (Object.keys(incoming) as (keyof CoachPrices)[])
        .filter(key => incoming[key] <= 0)
    );

    this.touched.set(preTouched);
  });
}


updatePrice(key: keyof CoachPrices, value: string): void {
  const parsed = parseFloat(value);

  this.touched.update(set => new Set(set).add(key));

  this.prices.update(p => ({
    ...p,
    [key]: isNaN(parsed) ? 0 : parsed
  }));
}

isFieldInvalid(key: keyof CoachPrices): boolean {
  const invalid = this.prices()[key] <= 0;
  return invalid && (this.touched().has(key) || this.formSubmitted());
}


approve(): void {
  this.formSubmitted.set(true);

  if (!this.isValid()) return;

  this.isLoading.set(true);

  this.coachesService
    .approveCoach(this.coach().id, this.prices())
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        this.isLoading.set(false);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Coach approved successfully' });
        this.visibleChange.emit(false);
        this.approved.emit();
      },
      error: () => {
        this.isLoading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to approve coach' });
      }
    });
}

cancel(): void {
  this.formSubmitted.set(false);
  this.touched.set(new Set());
  this.visibleChange.emit(false);
}


}