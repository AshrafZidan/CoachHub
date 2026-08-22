import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../../core/services/auth.service';
import { PasswordModule } from 'primeng/password';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, PasswordModule,ReactiveFormsModule, RouterLink, InputTextModule, ButtonModule, MessageModule, TranslateModule],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.scss',
})
export class ForgetPassword implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  // Forms
  emailForm!: FormGroup;
  otpForm!: FormGroup; // combined: otp + new password

  // State
  currentStep: 'email' | 'otp' = 'email';
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  userEmail = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.auth.cleartoken();
    this.initForms();
  }

  initForms(): void {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.otpForm = this.fb.group(
      {
        otp: ['', [Validators.required, Validators.minLength(4)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Getters
  get email() {
    return this.emailForm.get('email')!;
  }

  get otp() {
    return this.otpForm.get('otp')!;
  }

  get password() {
    return this.otpForm.get('password')!;
  }

  get confirmPassword() {
    return this.otpForm.get('confirmPassword')!;
  }

  // Step 1: Send OTP
  onSendOTP(): void {
    if (this.emailForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.userEmail = this.emailForm.value.email;


        this.auth.forgotPassword(this.userEmail).subscribe({
        next: () => {
          // move to OTP step immediately
          this.currentStep = 'otp';
          this.isLoading = false;
          this.successMessage = 'OTP sent to your email. Check your inbox.';
          // force change detection in case the observable resolved outside Angular zone
          try {
            this.cdr.detectChanges();
          } catch {}
          // clear success message after a short delay so the user sees feedback
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.message || ' failed.';
        },
      });


  

   
  }

  onVerifyOTP(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    if (this.password.value !== this.confirmPassword.value) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
      this.auth.resetPassword(this.userEmail, this.otp.value, this.password.value).subscribe({
        next: () => {
            this.isLoading = false;
           this.successMessage = 'Password reset successfully. Redirecting to login...';
            setTimeout(() => {
        this.router.navigate(['/auth/login']);
       }, 1500);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.message || ' failed.';
        },
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



  // Go back to previous step
  goBack(): void {
    if (this.currentStep === 'otp') {
      this.currentStep = 'email';
      this.errorMessage = '';
      this.successMessage = '';
    }
  }
}
