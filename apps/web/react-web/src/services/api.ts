import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { AuthRequest, AuthResponse, CreateUrlRequest, UpdateUrlRequest, Url, ApiResponse } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  register = async (data: AuthRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await this.api.post('/auth/register', data);
    return response.data.data!;
  }

  login = async (data: AuthRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await this.api.post('/auth/login', data);
    return response.data.data!;
  }

  // URL endpoints
  shortenUrl = async (data: CreateUrlRequest): Promise<Url> => {
    const response: AxiosResponse<ApiResponse<Url>> = await this.api.post('/urls/shorten', data);
    return response.data.data!;
  }

  getUserUrls = async (): Promise<Url[]> => {
    const response: AxiosResponse<ApiResponse<Url[]>> = await this.api.get('/urls');
    return response.data.data!;
  }

  getUrlById = async (id: string): Promise<Url> => {
    const response: AxiosResponse<ApiResponse<Url>> = await this.api.get(`/urls/${id}`);
    return response.data.data!;
  }

  updateUrl = async (id: string, data: UpdateUrlRequest): Promise<Url> => {
    const response: AxiosResponse<ApiResponse<Url>> = await this.api.put(`/urls/${id}`, data);
    return response.data.data!;
  }

  deleteUrl = async (id: string): Promise<void> => {
    await this.api.delete(`/urls/${id}`);
  }

  // Public redirect endpoint
  getRedirectUrl = (shortCode: string): string => {
    return `${this.api.defaults.baseURL}/urls/go/${shortCode}`;
  }
}

export const apiService = new ApiService(); 