import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { StepperModule } from 'primeng/stepper';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { AuthService } from '../../../core/services/auth.service';
import { CoachBasicForm } from '../../admin/coaches-management/edit-coach/steps/coach-basic-form/coach-basic-form';
import { CoachProfessionalForm } from '../../admin/coaches-management/edit-coach/steps/coach-professional-form/coach-professional-form';
import { CoachMediaForm } from '../../admin/coaches-management/edit-coach/steps/coach-media-form/coach-media-form';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    TranslateModule,
    CoachBasicForm,
    CoachProfessionalForm,
    CoachMediaForm,
    StepperModule,
    DatePickerModule,
    MessageModule,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  coacheeSignupForm!: FormGroup;
  coachSignupForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  role: 'COACHEE' | 'COACH' = 'COACHEE';

  step = signal(1);
  isStep1 = computed(() => this.step() === 1);
  isStep2 = computed(() => this.step() === 2);
  isStep3 = computed(() => this.step() === 3);

  basicForm!: FormGroup;
  professionalForm!: FormGroup;
  mediaForm!: FormGroup;

  // Step labels (displayed beside the step number) and total steps
  totalSteps = 3;
  stepLabels: string[] = ['Basic', 'Professional', 'Media'];



  // proxy property so template two-way binds to the signal
  get activeStep(): number {
    return this.step();
  }
  set activeStep(v: number) {
    const current = this.step();
    if (v === current) return;

    // moving backwards is always allowed
    if (v < current) {
      this.step.set(v);
      return;
    }

    // moving forward: validate all intermediate steps
    for (let s = current; s < v; s++) {
      const f = this.formForStep(s);
      // if the form isn't initialized yet, block progression
      if (!f) {
        return;
      }

      // ensure validation state is up-to-date before checking
      f.updateValueAndValidity({ onlySelf: false, emitEvent: true });
      if (f.invalid) {
        f.markAllAsTouched();
        return; // block progression
      }
    }

    this.step.set(v);
  }

  private formForStep(n: number): FormGroup | null {
    if (this.role !== 'COACH') return null;
    if (n === 1) return this.basicForm;
    if (n === 2) return this.professionalForm;
    if (n === 3) return this.mediaForm;
    return null;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const r = (params['role']).toString().toUpperCase();
      this.role = r === 'COACH' ? 'COACH' : 'COACHEE';
      this.initForm();
    });
  }

  // Navigation for coach multi-step
  next(): void {
    if (this.step() < 3) this.activeStep = this.step() + 1;
  }

  back(): void {
    if (this.step() > 1) this.activeStep = this.step() - 1;
  }

  // Called from step icon clicks. Validates intermediate steps then activates.
  onStepIconClick(value: number, activateCallback?: (...args: any[]) => void) {
    const current = this.step();
    // if clicking current or previous step, allow
    if (value <= current) {
      this.activeStep = value;
      if (activateCallback) activateCallback();
      return;
    }

    // validate intermediate steps
    for (let s = current; s < value; s++) {
      const f = this.formForStep(s);
      if (!f) return;
      f.updateValueAndValidity({ onlySelf: false, emitEvent: true });
      if (f.invalid) {
        f.markAllAsTouched();
        return;
      }
    }

    // All good, activate
    this.activeStep = value;
    if (activateCallback) activateCallback();
  }

  initForm(): void {
    this.coacheeSignupForm = this.fb.group(
      {
        fullName: ['', [Validators.required]],
        birthDate: [null as Date | null, [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?\d+$/)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );

    this.coachSignupForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        bio: [''],
      },
      { validators: this.passwordMatchValidator }
    );

    // initialize multi-step coach forms (reuse admin forms structure)
    this.basicForm = this.fb.group({
      fullNameEn: ['', Validators.required],
      fullNameAr: ['', Validators.required],
      gender: ['', Validators.required],
      birthDate: [null as Date | null, Validators.required],
      countryId: ['', Validators.required],
      nationalityId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    whatsAppNumber: ['', [Validators.required, Validators.pattern(/^\+?\d+$/) ]],
      halfHourPrice: [null as number | null, [Validators.required, Validators.min(1)]],
      hourlyPrice: [null as number | null, [Validators.required, Validators.min(1)]],
      oneAndHalfHourPrice: [null as number | null, [Validators.required, Validators.min(1)]],
      twoHoursPrice: [null as number | null, [Validators.required, Validators.min(1)]],
    });

    // When used in the signup flow we hide prices via [showPrices]=false.
    // Remove price validators here so the coach basic step won't be invalid
    // during registration (admin edit still uses validators by default).
    if (this.role === 'COACH') {
      const priceFields = ['halfHourPrice', 'hourlyPrice', 'oneAndHalfHourPrice', 'twoHoursPrice'];
      priceFields.forEach((name) => {
        const ctrl = this.basicForm.get(name);
        if (ctrl) {
          ctrl.clearValidators();
          ctrl.setErrors(null);
          ctrl.updateValueAndValidity({ emitEvent: false });
        }
      });
    }

    this.professionalForm = this.fb.group({
      yearsOfExperience: [null as number | null, [Validators.required]],
      coachingIndustriesIds: [[] as string[], Validators.required],
      languageIds: [[] as string[], Validators.required],
      availableEveryWeek: [false as boolean, Validators.required],
      jobTitle: ['', Validators.required],
      bio: ['', [Validators.required, Validators.minLength(10)]],
      education: ['', [Validators.required]],
      experience: ['', [Validators.required]],
    });

    this.mediaForm = this.fb.group({
      username: ['', Validators.required],
      profileImageUrl: [''],
      profileImageId: [''],
      certificates: this.fb.array([])
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }

    return null;
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || '';
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Coachee getters
  get fullName() {
    return this.coacheeSignupForm.get('fullName')!;
  }
  get birthDate() {
    return this.coacheeSignupForm.get('birthDate')!;
  }
  get email() {
    return this.coacheeSignupForm.get('email')!;
  }
  get phoneNumber() {
    return this.coacheeSignupForm.get('phoneNumber')!;
  }
  get password() {
    return this.coacheeSignupForm.get('password')!;
  }
  get confirmPassword() {
    return this.coacheeSignupForm.get('confirmPassword')!;
  }

  // Coach getters
  get firstName() {
    return this.coachSignupForm.get('firstName')!;
  }
  get lastName() {
    return this.coachSignupForm.get('lastName')!;
  }
  get coachEmail() {
    return this.coachSignupForm.get('email')!;
  }
  get coachPhone() {
    return this.coachSignupForm.get('phoneNumber')!;
  }
  get coachPassword() {
    return this.coachSignupForm.get('password')!;
  }
  get coachConfirmPassword() {
    return this.coachSignupForm.get('confirmPassword')!;
  }

  async onSubmit(): Promise<void> {
    if (this.role === 'COACH') {
      // if not last step, advance
      if (this.step() !== 3) {
        const form = this.step() === 1 ? this.basicForm : this.step() === 2 ? this.professionalForm : this.mediaForm;
        if (form.invalid) {
          form.markAllAsTouched();
          return;
        }
        this.next();
        return;
      }

      // final submit for coach
      if (this.basicForm.invalid || this.professionalForm.invalid || this.mediaForm.invalid) {
        this.basicForm.markAllAsTouched();
        this.professionalForm.markAllAsTouched();
        this.mediaForm.markAllAsTouched();
        this.coachSignupForm.markAllAsTouched();
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const payload = {
        fullNameEn: this.basicForm.value.fullNameEn,
        fullNameAr: this.basicForm.value.fullNameAr,
        gender: this.basicForm.value.gender,
        birthDate: this.basicForm.value.birthDate,
        countryId: this.basicForm.value.countryId,
        nationalityId: this.basicForm.value.nationalityId,
        email: this.basicForm.value.email,
        whatsAppNumber: this.basicForm.value.whatsAppNumber,
        yearsOfExperience: this.professionalForm.value.yearsOfExperience,
        coachingIndustriesIds: this.professionalForm.value.coachingIndustriesIds,
        languageIds: this.professionalForm.value.languageIds,
        availableEveryWeek: this.professionalForm.value.availableEveryWeek,
        jobTitle: this.professionalForm.value.jobTitle,
        bio: this.professionalForm.value.bio,
        education: this.professionalForm.value.education,
        experience: this.professionalForm.value.experience,
        username: this.mediaForm.value.username,
        profileImageUrl: this.mediaForm.value.profileImageUrl,
        certificates: this.mediaForm.value.certificates,
        password: this.coachSignupForm.value.password,
      };

      payload.whatsAppNumber = (payload.whatsAppNumber || '').toString().replace(/\D+/g, '');

      const profileImage = (() => {
        const url = this.mediaForm.value.profileImageUrl;
        if (!url) return undefined;
        if (typeof url === 'string' && url.startsWith('data:')) {
          const match = url.match(/^data:(.+);base64,(.*)$/);
          return match
            ? { contentType: match[1], content: match[2], attachmentName: 'profile.jpg' }
            : undefined;
        }
        return this.mediaForm.value.profileImageId
          ? { id: this.mediaForm.value.profileImageId }
          : undefined;
      })();

      const certificates = await Promise.all(
        (this.mediaForm.value.certificates || []).map(async (c: any) => {
          if (!c) return null;
          if (c.file instanceof File) {
            const content = await this.fileToBase64(c.file);
            return {
              attachmentName: c.name || c.file.name,
              name: c.name || c.file.name,
              contentType: c.contentType || c.file.type || 'application/octet-stream',
              content,
            };
          }
          if (typeof c.file === 'string' && c.file.startsWith('data:')) {
            const match = c.file.match(/^data:(.+);base64,(.*)$/);
            return match
              ? { attachmentName: c.name || 'certificate', name: c.name || 'certificate', contentType: match[1], content: match[2] }
              : null;
          }
          if (c.id) {
            return { id: c.id, contentType: c.contentType, attachmentName: c.name, name: c.name, fileUrl: c.fileUrl };
          }
          if (c.fileUrl && c.fileUrl.startsWith('blob:')) {
            return null;
          }
          return null;
        })
      );

      const coachPayload = {
        fullNameEn: payload.fullNameEn,
        fullNameAr: payload.fullNameAr,
        gender: payload.gender,
        birthDate: payload.birthDate,
        countryId: payload.countryId,
        nationalityId: payload.nationalityId,
        email: payload.email,
        whatsAppNumber: payload.whatsAppNumber,
        yearsOfExperience: payload.yearsOfExperience,
        languageIds: payload.languageIds,
        availableEveryWeek: payload.availableEveryWeek,
        jobTitle: payload.jobTitle,
        bio: payload.bio,
        education: payload.education,
        experience: payload.experience,
        coachingIndustriesIds: payload.coachingIndustriesIds,
        username: payload.username,
        password: this.coachSignupForm?.get('password')?.value || payload.password,
        language: 'EN',
        profileImage: profileImage,
        certificates: certificates.filter(Boolean),
      };

      this.auth.registerCoach(coachPayload).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Coach account creation successful!';
          this.auth.cleartoken();
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.message || 'Registration failed.';
        },
      });

      return;
    }

    // default: coachee
    if (this.coacheeSignupForm.invalid) {
      this.coacheeSignupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      fullName: this.coacheeSignupForm.value.fullName,
      birthDate: this.coacheeSignupForm.value.birthDate,
      email: this.coacheeSignupForm.value.email,
      phoneNumber: this.coacheeSignupForm.value.phoneNumber,
      password: this.coacheeSignupForm.value.password,
      language: 'EN',
    };

    this.auth.registerCoachee(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Registration successful!';
        this.auth.cleartoken();
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.message || 'Registration failed.';
      },
    });
  }
}
