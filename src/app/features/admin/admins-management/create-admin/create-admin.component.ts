import {
  Component, inject,
  signal,
  ChangeDetectionStrategy,
  DestroyRef,
  OnInit
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import {
  FormBuilder, FormGroup,
  FormsModule, ReactiveFormsModule,
  Validators
} from '@angular/forms';

// PrimeNG
import { InputTextModule }  from 'primeng/inputtext';
import { MultiSelect }      from 'primeng/multiselect';

import { ToastService }     from '../../../../core/services/toast.service';
import { LookupsService } from '../../services/lookups.service';
import { SearchService } from '../../services/global-table-search.service';
import { Adminservice } from '../services/admins-management.service';
import {  AdminsPermissions } from '../admins.model';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-create-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MultiSelect,
  ],
  templateUrl: './create-admin.component.html',
  styleUrls:   ['./create-admin.component.scss']
})
export class CreateAdminComponent implements OnInit {
  private adminsService = inject(Adminservice);
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

  adminsPermissions: AdminsPermissions []= [];


  ngOnInit(): void {
    this.searchService.hide();
    this.buildForm();
    this.loadPermissions();
  }

  // ─── Build form ───────────────────────────────────────
  private buildForm(): void {
    this.form = this.fb.group({
      fullName:['',Validators.required],
      email: [null, [Validators.required, Validators.email]],
      permissions:[[], Validators.required],
    });

  
  }

  // ─── Load permissions for multiselect ─────────────────────
  private loadPermissions(): void {
    this.lookupService.loadPermissions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res:any) => {
          this.adminsPermissions = res.data ?? [];
        },
      })
  }


  // ─── Submit ───────────────────────────────────────────
  createAdminAccount(): void {
    this.formSubmitted.set(true);
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this.isLoading.set(true);

    const value = this.form.value;
    const payload = {
  fullName: value.fullName,
  email: value.email,
  permissions: value.permissions.map((p: any) => p.code)
};

 
    this.adminsService.createAdminAccount(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.toast.success('Admin created successfully');
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
    this.formSubmitted.set(false);
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