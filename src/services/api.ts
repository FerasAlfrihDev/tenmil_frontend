// ========================================
// CENTRALIZED API SERVICE
// ========================================

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration Interface
interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

// Supported subdomain types
type SubdomainType = 'admin' | 'main' | 'wildcard';

class ApiService {
  private axiosInstance: AxiosInstance;
  private subdomainType: SubdomainType;
  
  constructor() {
    this.subdomainType = this.detectSubdomain();
    const config = this.getApiConfig();
    
    this.axiosInstance = axios.create(config);
    this.setupInterceptors();
  }

  /**
   * Detect the current subdomain type based on window.location
   */
  private detectSubdomain(): SubdomainType {
    if (typeof window === 'undefined') {
      return 'main'; // Default for SSR
    }

    const hostname = window.location.hostname;
    
    if (hostname === 'admin.localhost') {
      return 'admin';
    } else if (hostname === 'localhost') {
      return 'main';
    } else if (hostname.endsWith('.localhost')) {
      return 'wildcard';
    } else {
      // Default fallback
      return 'main';
    }
  }

  /**
   * Get API configuration based on subdomain type
   */
  private getApiConfig(): ApiConfig {
    const commonConfig = {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    switch (this.subdomainType) {
      case 'admin':
        return {
          ...commonConfig,
          baseURL: 'http://admin.localhost:3000/api',
        };
      
      case 'main':
        return {
          ...commonConfig,
          baseURL: 'http://localhost:3000/api',
        };
      
      case 'wildcard':
        // For wildcard subdomains like app.localhost, tenant.localhost, etc.
        const subdomain = window.location.hostname.split('.')[0];
        return {
          ...commonConfig,
          baseURL: `http://${window.location.hostname}:3000/api`,
          headers: {
            ...commonConfig.headers,
            'X-Subdomain': subdomain,
          },
        };
      
      default:
        return {
          ...commonConfig,
          baseURL: 'http://localhost:3000/api',
        };
    }
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add subdomain context
        config.headers['X-Subdomain-Type'] = this.subdomainType;
        
        // Log request in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
            subdomain: this.subdomainType,
            data: config.data,
          });
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Log response in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[API Response] ${response.status}`, response.data);
        }
        
        return response;
      },
      (error) => {
        // Handle common error cases
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        } else if (error.response?.status === 403) {
          this.handleForbidden();
        } else if (error.response?.status >= 500) {
          this.handleServerError(error);
        }
        
        // Log error in development
        if (process.env.NODE_ENV === 'development') {
          console.error('[API Error]', error.response?.data || error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get authentication token from localStorage
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  /**
   * Handle 401 Unauthorized
   */
  private handleUnauthorized(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      // Redirect to login or emit event
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
  }

  /**
   * Handle 403 Forbidden
   */
  private handleForbidden(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:forbidden'));
    }
  }

  /**
   * Handle server errors (5xx)
   */
  private handleServerError(error: any): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('api:server-error', { 
        detail: error.response?.data 
      }));
    }
  }

  // ========================================
  // PUBLIC API METHODS
  // ========================================

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  /**
   * Upload file
   */
  async uploadFile<T = any>(url: string, file: File, progressCallback?: (progress: number) => void): Promise<AxiosResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.axiosInstance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressCallback && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          progressCallback(progress);
        }
      },
    });
  }

  /**
   * Get current subdomain type
   */
  getSubdomainType(): SubdomainType {
    return this.subdomainType;
  }

  /**
   * Get base URL
   */
  getBaseURL(): string {
    return this.axiosInstance.defaults.baseURL || '';
  }

  /**
   * Set auth token
   */
  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  /**
   * Clear auth token
   */
  clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
