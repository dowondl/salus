// src/dtos/auth.dto.ts (수정)

export interface SignupDto {
  email: string; 
  name: string;
  nickname?: string;
  password: string;
  gender: 'male' | 'female';
  age: number;
  height: number;
  weight: number;
  goalWeight?: number;
}

export interface LoginDto {
  email: string; 
  password: string;
}

export interface TokenPayload {
  userId: number;
  role: 'user' | 'admin';
}