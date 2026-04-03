import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { RoleName } from '../../../core/models/auth.model';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading    = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private fb:   FormBuilder,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleName: [RoleName.ADMIN]   // default role — can be changed via UI if needed
    });
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
        // ✅ Show success message from API
        // console.log(response.messageEn);  // "Success"
        this.auth.redirectAfterLogin();
      },
      error: (err: Error) => {
        this.isLoading    = false;
        // ✅ Show error message from API
        this.errorMessage = err.message;  // messageEn from backend
      }
    });
  }
 
}