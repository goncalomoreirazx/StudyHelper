// src/app/models/subject.model.ts
export interface Subject {
    id: number;
    name: string;
    description: string;
    icon: string;
    subSubjects: SubSubject[];
  }
  
  export interface SubSubject {
    id: number;
    subjectId: number;
    name: string;
  }