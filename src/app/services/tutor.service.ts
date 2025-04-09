// src/app/services/tutor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { 
  Tutor, 
  PaginatedTutors, 
  TutorCreateRequest, 
  TutorUpdateRequest 
} from '../models/tutor.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TutorService {
  private readonly apiUrl = `${environment.apiUrl}/tutors`;

  constructor(private http: HttpClient) {}

  /**
   * Get all tutors
   */
  getAllTutors(): Observable<Tutor[]> {
    return this.http.get<Tutor[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError<Tutor[]>('getAllTutors', []))
      );
  }

  /**
   * Get paginated tutors with optional subject filtering
   * @param page Page number (1-based)
   * @param pageSize Number of tutors per page
   * @param subject Optional subject filter
   */
  getTutorsPaginated(page: number, pageSize: number, subject?: string | null): Observable<{tutors: Tutor[], total: number}> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (subject) {
      params = params.set('subject', subject);
    }
    
    return this.http.get<PaginatedTutors>(`${this.apiUrl}/paginated`, { params })
      .pipe(
        map(response => ({
          tutors: response.items,
          total: response.totalCount
        })),
        catchError(this.handleError<{tutors: Tutor[], total: number}>('getTutorsPaginated', {tutors: [], total: 0}))
      );
  }

  /**
   * Get a tutor by ID
   * @param id Tutor ID
   */
  getTutorById(id: number): Observable<Tutor | undefined> {
    return this.http.get<Tutor>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<Tutor>(`getTutorById id=${id}`))
      );
  }

  /**
   * Get tutors by subject
   * @param subject The subject to filter by
   */
  getTutorsBySubject(subject: string): Observable<Tutor[]> {
    return this.http.get<Tutor[]>(`${this.apiUrl}/subject/${subject}`)
      .pipe(
        catchError(this.handleError<Tutor[]>(`getTutorsBySubject subject=${subject}`, []))
      );
  }

  /**
   * Create a new tutor
   * @param tutor The tutor data to create
   */
  createTutor(tutor: TutorCreateRequest): Observable<Tutor> {
    return this.http.post<Tutor>(this.apiUrl, tutor)
      .pipe(
        catchError(this.handleError<Tutor>('createTutor'))
      );
  }

  /**
   * Update an existing tutor
   * @param id Tutor ID
   * @param tutor The tutor data to update
   */
  updateTutor(id: number, tutor: TutorUpdateRequest): Observable<Tutor | undefined> {
    return this.http.put<Tutor>(`${this.apiUrl}/${id}`, tutor)
      .pipe(
        catchError(this.handleError<Tutor>(`updateTutor id=${id}`))
      );
  }

  /**
   * Delete a tutor
   * @param id Tutor ID
   */
  deleteTutor(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        map(() => true),
        catchError(this.handleError<boolean>(`deleteTutor id=${id}`, false))
      );
  }

  /**
   * Handle HTTP operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }

  // Fallback to mock data if API is unavailable
  private tutors: Tutor[] = [
    {
      id: 1,
      userId: 2,
      name: "Dr. Emily Parker",
      email: "eparker@example.com",
      profession: "Mathematics Professor",
      hobbies: ["Chess", "Mountain climbing", "Piano"],
      rating: 4.9,
      bio: "With over 15 years of teaching experience at university level, Dr. Parker specializes in making complex math concepts accessible to students of all ages. She holds a PhD in Applied Mathematics from MIT.",
      subjects: ["Calculus", "Linear Algebra", "Statistics", "Discrete Mathematics"],
      experience: 15
    },
    {
      id: 2,
      userId: 3,
      name: "Michael Chen",
      email: "mchen@example.com",
      profession: "Software Engineer",
      hobbies: ["Coding", "Gaming", "Tennis"],
      rating: 4.8,
      bio: "Michael works as a senior software engineer at a leading tech company and has been teaching programming on the side for 7 years. He's passionate about helping students build practical coding skills.",
      subjects: ["Python", "Java", "Web Development", "Data Structures & Algorithms"],
      experience: 7
    },
    // ...other mock tutors
  ];
}