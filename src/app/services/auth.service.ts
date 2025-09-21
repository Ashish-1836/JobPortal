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
      try {
        const user = JSON.parse(savedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
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

  return this.http.post<any>(`${this.apiUrl}/auth/login`, loginData, this.httpOptions)
    .pipe(
      map(response => {
        console.log('Login API Response:', response); // Debug log
        
        // Handle different response formats
        let userData: any = null;
        let token: string | null = null;
        
        if (response.success && response.user) {
          // Format: { success: true, user: {...}, token: "..." }
          userData = response.user;
          token = response.token;
        } else if (response.token && response.email) {
          // Format: { token: "...", email: "...", name: "...", role: "..." }
          userData = {
            id: response.id || '',
            email: response.email,
            name: response.name || response.email,
            type: response.role?.toLowerCase() === 'admin' ? 'admin' : 'student',
            company: response.company,
            skills: response.skills,
            experience: response.experience
          };
          token = response.token;
        } else if (response.token) {
          // Format: { token: "..." } - minimal response
          // Try to decode JWT token to get user info
          try {
            const tokenPayload = this.decodeJWT(response.token);
            userData = {
              id: tokenPayload.sub || '',
              email: tokenPayload.sub || email,
              name: email.split('@')[0],
              type: tokenPayload.roles && tokenPayload.roles[0] === 'STUDENT' ? 'student' : 
                   tokenPayload.roles && tokenPayload.roles[0] === 'ADMIN' ? 'admin' : userType,
              company: '',
              skills: [],
              experience: ''
            };
          } catch (error) {
            console.warn('Could not decode JWT token, using fallback user data:', error);
            userData = {
              id: '',
              email: email,
              name: email.split('@')[0],
              type: userType,
              company: '',
              skills: [],
              experience: ''
            };
          }
          token = response.token;
        }

        if (userData) {
          const user: User = {
            id: userData.id || '',
            email: userData.email,
            name: userData.name,
            type: userData.type,
            company: userData.company,
            skills: userData.skills,
            experience: userData.experience
          };

          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));

          // Store token if provided
          if (token) {
            localStorage.setItem('authToken', token);
          }

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

    return this.http.post<any>(`${this.apiUrl}/auth/register`, registerData, this.httpOptions)
      .pipe(
        map(response => {
          console.log('Registration API Response:', response); // Debug log
          
          // Handle different response formats
          if (response.success) {
            // Format: { success: true, message: "..." }
            return true;
          } else if (response.message && response.message.includes('successfully')) {
            // Format: { message: "User registered successfully" }
            return true;
          } else if (typeof response === 'string' && response.includes('successfully')) {
            // Format: "User registered successfully"
            return true;
          } else if (response && !response.error) {
            // Any response without error is considered success
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

  private decodeJWT(token: string): any {
    try {
      // JWT tokens have 3 parts separated by dots: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT token format');
      }

      // Decode the payload (middle part)
      const payload = parts[1];
      // Add padding if needed for base64 decoding
      const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
      
      // Decode base64
      const decodedPayload = atob(paddedPayload);
      
      // Parse JSON
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      throw error;
    }
  }
}
