import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'STUDENT';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  user?: User;
  message?: string;
  success?: boolean;
}

export interface Company {
  id?: string;
  name: string;
  location: string;
  description: string;
}

export interface CompanyResponse {
  success?: boolean;
  message?: string;
  company?: Company;
}

export interface User {
  id: string;
  email: string;
  name: string;
  type: 'admin' | 'student';
  password?: string;
  company?: string;
  skills?: string[];
  experience?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private apiUrl = 'http://localhost:8080/api';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  // login(email: string, password: string, userType: 'admin' | 'student'): Observable<boolean> {
  //   const loginData: LoginRequest = {
  //     email,
  //     password
  //   };

  //   return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, loginData, this.httpOptions)
  //     .pipe(
  //       map(response => {
  //         if (response.success && response.user) {
  //           // Map the API response to our User interface
  //           const user: User = {
  //             id: response.user.id || '',
  //             email: response.user.email,
  //             name: response.user.name,
  //             type: response.user.type,
  //             company: response.user.company,
  //             skills: response.user.skills,
  //             experience: response.user.experience
  //           };

  //           this.currentUserSubject.next(user);
  //           localStorage.setItem('currentUser', JSON.stringify(user));

  //           // Store token if provided
  //           if (response.token) {
  //             localStorage.setItem('authToken', response.token);
  //           }

  //           return true;
  //         }
  //         return false;
  //       }),
  //       catchError(error => {
  //         console.error('Login error:', error);
  //         return throwError(() => error);
  //       })
  //     );
  // }

login(email: string, password: string, userType: 'admin' | 'student'): Observable<boolean> {
  const loginData = { email, password };

  return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, loginData, this.httpOptions)
    .pipe(
      map(response => {
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
          // You can later decode token to get role, name, etc.
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
}


  register(userData: Omit<User, 'id'>): Observable<boolean> {
    const registerData: RegisterRequest = {
      name: userData.name,
      email: userData.email,
      password: userData.password || '',
      role: userData.type === 'admin' ? 'ADMIN' : 'STUDENT'
    };

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, registerData, this.httpOptions)
      .pipe(
        map(response => {
          if (response.success) {
            return true;
          }
          return false;
        }),
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.type === 'admin';
  }

  isStudent(): boolean {
    return this.currentUserSubject.value?.type === 'student';
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  createCompany(companyData: Omit<Company, 'id'>): Observable<boolean> {
    const authOptions = {
      headers: this.getAuthHeaders()
    };

    return this.http.post<CompanyResponse>(`${this.apiUrl}/company/create`, companyData, authOptions)
      .pipe(
        map(response => {
          if (response.success) {
            return true;
          }
          return false;
        }),
        catchError(error => {
          console.error('Company creation error:', error);
          return throwError(() => error);
        })
      );
  }
}
