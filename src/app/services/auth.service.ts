// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { 
  User, 
  UserRole, 
  LoginRequest, 
  RegisterRequest,
  AuthResponse 
} from '../models/user.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
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
      // Check if running in browser environment
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem(this.TOKEN_KEY);
        const userJson = localStorage.getItem(this.USER_KEY);
        
        if (token && userJson) {
          const user = JSON.parse(userJson) as User;
          this.currentUserSubject.next(user);
          this.isLoggedInSubject.next(true);
        }
      }
    } catch (error) {
      console.error('Error initializing auth state from localStorage', error);
      this.logout();
    }
  }
  
  /**
   * Register a new user
   */
  register(registerData: RegisterRequest): Observable<AuthResponse> {
    // Convert UserRole to appropriate format
    const payload = {
      ...registerData,
      role: this.normalizeUserRole(registerData.role)
    };
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload)
      .pipe(
        tap(response => this.handleAuthentication(response)),
        catchError(error => this.handleError(error))
      );
  }
  
  /**
   * Login an existing user
   */
  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => this.handleAuthentication(response)),
        catchError(error => this.handleError(error))
      );
  }
  
  /**
   * Logout the current user
   */
  logout(): void {
    // Remove token and user from local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    
    // Update subjects
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }
  
  /**
   * Get the current auth token
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }
  
  /**
   * Check if the user is logged in
   */
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
  
  /**
   * Get the current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  /**
   * Handle authentication response
   */
  private handleAuthentication(response: AuthResponse): void {
    const { user, token } = response;
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
    
    // Update subjects
    this.currentUserSubject.next(user);
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
  
  /**
   * Check if the current user has a specific role
   */
  hasRole(role: UserRole): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;
    
    // Convert role values to string for comparison
    const userRoleStr = String(currentUser.role);
    const checkRoleStr = String(role);
    
    return userRoleStr === checkRoleStr;
  }
  
  /**
   * Normalize user role to number format expected by backend
   */
  private normalizeUserRole(role?: UserRole): number {
    if (role === undefined || role === null) {
      return 0; // Default to STUDENT
    }
    
    // If role is already a number between 0-2, return it
    if (typeof role === 'number' && role >= 0 && role <= 2) {
      return role;
    }
    
    // If role is a string representation, convert it
    if (typeof role === 'string') {
      switch (role) {
        case 'STUDENT': return 0;
        case 'TUTOR': return 1;
        case 'ADMIN': return 2;
        default: return 0;
      }
    }
    
    // Default to STUDENT
    return 0;

    
  }
}