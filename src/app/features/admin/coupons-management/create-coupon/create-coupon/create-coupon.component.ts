import {
  Component, inject,
  signal, computed,
  ChangeDetectionStrategy,
  DestroyRef,
  OnInit
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, AsyncPipe } from '@angular/common';
import {
  FormBuilder, FormGroup,
  FormsModule, ReactiveFormsModule,
  Validators, AbstractControl, ValidationErrors
} from '@angular/forms';
import { Observable, of } from 'rxjs';

// PrimeNG
import { InputTextModule }  from 'primeng/inputtext';
import { ButtonModule }     from 'primeng/button';
import { DatePicker }       from 'primeng/datepicker';
import { MultiSelect }      from 'primeng/multiselect';
import { Checkbox }         from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';

import { CouponsService }   from '../../services/coupones.service';
import { ToastService }     from '../../../../../core/services/toast.service';
import { LookupsService } from '../../../services/lookups.service';
import { CouponPostData } from '../../coupones.model';
import { SearchService } from '../../../services/global-table-search.service';

function percentageValidator(control: AbstractControl): ValidationErrors | null {
  const v = Number(control.value);
  if (!control.value && control.value !== 0) return null;
  return v >= 1 && v <= 100 ? null : { percentageRange: true };
}

@Component({
  selector: 'app-create-coupon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    DatePicker,
    MultiSelect,
    Checkbox
  ],
  templateUrl: './create-coupon.component.html',
  styleUrls:   ['./create-coupon.component.scss']
})
export class CreateCouponComponent implements OnInit {
  private couponsService = inject(CouponsService);
  private lookupService = inject(LookupsService);
  private searchService = inject(SearchService);


  private toast          = inject(ToastService);
  private destroyRef     = inject(DestroyRef);
  private fb             = inject(FormBuilder);

  // ─── Form ─────────────────────────────────────────────
  form!: FormGroup;

  // ─── State ────────────────────────────────────────────
  isLoading     = signal(false);
  formSubmitted = signal(false);

  // ─── Usage limit mode: 'limit' | 'unlimited' ─────────
  usageMode = signal<'limit' | 'unlimited'>('limit');

  // ─── Assign mode: 'list' | 'all' ─────────────────────
  assignMode = signal<'list' | 'all'>('list');

  // ─── Computed helpers for template ────────────────────
  showUsageLimit = computed(() => this.usageMode() === 'limit');
  showCoachList  = computed(() => this.assignMode() === 'list');

  // ─── Coaches options from API ─────────────────────────
  coachesOptions: { id: number; fullNameEn: string; fullNameAr: string }[] = [];

  // ─── Today for min date ───────────────────────────────
  readonly today = new Date();

  ngOnInit(): void {
    this.searchService.hide();
    this.buildForm();
    this.loadCoaches();
  }

  // ─── Build form ───────────────────────────────────────
  private buildForm(): void {
    this.form = this.fb.group({
      title:['',Validators.required],
      code:               ['', [Validators.required, Validators.minLength(3)]],
      discountPercentage: [null, [Validators.required, percentageValidator]],
      expiryDate:         [null, Validators.required],
      usageLimit:         [null],          // required only when usageMode = 'limit'
      assignedCoaches:    [[]]             // required only when assignMode = 'list'
    });
  }

  // ─── Load coaches for multiselect ─────────────────────
  private loadCoaches(): void {
    this.lookupService.getCoaches()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res:any) => {
          this.coachesOptions = res.data ?? [];
        },
      })
  }

  // ─── Usage mode toggle ────────────────────────────────
  setUsageMode(mode: 'limit' | 'unlimited'): void {
    this.usageMode.set(mode);

    const usageLimitControl = this.form.get('usageLimit')!;

    if (mode === 'limit') {
      usageLimitControl.setValidators([Validators.required, Validators.min(1)]);
    } else {
      usageLimitControl.clearValidators();
      usageLimitControl.reset(null);
    }

    usageLimitControl.updateValueAndValidity();
  }

  // ─── Assign mode toggle ───────────────────────────────
  setAssignMode(mode: 'list' | 'all'): void {
    this.assignMode.set(mode);

    const coachesControl = this.form.get('assignedCoaches')!;

    if (mode === 'list') {
      coachesControl.setValidators(Validators.required);
    } else {
      coachesControl.clearValidators();
      coachesControl.reset([]);
    }

    coachesControl.updateValueAndValidity();
  }

  // ─── Submit ───────────────────────────────────────────
  createCoupon(): void {
    this.formSubmitted.set(true);
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this.isLoading.set(true);

    const value = this.form.value;

    const payload: CouponPostData = {
      title:value.title,
      code:               value.code,
      discountPercentage: value.discountPercentage,
      expiryDate:         value.expiryDate,
      unlimitedUsage:     this.usageMode() === 'unlimited',
      timesOfUse:         this.usageMode() === 'limit' ? value.usageLimit : 0,
      allCoaches:         this.assignMode() === 'all',
          coachIds: this.assignMode() === 'list'
      ? value.assignedCoaches.map((c: any) => c.id)
      : []
    };

    this.couponsService.createCoupon(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.toast.success('Coupon created successfully');
          this.resetForm();
        },
        error: (err) => {
          this.isLoading.set(false);
        }
      });
  }

  // ─── Reset ────────────────────────────────────────────
  resetForm(): void {
    this.form.reset();
    this.usageMode.set('limit');
    this.assignMode.set('list');
    this.formSubmitted.set(false);
    // Re-apply initial validators
    this.setUsageMode('limit');
    this.setAssignMode('list');
  }

  // ─── Validation helpers ───────────────────────────────
  isFieldInvalid(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.invalid && (c.touched || c.dirty || this.formSubmitted());
  }

  getFieldError(name: string): string {
    const c = this.form.get(name);
    if (!c || !(c.touched || c.dirty || this.formSubmitted())) return '';
    if (c.hasError('required'))        return 'This field is required';
    if (c.hasError('minlength'))       return `Minimum ${c.errors?.['minlength']?.requiredLength} characters`;
    if (c.hasError('min'))             return 'Must be at least 1';
    if (c.hasError('percentageRange')) return 'Must be between 1 and 100';
    return 'Invalid value';
  }
  ngOnDestroy() {
    this.searchService.show();
  }
}