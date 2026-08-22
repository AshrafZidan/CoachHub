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

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
  
    this.isLoading    = true;
    this.errorMessage = '';
  
    this.auth.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        // console.log(response.messageEn);  // "Success"
        this.auth.redirectAfterLogin();
      },
      error: (err: Error) => {
        this.isLoading    = false;
        this.errorMessage = err.message;  // messageEn from backend
      }
    });
  }
 
}