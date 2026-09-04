import {
  Component,
  inject,
  OnInit,
  signal,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { StepperModule } from 'primeng/stepper';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { DatePickerModule } from 'primeng/datepicker';

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
    MessageModule
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup implements OnInit {

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  coacheeSignupForm!: FormGroup;
  coachSignupForm!: FormGroup;

  basicForm!: FormGroup;
  professionalForm!: FormGroup;
  mediaForm!: FormGroup;

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  role: 'COACHEE' | 'COACH' = 'COACH';

  step = signal(1);

  isStep1 = computed(() => this.step() === 1);
  isStep2 = computed(() => this.step() === 2);
  isStep3 = computed(() => this.step() === 3);

  totalSteps = 3;

  stepLabels: string[] = [
    'Basic',
    'Professional',
    'Media'
  ];

  get activeStep(): number {
    return this.step();
  }

  set activeStep(v: number) {
    const current = this.step();

    if (v === current) {
      return;
    }

    // Moving backwards is always allowed
    if (v < current) {
      this.step.set(v);
      return;
    }

    // Moving forward: validate all intermediate steps
    for (let s = current; s < v; s++) {
      const form = this.formForStep(s);

      if (!form) {
        return;
      }

      form.updateValueAndValidity({
        onlySelf: false,
        emitEvent: true
      });

      if (form.invalid) {
        form.markAllAsTouched();
        return;
      }
    }

    this.step.set(v);
  }

  private formForStep(n: number): FormGroup | null {
    if (this.role !== 'COACH') {
      return null;
    }

    if (n === 1) {
      return this.basicForm;
    }

    if (n === 2) {
      return this.professionalForm;
    }

    if (n === 3) {
      return this.mediaForm;
    }

    return null;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const role = String(params['role'] || '').toUpperCase();

      this.role = role === 'COACH'
        ? 'COACH'
        : 'COACHEE';

      this.initForm();
    });
  }

  next(): void {
    
    if (this.step() < 3) {
      this.activeStep = this.step() + 1;
    }
  }

  back(): void {
    if (this.step() > 1) {
      this.activeStep = this.step() - 1;
    }
  }

  onStepIconClick(
    value: number,
    activateCallback?: (...args: any[]) => void
  ): void {

    const current = this.step();

    // Current or previous step
    if (value <= current) {
      this.activeStep = value;

      if (activateCallback) {
        activateCallback();
      }

      return;
    }

    // Validate intermediate steps
    for (let s = current; s < value; s++) {
      const form = this.formForStep(s);

      if (!form) {
        return;
      }

      form.updateValueAndValidity({
        onlySelf: false,
        emitEvent: true
      });

      if (form.invalid) {
        form.markAllAsTouched();
        return;
      }
    }

    this.activeStep = value;

    if (activateCallback) {
      activateCallback();
    }
  }

  initForm(): void {

    /*
     * COACHEE FORM
     */
    this.coacheeSignupForm = this.fb.group(
      {
        fullName: ['', Validators.required],

        birthDate: [
          null as Date | null,
          Validators.required
        ],

        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],

        phoneNumber: [
          '',
          [
            Validators.required,
            Validators.pattern(/^\+?\d+$/)
          ]
        ],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8)
          ]
        ],

        confirmPassword: [
          '',
          Validators.required
        ]
      },
      {
        validators: this.passwordMatchValidator
      }
    );

    /*
     * COACH PASSWORD FORM
     *
     * Keep this form responsible for password only.
     */
    this.coachSignupForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8)
          ]
        ],

        confirmPassword: [
          '',
          Validators.required
        ]
      },
      {
        validators: this.passwordMatchValidator
      }
    );

    /*
     * COACH BASIC FORM
     *
     * Hour prices stay here and remain required.
     * They are simply NOT included in the API payload.
     */
    this.basicForm = this.fb.group({
      fullNameEn: [
        '',
        Validators.required
      ],

      fullNameAr: [
        '',
        Validators.required
      ],

      gender: [
        '',
        Validators.required
      ],

      birthDate: [
        null as Date | null,
        Validators.required
      ],

      countryId: [
        '',
        Validators.required
      ],

      nationalityId: [
        '',
        Validators.required
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      whatsAppNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\+?\d+$/)
        ]
      ],

      halfHourPrice: [
        null as number | null,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      hourlyPrice: [
        null as number | null,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      oneAndHalfHourPrice: [
        null as number | null,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      twoHoursPrice: [
        null as number | null,
        [
          Validators.required,
          Validators.min(1)
        ]
      ]
    });

    /*
     * COACH PROFESSIONAL FORM
     */
    this.professionalForm = this.fb.group({
      yearsOfExperience: [
        null as number | null,
        Validators.required
      ],

      coachingIndustriesIds: [
        [] as string[],
        Validators.required
      ],

      languageIds: [
        [] as string[],
        Validators.required
      ],

      availableEveryWeek: [
        false as boolean,
        Validators.required
      ],

      jobTitle: [
        '',
        Validators.required
      ],

      bio: [
        '',
        [
          Validators.required,
          Validators.minLength(10)
        ]
      ],

      education: [
        '',
        Validators.required
      ],

      experience: [
        '',
        Validators.required
      ]
    });

    /*
     * COACH MEDIA FORM
     */
    this.mediaForm = this.fb.group({
      username: [
        '',
        Validators.required
      ],

      profileImageUrl: ['',Validators.required],
      certificates: this.fb.array([])
    });
  }

  passwordMatchValidator(form: FormGroup): null {
    const passwordControl = form.get('password');
    const confirmPasswordControl = form.get('confirmPassword');

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    /*
     * If confirm password is empty,
     * DON'T remove the required error.
     */
    if (!confirmPassword) {
      return null;
    }

    /*
     * If password is empty, required validator
     * on password should handle it.
     */
    if (!password) {
      return null;
    }

    /*
     * Passwords don't match.
     */
    if (password !== confirmPassword) {
      confirmPasswordControl.setErrors({
        ...confirmPasswordControl.errors,
        mismatch: true
      });

      return null;
    }

    /*
     * Passwords match.
     * Remove only the mismatch error,
     * without destroying other validators.
     */
    const errors = {
      ...(confirmPasswordControl.errors || {})
    };

    delete errors['mismatch'];

    confirmPasswordControl.setErrors(
      Object.keys(errors).length > 0
        ? errors
        : null
    );

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

  /*
   * COACHEE GETTERS
   */

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

  /*
   * COACH PASSWORD GETTERS
   */

  get coachPassword() {
    return this.coachSignupForm.get('password')!;
  }

  get coachConfirmPassword() {
    return this.coachSignupForm.get('confirmPassword')!;
  }

  async onSubmit(): Promise<void> {

    /*
     * ==========================================
     * COACH
     * ==========================================
     */
    if (this.role === 'COACH') {

      /*
       * STEP 1 / STEP 2
       *
       * Validate current step before moving forward.
       */
      if (this.step() !== 3) {

        const form =
          this.step() === 1
            ? this.basicForm
            : this.professionalForm;

        form.updateValueAndValidity({
          onlySelf: false,
          emitEvent: true
        });

        if (form.invalid) {
          form.markAllAsTouched();
          return;
        }

        this.next();
        return;
      }

      /*
       * FINAL SUBMIT
       *
       * IMPORTANT:
       * coachSignupForm is included here.
       */
      const forms = [
        this.basicForm,
        this.professionalForm,
        this.mediaForm,
        this.coachSignupForm
      ];

      forms.forEach((form) => {
        form.updateValueAndValidity({
          onlySelf: false,
          emitEvent: true
        });
      });

      const hasInvalidForm = forms.some(
        (form) => form.invalid
      );

      if (hasInvalidForm) {
        forms.forEach((form) => {
          form.markAllAsTouched();
        });

        return;
      }

      /*
       * Extra protection.
       *
       * Even if something changes in the validators,
       * don't send an empty password to the API.
       */
      const password =
        this.coachSignupForm.get('password')?.value;

      const confirmPassword =
        this.coachSignupForm.get('confirmPassword')?.value;

      if (
        !password ||
        !confirmPassword ||
        password !== confirmPassword
      ) {
        this.coachSignupForm.markAllAsTouched();
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      /*
       * Build the payload.
       *
       * NOTE:
       * The hour prices are intentionally NOT here.
       */
      const payload = {
        fullNameEn: this.basicForm.value.fullNameEn,
        fullNameAr: this.basicForm.value.fullNameAr,
        gender: this.basicForm.value.gender,
        birthDate: this.basicForm.value.birthDate,
        countryId: this.basicForm.value.countryId,
        nationalityId: this.basicForm.value.nationalityId,
        email: this.basicForm.value.email,
        whatsAppNumber:
          (this.basicForm.value.whatsAppNumber || '')
            .toString()
            .replace(/\D+/g, ''),

        yearsOfExperience:
          this.professionalForm.value.yearsOfExperience,

        coachingIndustriesIds:
          this.professionalForm.value.coachingIndustriesIds,

        languageIds:
          this.professionalForm.value.languageIds,

        availableEveryWeek:
          this.professionalForm.value.availableEveryWeek,

        jobTitle:
          this.professionalForm.value.jobTitle,

        bio:
          this.professionalForm.value.bio,

        education:
          this.professionalForm.value.education,

        experience:
          this.professionalForm.value.experience,

        username:
          this.mediaForm.value.username,

        profileImageUrl:
          this.mediaForm.value.profileImageUrl,

        certificates:
          this.mediaForm.value.certificates,
halfHourPrice: this.basicForm.value.halfHourPrice,
        hourlyPrice: this.basicForm.value.hourlyPrice,
        oneAndHalfHourPrice: this.basicForm.value.oneAndHalfHourPrice,
        twoHoursPrice: this.basicForm.value.twoHoursPrice,
        password,
        
      };

      /*
       * PROFILE IMAGE
       */
      const profileImage = (() => {

        const url =
          this.mediaForm.value.profileImageUrl;

        if (!url) {
          return undefined;
        }

        if (
          typeof url === 'string' &&
          url.startsWith('data:')
        ) {
          const match = url.match(
            /^data:(.+);base64,(.*)$/
          );

          return match
            ? {
                contentType: match[1],
                content: match[2],
                attachmentName: 'profile.jpg'
              }
            : undefined;
        }

        return this.mediaForm.value.profileImageId
          ? {
              id: this.mediaForm.value.profileImageId
            }
          : undefined;
      })();

      /*
       * CERTIFICATES
       */
      const certificates = await Promise.all(
        (this.mediaForm.value.certificates || [])
          .map(async (c: any) => {

            if (!c) {
              return null;
            }

            if (c.file instanceof File) {

              const content =
                await this.fileToBase64(c.file);

              return {
                attachmentName:
                  c.name || c.file.name,

                name:
                  c.name || c.file.name,

                contentType:
                  c.contentType ||
                  c.file.type ||
                  'application/octet-stream',

                content
              };
            }

            if (
              typeof c.file === 'string' &&
              c.file.startsWith('data:')
            ) {

              const match = c.file.match(
                /^data:(.+);base64,(.*)$/
              );

              return match
                ? {
                    attachmentName:
                      c.name || 'certificate',

                    name:
                      c.name || 'certificate',

                    contentType:
                      match[1],

                    content:
                      match[2]
                  }
                : null;
            }

            if (c.id) {
              return {
                id: c.id,
                contentType: c.contentType,
                attachmentName: c.name,
                name: c.name,
                fileUrl: c.fileUrl
              };
            }

            if (
              c.fileUrl &&
              c.fileUrl.startsWith('blob:')
            ) {
              return null;
            }

            return null;
          })
      );

      /*
       * FINAL API PAYLOAD
       *
       * Hour prices are NOT included.
       */
      const coachPayload = {
        fullNameEn: payload.fullNameEn,
        fullNameAr: payload.fullNameAr,
        gender: payload.gender,
        birthDate: payload.birthDate,
        countryId: payload.countryId,
        nationalityId: payload.nationalityId,
        email: payload.email,
        whatsAppNumber: payload.whatsAppNumber,

        yearsOfExperience:
          payload.yearsOfExperience,

        languageIds:
          payload.languageIds,

        availableEveryWeek:
          payload.availableEveryWeek,

        jobTitle:
          payload.jobTitle,

        bio:
          payload.bio,

        education:
          payload.education,

        experience:
          payload.experience,

        coachingIndustriesIds:
          payload.coachingIndustriesIds,

        username:
          payload.username,

        password:
          password,

        language: 'EN',

        profileImage:
          profileImage,
        certificates:
          certificates.filter(Boolean),
          halfHourPrice: this.basicForm.value.halfHourPrice,
        hourlyPrice: this.basicForm.value.hourlyPrice,
        oneAndHalfHourPrice: this.basicForm.value.oneAndHalfHourPrice,
        twoHoursPrice: this.basicForm.value.twoHoursPrice,
          
      };

      this.auth.registerCoach(coachPayload).subscribe({

        next: () => {
          this.isLoading = false;

          this.successMessage =
            'Coach account creation successful!';

          this.auth.cleartoken();

          this.router.navigate([
            '/auth/login'
          ]);
        },

        error: (err) => {
          this.isLoading = false;

          this.errorMessage =
            err?.message ||
            'Registration failed.';
        }
      });

      return;
    }

    /*
     * ==========================================
     * COACHEE
     * ==========================================
     */

    this.coacheeSignupForm.updateValueAndValidity({
      onlySelf: false,
      emitEvent: true
    });

    if (this.coacheeSignupForm.invalid) {
      this.coacheeSignupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      fullName:
        this.coacheeSignupForm.value.fullName,

      birthDate:
        this.coacheeSignupForm.value.birthDate,

      email:
        this.coacheeSignupForm.value.email,

      phoneNumber:
        this.coacheeSignupForm.value.phoneNumber,

      password:
        this.coacheeSignupForm.value.password,

      language: 'EN'
    };

    this.auth.registerCoachee(payload).subscribe({

      next: () => {
        this.isLoading = false;

        this.successMessage =
          'Registration successful!';

        this.auth.cleartoken();

        this.router.navigate([
          '/auth/login'
        ]);
      },

      error: (err) => {
        this.isLoading = false;

        this.errorMessage =
          err?.message ||
          'Registration failed.';
      }
    });
  }
}