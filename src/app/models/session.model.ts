// src/app/models/session.model.ts
export interface TutorSession {
    id: number;
    studentId: number;
    studentName: string;
    tutorId: number;
    tutorName: string;
    subjectId: number;
    subjectName: string;
    subSubjectId?: number;
    subSubjectName?: string;
    sessionDate: string;
    startTime: string;
    endTime: string;
    status: string;
    notes: string;
    createdAt: string;
  }
  
  export enum SessionStatus {
    SCHEDULED = 'SCHEDULED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    NO_SHOW = 'NO_SHOW'
  }
  
  export interface TutorSessionCreateRequest {
    tutorId: number;
    subjectId: number;
    subSubjectId?: number;
    sessionDate: string;
    startTime: string;
    endTime: string;
    notes: string;
  }
  
  export interface TutorSessionUpdateRequest {
    status?: SessionStatus;
    notes?: string;
  }
  
  export interface TutorAvailability {
    id: number;
    tutorId: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    isRecurring: boolean;
    specificDate?: string;
  }
  
  export interface AvailableTimeSlot {
    date: string;
    startTime: string;
    endTime: string;
  }