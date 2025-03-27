// src/app/models/tutor.model.ts
export interface Tutor {
    id: number;
    name: string;
    profession: string;
    hobbies: string[];
    rating: number;
    bio: string;
    subjects: string[];
    image?: string; // Optional profile image
    experience: number; // Years of experience
  }