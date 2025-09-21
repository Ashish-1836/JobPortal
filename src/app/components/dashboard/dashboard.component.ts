import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private router: Router) {}

  navigateToAdminLogin(): void {
    this.router.navigate(['/admin/login']);
  }

  navigateToStudentLogin(): void {
    this.router.navigate(['/student/login']);
  }

  navigateToAdminRegister(): void {
    this.router.navigate(['/admin/register']);
  }

  navigateToStudentRegister(): void {
    this.router.navigate(['/student/register']);
  }
}
