import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { StudentLoginComponent } from './components/student-login/student-login.component';
import { AdminRegisterComponent } from './components/admin-register/admin-register.component';
import { StudentRegisterComponent } from './components/student-register/student-register.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { AddJobComponent } from './components/add-job/add-job.component';
import { CreateCompanyComponent } from './components/create-company/create-company.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'student/login', component: StudentLoginComponent },
  { path: 'admin/register', component: AdminRegisterComponent },
  { path: 'student/register', component: StudentRegisterComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'student/dashboard', component: StudentDashboardComponent },
  { path: 'jobs', component: JobListComponent },
  { path: 'admin/add-job', component: AddJobComponent },
  { path: 'admin/create-company', component: CreateCompanyComponent },
  { path: '**', redirectTo: '/dashboard' }
];
