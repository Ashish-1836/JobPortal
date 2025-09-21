import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, Company } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true
})
export class CreateCompanyComponent implements OnInit {
  companyForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      location: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    // if (!this.authService.isLoggedIn() || !this.authService.isAdmin()) {
    //   this.router.navigate(['/admin/login']);
    // }
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const companyData: Omit<Company, 'id'> = {
        name: this.companyForm.value.name,
        location: this.companyForm.value.location,
        description: this.companyForm.value.description
      };
      this.authService.createCompany(companyData).subscribe({
        next: (success) => {
          debugger
          if (success) {
            this.successMessage = 'Company created successfully!';
            this.companyForm.reset();
            setTimeout(() => {
              this.router.navigate(['/admin/dashboard']);
            }, 2000);
          } else {
            this.errorMessage = 'Failed to create company. Please try again.';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Company creation error:', error);
          this.errorMessage = 'Company creation failed. Please check your input and try again.';
          this.isLoading = false;
        }
      });
    }
  }

  navigateToDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  navigateToJobList(): void {
    this.router.navigate(['/jobs']);
  }
}
