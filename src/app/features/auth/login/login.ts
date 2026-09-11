import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { RoleName } from '../../../core/models/auth.model';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/Notifaction/notification.service';
import { FcmService } from '../../../shared/Notifaction/firebase-notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    TranslateModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private notificationService = inject(NotificationService);
    private fcmService = inject(FcmService);
  loginForm!: FormGroup;
  isLoading    = false;
  showPassword = false;
  errorMessage = '';
  websiteView = false;
  selectedRole: RoleName = RoleName.ADMIN; 
  public RoleName = RoleName;
  constructor(
    private fb:   FormBuilder,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
        this.websiteView = this.route.snapshot.data['websiteView'] ?? false;
      if (this.websiteView) {
        this.selectedRole = RoleName.COACHEE; 
      }
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleName: [this.selectedRole]
    });
  }

  selectRole(role: RoleName) {
    this.selectedRole = role;
    this.loginForm.patchValue({ roleName: role });
  }

  get email()    { return this.loginForm.get('email')!; }
  get password() { return this.loginForm.get('password')!; }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

async onSubmit(): Promise<void> {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.isLoading = true;
  this.errorMessage = "";

  this.auth.login(this.loginForm.value).subscribe({
    next: async () => {
      this.isLoading = false;

      try {
        const user = this.auth.getUser();

        if (user) {
          const role =
            user.roles?.some((r: string) =>
              r.includes("COACH")
            )
              ? "COACH"
              : "COACHEE";

          this.notificationService.initialize(
            Number(user.id),
            role
          );

          const fcmToken =
            await this.fcmService.getFcmToken();

          if (fcmToken) {
            this.notificationService
              .registerFcmToken(fcmToken)
              .subscribe({
                next: () => {
                  console.log(
                    "FCM token registered successfully"
                  );
                },

                error: (error) => {
                  console.error(
                    "Failed to register FCM token:",
                    error
                  );
                },
              });
          }

          this.fcmService.start();
        }
      } catch (error) {
        console.error(
          "FCM initialization failed:",
          error
        );
      }

      this.auth.redirectAfterLogin();
    },

    error: (err: Error) => {
      this.isLoading = false;
      this.errorMessage = err.message;
    },
  });
}

  continueAsGust(): void {
        this.router.navigateByUrl(
          '/coachee/find-coach'
        );  
  }
 
}