import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true
})
export class AddJobComponent implements OnInit {
  jobForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  requirements: string[] = [];

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private authService: AuthService,
    private router: Router
  ) {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      company: ['', [Validators.required]],
      location: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(50)]],
      salary: ['', [Validators.required]],
      type: ['full-time', [Validators.required]],
      requirementsInput: ['']
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn() || !this.authService.isAdmin()) {
      this.router.navigate(['/admin/login']);
    }
  }

  addRequirement(): void {
    const requirement = this.jobForm.get('requirementsInput')?.value?.trim();
    if (requirement && !this.requirements.includes(requirement)) {
      this.requirements.push(requirement);
      this.jobForm.get('requirementsInput')?.setValue('');
    }
  }

  removeRequirement(index: number): void {
    this.requirements.splice(index, 1);
  }

  onSubmit(): void {
    if (this.jobForm.valid && this.requirements.length > 0) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.jobForm.value;
      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        description: formData.description,
        salary: formData.salary,
        type: formData.type,
        requirements: this.requirements,
        postedBy: this.authService.getCurrentUser()?.id || '1'
      };

      // Simulate API call delay
      setTimeout(() => {
        this.jobService.addJob(jobData);
        this.successMessage = 'Job posted successfully! Redirecting to job list...';
        
        setTimeout(() => {
          this.router.navigate(['/jobs']);
        }, 2000);
        
        this.isLoading = false;
      }, 1000);
    } else {
      this.errorMessage = 'Please fill all required fields and add at least one requirement.';
    }
  }

  navigateToJobList(): void {
    this.router.navigate(['/jobs']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
