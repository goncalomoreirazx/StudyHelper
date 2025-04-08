// src/app/models/user.model.ts
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    createdAt: Date;
  }
  
  export enum UserRole {
    STUDENT = '0',
    TUTOR = '1',
    ADMIN = '2'
  }
  
  export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword?: string;
    role?: UserRole;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
    refreshToken?: string;
    expiresIn?: number;
  }