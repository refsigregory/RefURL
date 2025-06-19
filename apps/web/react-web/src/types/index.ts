export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Url {
  id: string;
  original_url: string;
  short_code: string;
  title?: string;
  user_id: string;
  clicks: number;
  created_at: string;
  updated_at: string;
  short_url?: string;
}

export interface CreateUrlRequest {
  original_url: string;
  title?: string;
  short_code?: string;
}

export interface UpdateUrlRequest {
  original_url: string;
  title?: string;
  short_code?: string;
}

export interface AuthRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
} 