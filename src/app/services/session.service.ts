// src/app/services/session.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { 
  TutorSession, 
  TutorSessionCreateRequest, 
  TutorSessionUpdateRequest,
  TutorAvailability,
  AvailableTimeSlot,
  SessionStatus
} from '../models/session.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly apiUrl = `${environment.apiUrl}/sessions`;

  constructor(private http: HttpClient) {}

  /**
   * Get all sessions (admin only)
   */
  getAllSessions(): Observable<TutorSession[]> {
    return this.http.get<TutorSession[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError<TutorSession[]>('getAllSessions', []))
      );
  }

  /**
   * Get current user's sessions as a student
   */
  getMyStudentSessions(): Observable<TutorSession[]> {
    return this.http.get<TutorSession[]>(`${this.apiUrl}/my-sessions`)
      .pipe(
        catchError(this.handleError<TutorSession[]>('getMyStudentSessions', []))
      );
  }

  /**
   * Get current user's sessions as a tutor
   */
  getMyTutorSessions(): Observable<TutorSession[]> {
    return this.http.get<TutorSession[]>(`${this.apiUrl}/tutor-sessions`)
      .pipe(
        catchError(this.handleError<TutorSession[]>('getMyTutorSessions', []))
      );
  }

  /**
   * Get a session by ID
   * @param id Session ID
   */
  getSessionById(id: number): Observable<TutorSession | undefined> {
    return this.http.get<TutorSession>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<TutorSession>(`getSessionById id=${id}`))
      );
  }

  /**
   * Create a new session
   * @param session The session to create
   */
  createSession(session: TutorSessionCreateRequest): Observable<TutorSession> {
    return this.http.post<TutorSession>(this.apiUrl, session)
      .pipe(
        catchError(error => this.handleHttpError(error, 'createSession'))
      );
  }

  /**
   * Update a session
   * @param id Session ID
   * @param updates The updates to apply
   */
  updateSession(id: number, updates: TutorSessionUpdateRequest): Observable<TutorSession | undefined> {
    return this.http.put<TutorSession>(`${this.apiUrl}/${id}`, updates)
      .pipe(
        catchError(this.handleError<TutorSession>(`updateSession id=${id}`))
      );
  }

  /**
   * Delete a session
   * @param id Session ID
   */
  deleteSession(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<any>(`deleteSession id=${id}`)),
        // Return true if successful, false otherwise
        catchError(() => of(false)),
        // Otherwise, map to true
        _ => of(true)
      );
  }

  /**
   * Get a tutor's availability
   * @param tutorId Tutor ID
   */
  getTutorAvailability(tutorId: number): Observable<TutorAvailability[]> {
    return this.http.get<TutorAvailability[]>(`${this.apiUrl}/tutors/${tutorId}/availability`)
      .pipe(
        catchError(this.handleError<TutorAvailability[]>(`getTutorAvailability tutorId=${tutorId}`, []))
      );
  }

  /**
   * Get available time slots for a tutor on a specific date
   * @param tutorId Tutor ID
   * @param date Date in ISO format (YYYY-MM-DD)
   */
  getAvailableTimeSlots(tutorId: number, date: string): Observable<AvailableTimeSlot[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<AvailableTimeSlot[]>(`${this.apiUrl}/tutors/${tutorId}/available-slots`, { params })
      .pipe(
        catchError(this.handleError<AvailableTimeSlot[]>(`getAvailableTimeSlots tutorId=${tutorId} date=${date}`, []))
      );
  }

  /**
   * Cancel a session
   * @param id Session ID
   */
  cancelSession(id: number): Observable<TutorSession | undefined> {
    const updates: TutorSessionUpdateRequest = {
      status: SessionStatus.CANCELLED
    };
    return this.updateSession(id, updates);
  }

  /**
   * Handle HTTP operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
  
  /**
   * Handle HTTP errors and throw a more descriptive error
   * @param error - The HTTP error
   * @param operation - name of the operation that failed
   */
  private handleHttpError(error: HttpErrorResponse, operation = 'operation'): Observable<never> {
    let errorMessage = `Error in ${operation}: `;
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage += `Client error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage += error.error?.message || 
                     `Server returned code ${error.status}, message: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}