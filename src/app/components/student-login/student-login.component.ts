import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true
})
export class StudentLoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password, 'student').subscribe({
        next: (success) => {
          if (success) {
            this.router.navigate(['/student/dashboard']);
          } else {
            this.errorMessage = 'Invalid email or password. Please try again.';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = 'Login failed. Please check your credentials and try again.';
          this.isLoading = false;
        }
      });
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/student/register']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
