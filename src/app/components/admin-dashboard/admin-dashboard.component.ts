import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { JobService, Job } from '../../services/job.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;
  jobs: Job[] = [];
  totalJobs: number = 0;
  totalApplications: number = 0;
  recentJobs: Job[] = [];

  constructor(
    private authService: AuthService,
    private jobService: JobService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser || this.currentUser.type !== 'admin') {
      this.router.navigate(['/admin/login']);
      return;
    }

    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.jobs = this.jobService.getAllJobs();
    this.totalJobs = this.jobs.length;
    this.totalApplications = this.jobs.reduce((total, job) => total + job.applications.length, 0);
    this.recentJobs = this.jobs.slice(0, 5); // Get latest 5 jobs
  }

  navigateToAddJob(): void {
    this.router.navigate(['/admin/add-job']);
  }

  navigateToJobList(): void {
    this.router.navigate(['/jobs']);
  }

  navigateToCreateCompany(): void {
    this.router.navigate(['/admin/create-company']);
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

  getPendingApplications(): number {
    return this.jobs.filter(job => job.applications.some(app => app.status === 'pending')).length;
  }

  getAcceptedApplications(): number {
    return this.jobs.filter(job => job.applications.some(app => app.status === 'accepted')).length;
  }

  getApplicationCountForJob(job: Job, status: string): number {
    return job.applications.filter(app => app.status === status).length;
  }
}
