import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { JobService, Job } from '../../services/job.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class StudentDashboardComponent implements OnInit {
  currentUser: User | null = null;
  jobs: Job[] = [];
  searchQuery: string = '';
  filteredJobs: Job[] = [];
  myApplications: any[] = [];

  constructor(
    private authService: AuthService,
    private jobService: JobService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser || this.currentUser.type !== 'student') {
      this.router.navigate(['/student/login']);
      return;
    }

    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.jobs = this.jobService.getAllJobs();
    this.filteredJobs = this.jobs;
    this.loadMyApplications();
  }

  loadMyApplications(): void {
    // Mock data for student applications
    this.myApplications = [
      {
        jobTitle: 'Frontend Developer',
        company: 'TechCorp',
        appliedDate: new Date('2024-01-15'),
        status: 'pending'
      },
      {
        jobTitle: 'Software Engineer Intern',
        company: 'StartupXYZ',
        appliedDate: new Date('2024-01-10'),
        status: 'reviewed'
      }
    ];
  }

  searchJobs(): void {
    if (this.searchQuery.trim()) {
      this.filteredJobs = this.jobService.searchJobs(this.searchQuery);
    } else {
      this.filteredJobs = this.jobs;
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredJobs = this.jobs;
  }

  navigateToJobList(): void {
    this.router.navigate(['/jobs']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/dashboard']);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'reviewed': return '#17a2b8';
      case 'accepted': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  }

  getStatusText(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  getApplicationCount(): number {
    return this.myApplications.length;
  }

  getPendingApplications(): number {
    return this.myApplications.filter(app => app.status === 'pending').length;
  }

  getAcceptedApplications(): number {
    return this.myApplications.filter(app => app.status === 'accepted').length;
  }

  getReviewedApplications(): number {
    return this.myApplications.filter(app => app.status === 'reviewed').length;
  }
}
