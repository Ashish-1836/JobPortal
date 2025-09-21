import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobService, Job } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  searchQuery: string = '';
  selectedType: string = '';
  selectedLocation: string = '';
  isLoading: boolean = true;

  constructor(
    private jobService: JobService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.isLoading = true;
    // Simulate loading delay
    setTimeout(() => {
      this.jobs = this.jobService.getAllJobs();
      this.filteredJobs = this.jobs;
      this.isLoading = false;
    }, 500);
  }

  searchJobs(): void {
    let results = this.jobs;

    if (this.searchQuery.trim()) {
      results = this.jobService.searchJobs(this.searchQuery);
    }

    if (this.selectedType) {
      results = results.filter(job => job.type === this.selectedType);
    }

    if (this.selectedLocation) {
      results = results.filter(job => 
        job.location.toLowerCase().includes(this.selectedLocation.toLowerCase())
      );
    }

    this.filteredJobs = results;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedType = '';
    this.selectedLocation = '';
    this.filteredJobs = this.jobs;
  }

  applyForJob(job: Job): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/student/login']);
      return;
    }

    if (!this.authService.isStudent()) {
      alert('Only students can apply for jobs.');
      return;
    }

    // Here you would typically open a modal or navigate to application form
    alert(`Application submitted for ${job.title} at ${job.company}`);
  }

  viewJobDetails(job: Job): void {
    // Navigate to job details page (not implemented in this demo)
    alert(`Viewing details for ${job.title}`);
  }

  getJobTypeColor(type: string): string {
    switch (type) {
      case 'full-time': return '#28a745';
      case 'part-time': return '#ffc107';
      case 'internship': return '#17a2b8';
      default: return '#6c757d';
    }
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isStudent(): boolean {
    return this.authService.isStudent();
  }

  navigateToAddJob(): void {
    this.router.navigate(['/admin/add-job']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
