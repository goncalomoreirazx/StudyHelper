// src/app/services/subject.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Subject } from '../models/subject.model';
import { Tutor } from '../models/tutor.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private readonly apiUrl = `${environment.apiUrl}/subjects`;

  constructor(private http: HttpClient) {}

  /**
   * Get all subjects with their sub-subjects
   */
  getAllSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError<Subject[]>('getAllSubjects', []))
      );
  }

  /**
   * Get a subject by ID
   * @param id Subject ID
   */
  getSubjectById(id: number): Observable<Subject | undefined> {
    return this.http.get<Subject>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<Subject>(`getSubjectById id=${id}`))
      );
  }

  /**
   * Get tutors by subject
   * @param subjectId Subject ID
   */
  getTutorsBySubject(subjectId: number): Observable<Tutor[]> {
    return this.http.get<Tutor[]>(`${this.apiUrl}/${subjectId}/tutors`)
      .pipe(
        catchError(this.handleError<Tutor[]>(`getTutorsBySubject subjectId=${subjectId}`, []))
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
}