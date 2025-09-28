// ========================================
// CENTRALIZED API SERVICE
// ========================================
//
// Production-ready API service with dynamic subdomain routing
// and environment-based configuration.
//
// Environment Variables:
// - VITE_API_PROTOCOL: 'http' | 'https'
// - VITE_API_DOMAIN: API domain
// - VITE_API_PATH: API path (default: '/api')
// - VITE_ADMIN_SUBDOMAIN: Admin subdomain (default: 'admin')
// - VITE_ENABLE_SUBDOMAIN_ROUTING: Enable subdomain detection
// - VITE_AUTO_DETECT_ENVIRONMENT: Enable auto environment detection
// - VITE_API_DEBUG_LOGGING: Enable debug logging
// - VITE_AUTH_TOKEN_KEY: Auth token storage key
// - VITE_API_TIMEOUT: Request timeout in ms
//
// ========================================

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { errorHandler } from './errorHandler';

interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

interface EnvironmentConfig {
  protocol: 'http' | 'https';
  domain: string;
  frontendDomain: string;
  port: string;
  apiPath: string;
  mainSubdomain: string;
  adminSubdomain: string;
  isProduction: boolean;
  enableSubdomainRouting: boolean;
  debugLogging: boolean;
  authTokenKey: string;
}

type SubdomainType = 'admin' | 'main' | 'wildcard';

class ApiService {
  private axiosInstance: AxiosInstance;
  private subdomainType: SubdomainType;
  private envConfig: EnvironmentConfig;
  
  // Global request deduplication
  private activeRequests: Map<string, Promise<AxiosResponse>> = new Map();
  
  constructor() {
    this.envConfig = this.loadEnvironmentConfig();
    this.subdomainType = this.detectSubdomain();
    const config = this.getApiConfig();
    
    this.axiosInstance = axios.create(config);
    this.setupInterceptors();
  }

  private loadEnvironmentConfig(): EnvironmentConfig {
    const isProduction = this.isProductionEnvironment();
    
    const protocol = import.meta.env.VITE_API_PROTOCOL || (isProduction ? 'https' : 'http');
    const domain = import.meta.env.VITE_API_DOMAIN || 'localhost';
    const port = import.meta.env.VITE_API_PORT || '';

    return {
      protocol: protocol as 'http' | 'https',
      domain,
      frontendDomain: import.meta.env.VITE_FRONTEND_DOMAIN || 'localhost',
      port,
      apiPath: import.meta.env.VITE_API_PATH || '/v1/api',
      mainSubdomain: import.meta.env.VITE_MAIN_SUBDOMAIN || '',
      adminSubdomain: import.meta.env.VITE_ADMIN_SUBDOMAIN || 'admin',
      isProduction,
      enableSubdomainRouting: import.meta.env.VITE_ENABLE_SUBDOMAIN_ROUTING === 'true',
      debugLogging: import.meta.env.VITE_API_DEBUG_LOGGING === 'true',
      authTokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token'
    };
  }

  private isProductionEnvironment(): boolean {
    if (import.meta.env.VITE_AUTO_DETECT_ENVIRONMENT === 'false') {
      return import.meta.env.VITE_NODE_ENV === 'production';
    }

    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      return !hostname.includes('localhost') && 
             !hostname.includes('127.0.0.1') && 
             !hostname.includes('0.0.0.0') &&
             hostname !== '::1';
    }

    return import.meta.env.VITE_NODE_ENV === 'production' || import.meta.env.NODE_ENV === 'production';
  }

  private detectSubdomain(): SubdomainType {
    if (typeof window === 'undefined' || !this.envConfig.enableSubdomainRouting) {
      return 'main';
    }

    const hostname = window.location.hostname;
    const { frontendDomain, adminSubdomain, mainSubdomain } = this.envConfig;
    
    if (frontendDomain === 'localhost') {
      if (hostname === `${adminSubdomain}.localhost`) return 'admin';
      if (hostname === 'localhost') return 'main';
      if (hostname.endsWith('.localhost')) return 'wildcard';
    } else {
      if (hostname === `${adminSubdomain}.${frontendDomain}`) return 'admin';
      if (mainSubdomain && hostname === `${mainSubdomain}.${frontendDomain}`) return 'main';
      if (hostname === frontendDomain) return 'main';
      if (hostname.endsWith(`.${frontendDomain}`)) return 'wildcard';
    }
    
    return 'main';
  }

  private getApiConfig(): ApiConfig {
    const timeout = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10);
    const baseUrl = this.constructBaseUrl();
    
    const commonConfig = {
      timeout,
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    switch (this.subdomainType) {
      case 'admin':
        return {
          ...commonConfig,
          headers: {
            ...commonConfig.headers,
            'X-Admin-Request': 'true',
          },
        };
      
      case 'wildcard': {
        const wildcardUrl = this.constructWildcardUrl();
        const subdomain = typeof window !== 'undefined' ? window.location.hostname.split('.')[0] : '';
        
        return {
          ...commonConfig,
          baseURL: wildcardUrl,
          headers: {
            ...commonConfig.headers,
            'X-Subdomain': subdomain,
            'X-Tenant-Request': 'true',
          },
        };
      }
      
      default:
        return commonConfig;
    }
  }

  private constructBaseUrl(): string {
    const { protocol, domain, port, apiPath, mainSubdomain, isProduction } = this.envConfig;
    
    // In development, use Vite proxy to avoid CORS issues
    if (!isProduction && typeof window !== 'undefined') {
      return '/api'; // Vite will proxy this to the backend
    }
    
    const portPart = port ? `:${port}` : '';
    const subdomainPart = mainSubdomain ? `${mainSubdomain}.` : '';
    
    return `${protocol}://${subdomainPart}${domain}${portPart}${apiPath}`;
  }

  private constructWildcardUrl(): string {
    const { protocol, domain, port, apiPath, isProduction } = this.envConfig;
    
    if (typeof window === 'undefined') {
      return this.constructBaseUrl();
    }
    
    // In development, use tenant-specific proxy endpoint
    if (!isProduction) {
      return '/tenant-api'; // Vite will proxy this to tenant backend
    }
    
    // Extract subdomain from frontend hostname and apply to backend domain
    const frontendHostname = window.location.hostname;
    const subdomain = frontendHostname.split('.')[0];
    const portPart = port ? `:${port}` : '';
    
    // For wildcard subdomains, route to subdomain.api.backend-domain.com
    return `${protocol}://${subdomain}.api.${domain}${portPart}${apiPath}`;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        config.headers['X-Subdomain-Type'] = this.subdomainType;
        config.headers['X-Environment'] = this.envConfig.isProduction ? 'production' : 'development';
        
        if (this.envConfig.debugLogging) {
          console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        if (this.envConfig.debugLogging) {
          console.log(`[API Response] ${response.status}`, response.config.url);
        }
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        } else if (error.response?.status === 403) {
          this.handleForbidden();
        } else if (error.response?.status >= 500) {
          this.handleServerError(error);
        }
        
        if (this.envConfig.debugLogging) {
          console.error('[API Error]', error.response?.data || error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.envConfig.authTokenKey);
  }

  private handleUnauthorized(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.envConfig.authTokenKey);
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
  }

  private handleForbidden(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:forbidden'));
    }
  }

  private handleServerError(error: unknown): void {
    if (typeof window !== 'undefined') {
      const errorDetail = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: unknown } }).response?.data 
        : error;
      window.dispatchEvent(new CustomEvent('api:server-error', { 
        detail: errorDetail
      }));
    }
  }

  // ========================================
  // PUBLIC API METHODS
  // ========================================

  // Generate a unique key for request deduplication
  private generateRequestKey(method: string, url: string, config?: AxiosRequestConfig): string {
    const params = config?.params ? JSON.stringify(config.params) : '';
    const headers = config?.headers ? JSON.stringify(config.headers) : '';
    return `${method}:${url}:${params}:${headers}`;
  }

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const requestKey = this.generateRequestKey('GET', url, config);
    
    // Check if this exact request is already in progress
    if (this.activeRequests.has(requestKey)) {
      if (this.envConfig.debugLogging) {
        console.log(`[API Deduplication] GET ${url} - using existing request`);
      }
      return this.activeRequests.get(requestKey) as Promise<AxiosResponse<T>>;
    }

    try {
      // Create and store the request promise
      const requestPromise = this.axiosInstance.get<T>(url, config);
      this.activeRequests.set(requestKey, requestPromise);
      
      const response = await requestPromise;
      
      // Clean up the request from active requests
      this.activeRequests.delete(requestKey);
      
      return response;
    } catch (error) {
      // Clean up the request from active requests on error
      this.activeRequests.delete(requestKey);
      
      errorHandler.handleNetworkError(error, `GET ${url}`);
      throw error;
    }
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await this.axiosInstance.post<T>(url, data, config);
    } catch (error) {
      errorHandler.handleNetworkError(error, `POST ${url}`);
      throw error;
    }
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await this.axiosInstance.put<T>(url, data, config);
    } catch (error) {
      errorHandler.handleNetworkError(error, `PUT ${url}`);
      throw error;
    }
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await this.axiosInstance.patch<T>(url, data, config);
    } catch (error) {
      errorHandler.handleNetworkError(error, `PATCH ${url}`);
      throw error;
    }
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await this.axiosInstance.delete<T>(url, config);
    } catch (error) {
      errorHandler.handleNetworkError(error, `DELETE ${url}`);
      throw error;
    }
  }

  async uploadFile<T = unknown>(url: string, file: File, progressCallback?: (progress: number) => void): Promise<AxiosResponse<T>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      return await this.axiosInstance.post<T>(url, formData, {
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
    } catch (error) {
      errorHandler.handleNetworkError(error, `UPLOAD ${url}`);
      throw error;
    }
  }

  getSubdomainType(): SubdomainType {
    return this.subdomainType;
  }

  getBaseURL(): string {
    return this.axiosInstance.defaults.baseURL || '';
  }

  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.envConfig.authTokenKey, token);
    }
  }

  clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.envConfig.authTokenKey);
    }
  }

  getEnvironmentConfig(): EnvironmentConfig {
    return { ...this.envConfig };
  }

  getEnvironmentInfo(): { 
    isProduction: boolean; 
    domain: string; 
    protocol: string; 
    baseURL: string;
    subdomain: SubdomainType;
  } {
    return {
      isProduction: this.envConfig.isProduction,
      domain: this.envConfig.domain,
      protocol: this.envConfig.protocol,
      baseURL: this.getBaseURL(),
      subdomain: this.subdomainType
    };
  }

  // ========================================
  // AUTHENTICATION METHODS
  // ========================================

  async login(credentials: { email: string; password: string }) {
    return this.post('/users/login', credentials);
  }

  async logout() {
    try {
      await this.post('/users/logout');
    } catch (error) {
      // Continue with logout even if server request fails
      console.warn('Logout request failed:', error);
    } finally {
      this.clearAuthToken();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    }
  }

  async getCurrentUser() {
    return this.get('/users/me');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  getStoredUser(): any | null {
    if (typeof window === 'undefined') return null;
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;