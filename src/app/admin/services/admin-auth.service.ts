// src/app/admin/services/admin-auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, UserRole } from '../../models/user.model';

interface AdminLoginRequest {
  email: string;
  password: string;
}

interface AdminAuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private readonly ADMIN_TOKEN_KEY = 'admin_auth_token';
  private readonly ADMIN_USER_KEY = 'admin_user';
  private readonly apiUrl = `${environment.apiUrl}/auth/admin`;
  
  private currentAdminSubject = new BehaviorSubject<User | null>(null);
  public currentAdmin$ = this.currentAdminSubject.asObservable();
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  
  constructor(private http: HttpClient) {
    this.initializeFromLocalStorage();
  }
  
  /**
   * Initialize auth state from localStorage
   */
  private initializeFromLocalStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem(this.ADMIN_TOKEN_KEY);
        const userJson = localStorage.getItem(this.ADMIN_USER_KEY);
        
        if (token && userJson) {
          const user = JSON.parse(userJson) as User;
          // Ensure the user is an admin
          if (user.role === UserRole.ADMIN) {
            this.currentAdminSubject.next(user);
            this.isLoggedInSubject.next(true);
          } else {
            this.logout(); // Clear invalid data
          }
        }
      }
    } catch (error) {
      console.error('Error initializing admin auth state from localStorage', error);
      this.logout();
    }
  }
  
  /**
   * Admin login
   */
  login(loginData: AdminLoginRequest): Observable<AdminAuthResponse> {
    return this.http.post<AdminAuthResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => this.handleAuthentication(response)),
        catchError(error => this.handleError(error))
      );
  }
  
  /**
   * Logout the current admin
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.ADMIN_TOKEN_KEY);
      localStorage.removeItem(this.ADMIN_USER_KEY);
    }
    
    this.currentAdminSubject.next(null);
    this.isLoggedInSubject.next(false);
  }
  
  /**
   * Get the current admin auth token
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.ADMIN_TOKEN_KEY);
    }
    return null;
  }
  
  /**
   * Check if admin is logged in
   */
  isLoggedIn(): boolean {
    return this.getToken() !== null && this.currentAdminSubject.value?.role === UserRole.ADMIN;
  }
  
  /**
   * Get the current admin user
   */
  getCurrentAdmin(): User | null {
    return this.currentAdminSubject.value;
  }
  
  /**
   * Handle authentication response
   */
  private handleAuthentication(response: AdminAuthResponse): void {
    const { user, token } = response;
    
    // Verify that the user is an admin
    if (user.role !== UserRole.ADMIN) {
      throw new Error('User is not an administrator');
    }
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ADMIN_TOKEN_KEY, token);
      localStorage.setItem(this.ADMIN_USER_KEY, JSON.stringify(user));
    }
    
    // Update subjects
    this.currentAdminSubject.next(user);
    this.isLoggedInSubject.next(true);
  }
  
  /**
   * Handle error response
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status) {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}