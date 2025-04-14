// src/app/services/tutor-application.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface TutorApplicationRequest {
  profession: string;
  education: string;
  experience: number;
  subjects: string[];
  bio: string;
  hourlyRate: number;
  reason: string;
  additionalInfo?: string;
  contactPhone?: string;
}

export interface TutorApplication {
  id: number;
  userId: number;
  userName: string;
  email: string;
  profession: string;
  education: string;
  experience: number;
  subjects: string[];
  bio: string;
  hourlyRate: number;
  reason: string;
  additionalInfo?: string;
  contactPhone?: string;
  cvFilePath: string;
  status: string;
  submittedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TutorApplicationService {
  private readonly apiUrl = `${environment.apiUrl}/tutor-applications`;

  constructor(private http: HttpClient) {}

  createApplication(application: TutorApplicationRequest, cvFile: File): Observable<TutorApplication> {
    const formData = new FormData();
    
    // Add all application fields to formData
    formData.append('profession', application.profession);
    formData.append('education', application.education);
    formData.append('experience', application.experience.toString());
    
    // Handle array of subjects
    application.subjects.forEach((subject, index) => {
      formData.append(`subjects[${index}]`, subject);
    });
    
    formData.append('bio', application.bio);
    formData.append('hourlyRate', application.hourlyRate.toString());
    formData.append('reason', application.reason);
    
    if (application.additionalInfo) {
      formData.append('additionalInfo', application.additionalInfo);
    }
    
    if (application.contactPhone) {
      formData.append('contactPhone', application.contactPhone);
    }
    
    // Add CV file
    formData.append('cvFile', cvFile);
    
    return this.http.post<TutorApplication>(this.apiUrl, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status) {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}