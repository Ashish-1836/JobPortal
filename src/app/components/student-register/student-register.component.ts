import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-register',
  templateUrl: './student-register.component.html',
  styleUrls: ['./student-register.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true
})
export class StudentRegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      skills: ['', [Validators.required]],
      experience: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.registerForm.value;
      const userData = {
        email: formData.email,
        name: formData.name,
        type: 'student' as const,
        password: formData.password,
        skills: formData.skills.split(',').map((skill: string) => skill.trim()),
        experience: formData.experience
      };

      this.authService.register(userData).subscribe({
        next: (success) => {
          if (success) {
            this.successMessage = 'Registration successful! Redirecting to login...';
            setTimeout(() => {
              this.router.navigate(['/student/login']);
            }, 2000);
          } else {
            this.errorMessage = 'Email already exists. Please try a different email.';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.errorMessage = 'Registration failed. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/student/login']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
