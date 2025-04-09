// src/app/models/tutor.model.ts
export interface Tutor {
  id: number;
  userId: number;
  name: string;
  email: string;
  profession: string;
  hobbies: string[];
  rating: number;
  bio: string;
  subjects: string[];
  photoUrl?: string; // Optional profile image
  experience: number; // Years of experience
}

export interface PaginatedTutors {
  items: Tutor[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface TutorCreateRequest {
  userId: number;
  profession: string;
  bio: string;
  experience: number;
  photoUrl?: string;
  subjects: string[];
  hobbies: string[];
}

export interface TutorUpdateRequest {
  profession?: string;
  bio?: string;
  experience?: number;
  photoUrl?: string;
  subjects?: string[];
  hobbies?: string[];
}