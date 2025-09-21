import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary: string;
  type: 'full-time' | 'part-time' | 'internship';
  postedDate: Date;
  postedBy: string;
  applications: JobApplication[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  coverLetter: string;
  appliedDate: Date;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private jobsSubject = new BehaviorSubject<Job[]>([]);
  public jobs$ = this.jobsSubject.asObservable();

  // Mock data storage
  private jobs: Job[] = [
    {
      id: '1',
      title: 'Frontend Developer',
      company: 'TechCorp',
      location: 'New York, NY',
      description: 'We are looking for a skilled frontend developer to join our team.',
      requirements: ['Angular', 'TypeScript', 'HTML/CSS', '2+ years experience'],
      salary: '$70,000 - $90,000',
      type: 'full-time',
      postedDate: new Date('2024-01-15'),
      postedBy: '1',
      applications: []
    },
    {
      id: '2',
      title: 'Software Engineer Intern',
      company: 'StartupXYZ',
      location: 'San Francisco, CA',
      description: 'Great opportunity for students to gain real-world experience.',
      requirements: ['JavaScript', 'React', 'Computer Science major'],
      salary: '$25/hour',
      type: 'internship',
      postedDate: new Date('2024-01-10'),
      postedBy: '1',
      applications: []
    }
  ];

  constructor() {
    this.jobsSubject.next(this.jobs);
  }

  getAllJobs(): Job[] {
    return this.jobs;
  }

  getJobById(id: string): Job | undefined {
    return this.jobs.find(job => job.id === id);
  }

  addJob(jobData: Omit<Job, 'id' | 'postedDate' | 'applications'>): void {
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      postedDate: new Date(),
      applications: []
    };

    this.jobs.push(newJob);
    this.jobsSubject.next(this.jobs);
  }

  updateJob(id: string, jobData: Partial<Job>): boolean {
    const index = this.jobs.findIndex(job => job.id === id);
    if (index !== -1) {
      this.jobs[index] = { ...this.jobs[index], ...jobData };
      this.jobsSubject.next(this.jobs);
      return true;
    }
    return false;
  }

  deleteJob(id: string): boolean {
    const index = this.jobs.findIndex(job => job.id === id);
    if (index !== -1) {
      this.jobs.splice(index, 1);
      this.jobsSubject.next(this.jobs);
      return true;
    }
    return false;
  }

  applyForJob(jobId: string, application: Omit<JobApplication, 'id' | 'appliedDate' | 'status'>): boolean {
    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      const newApplication: JobApplication = {
        ...application,
        id: Date.now().toString(),
        appliedDate: new Date(),
        status: 'pending'
      };

      job.applications.push(newApplication);
      this.jobsSubject.next(this.jobs);
      return true;
    }
    return false;
  }

  getApplicationsForJob(jobId: string): JobApplication[] {
    const job = this.jobs.find(j => j.id === jobId);
    return job ? job.applications : [];
  }

  updateApplicationStatus(jobId: string, applicationId: string, status: JobApplication['status']): boolean {
    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      const application = job.applications.find(a => a.id === applicationId);
      if (application) {
        application.status = status;
        this.jobsSubject.next(this.jobs);
        return true;
      }
    }
    return false;
  }

  searchJobs(query: string): Job[] {
    const lowerQuery = query.toLowerCase();
    return this.jobs.filter(job =>
      job.title.toLowerCase().includes(lowerQuery) ||
      job.company.toLowerCase().includes(lowerQuery) ||
      job.location.toLowerCase().includes(lowerQuery) ||
      job.description.toLowerCase().includes(lowerQuery)
    );
  }
}
