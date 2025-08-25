// ========================================
// CENTRALIZED DYNAMIC API SERVICE
// ========================================
//
// This API service automatically configures itself based on environment variables
// and supports both development (localhost) and production environments with
// dynamic domain, protocol, and subdomain handling.
//
// ENVIRONMENT CONFIGURATION:
// 
// 1. Basic Configuration:
//    - VITE_API_PROTOCOL: 'http' | 'https' (default: http for dev, https for prod)
//    - VITE_API_DOMAIN: Your domain (e.g., 'localhost' or 'yourdomain.com')
//    - VITE_API_PORT: Port number (e.g., '3000', empty for production)
//    - VITE_API_PATH: API path (default: '/api')
//
// 2. Subdomain Configuration:
//    - VITE_MAIN_SUBDOMAIN: Main app subdomain (empty for root domain)
//    - VITE_ADMIN_SUBDOMAIN: Admin subdomain (default: 'admin')
//    - VITE_ENABLE_SUBDOMAIN_ROUTING: Enable/disable subdomain detection
//
// 3. Production Overrides:
//    - VITE_PROD_DOMAIN: Production domain override
//    - VITE_PROD_PROTOCOL: Production protocol override
//    - VITE_PROD_PORT: Production port override
//    - VITE_PROD_API_BASE_URL: Full production API URL override
//
// 4. Environment Detection:
//    - Auto-detects production vs development based on hostname
//    - VITE_AUTO_DETECT_ENVIRONMENT: Enable/disable auto-detection
//    - VITE_NODE_ENV: Explicit environment setting
//
// EXAMPLE CONFIGURATIONS:
//
// Development (localhost):
//   VITE_API_DOMAIN=localhost
//   VITE_API_PORT=8000
//   VITE_API_PROTOCOL=http
//   → localhost:5173 → http://localhost:8000/api
//   → admin.localhost:5173 → http://localhost:8000/api
//   → tenmil.localhost:5173 → http://tenmil.localhost:8000/api
//
// Production:
//   VITE_PROD_DOMAIN=myapp.com
//   VITE_PROD_PROTOCOL=https
//   VITE_PROD_PORT=
//   → Results in: https://myapp.com/api
//
// Subdomain Routing Logic:
//   - Main & Admin: Use main backend (localhost:8000)
//   - Wildcard (tenant): Use matching tenant backend (tenant.localhost:8000)
//
// ========================================

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration Interface
interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

// Environment Configuration Interface
interface EnvironmentConfig {
  protocol: 'http' | 'https';
  domain: string;
  port: string;
  apiPath: string;
  mainSubdomain: string;
  adminSubdomain: string;
  isProduction: boolean;
  enableSubdomainRouting: boolean;
  debugLogging: boolean;
  authTokenKey: string;
}

// Supported subdomain types
type SubdomainType = 'admin' | 'main' | 'wildcard';

class ApiService {
  private axiosInstance: AxiosInstance;
  private subdomainType: SubdomainType;
  private envConfig: EnvironmentConfig;
  
  constructor() {
    this.envConfig = this.loadEnvironmentConfig();
    this.subdomainType = this.detectSubdomain();
    const config = this.getApiConfig();
    
    this.axiosInstance = axios.create(config);
    this.setupInterceptors();
  }

  /**
   * Load environment configuration from Vite environment variables
   */
  private loadEnvironmentConfig(): EnvironmentConfig {
    // Determine if we're in production
    const isProduction = this.isProductionEnvironment();
    
    // Get base configuration
    const protocol = isProduction 
      ? (import.meta.env.VITE_PROD_PROTOCOL || 'https') 
      : (import.meta.env.VITE_API_PROTOCOL || 'http');
    
    const domain = isProduction
      ? (import.meta.env.VITE_PROD_DOMAIN || import.meta.env.VITE_API_DOMAIN || 'localhost')
      : (import.meta.env.VITE_API_DOMAIN || 'localhost');
    
    const port = isProduction
      ? (import.meta.env.VITE_PROD_PORT || '')
      : (import.meta.env.VITE_API_PORT || '8000');

    return {
      protocol: protocol as 'http' | 'https',
      domain,
      port,
      apiPath: import.meta.env.VITE_API_PATH || '/api',
      mainSubdomain: import.meta.env.VITE_MAIN_SUBDOMAIN || '',
      adminSubdomain: import.meta.env.VITE_ADMIN_SUBDOMAIN || 'admin',
      isProduction,
      enableSubdomainRouting: import.meta.env.VITE_ENABLE_SUBDOMAIN_ROUTING === 'true',
      debugLogging: import.meta.env.VITE_API_DEBUG_LOGGING === 'true',
      authTokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token'
    };
  }

  /**
   * Determine if we're in a production environment
   */
  private isProductionEnvironment(): boolean {
    // Check explicit environment override
    if (import.meta.env.VITE_AUTO_DETECT_ENVIRONMENT === 'false') {
      return import.meta.env.VITE_NODE_ENV === 'production';
    }

    // Auto-detect based on current hostname
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      
      // If we have a production domain configured and we're on it
      if (import.meta.env.VITE_PROD_DOMAIN && hostname === import.meta.env.VITE_PROD_DOMAIN) {
        return true;
      }
      
      // Auto-detect: if not localhost or local IP, assume production
      return !hostname.includes('localhost') && 
             !hostname.includes('127.0.0.1') && 
             !hostname.includes('0.0.0.0') &&
             hostname !== '::1';
    }

    // Fallback to NODE_ENV
    return import.meta.env.VITE_NODE_ENV === 'production' || import.meta.env.NODE_ENV === 'production';
  }

  /**
   * Detect the current subdomain type based on window.location and environment config
   */
  private detectSubdomain(): SubdomainType {
    if (typeof window === 'undefined') {
      return 'main'; // Default for SSR
    }

    // If subdomain routing is disabled, always return main
    if (!this.envConfig.enableSubdomainRouting) {
      return 'main';
    }

    const hostname = window.location.hostname;
    const { domain, adminSubdomain, mainSubdomain } = this.envConfig;
    
    // For development (localhost-based)
    if (domain === 'localhost') {
      if (hostname === `${adminSubdomain}.localhost`) {
        return 'admin';
      } else if (hostname === 'localhost') {
        return 'main';
      } else if (hostname.endsWith('.localhost')) {
        return 'wildcard';
      }
    } else {
      // For production domains
      const baseDomain = domain;
      
      if (hostname === `${adminSubdomain}.${baseDomain}`) {
        return 'admin';
      } else if (mainSubdomain && hostname === `${mainSubdomain}.${baseDomain}`) {
        return 'main';
      } else if (hostname === baseDomain) {
        return 'main';
      } else if (hostname.endsWith(`.${baseDomain}`)) {
        return 'wildcard';
      }
    }
    
    // Default fallback
    return 'main';
  }

  /**
   * Get API configuration based on subdomain type and environment config
   */
  private getApiConfig(): ApiConfig {
    const timeout = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10);
    
    const commonConfig = {
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Check for explicit base URL overrides first
    const explicitBaseUrl = this.getExplicitBaseUrl();
    if (explicitBaseUrl) {
      return {
        ...commonConfig,
        baseURL: explicitBaseUrl,
      };
    }

    // Construct base URL dynamically
    const baseUrl = this.constructBaseUrl();

    switch (this.subdomainType) {
      case 'admin':
        // Admin routes to main backend (localhost:8000), not separate admin backend
        return {
          ...commonConfig,
          baseURL: baseUrl, // Use main backend URL
          headers: {
            ...commonConfig.headers,
            'X-Admin-Request': 'true', // Mark as admin request for backend routing
          },
        };
      
      case 'main':
        return {
          ...commonConfig,
          baseURL: baseUrl,
        };
      
      case 'wildcard': {
        // Wildcard subdomains route to matching backend subdomain
        // e.g., tenmil.localhost:5173 → tenmil.localhost:8000/api
        const wildcardUrl = this.constructWildcardUrl();
        const subdomain = typeof window !== 'undefined' ? window.location.hostname.split('.')[0] : '';
        
        return {
          ...commonConfig,
          baseURL: wildcardUrl,
          headers: {
            ...commonConfig.headers,
            'X-Subdomain': subdomain,
            'X-Tenant-Request': 'true', // Mark as tenant request
          },
        };
      }
      
      default:
        return {
          ...commonConfig,
          baseURL: baseUrl,
        };
    }
  }

  /**
   * Check for explicit base URL overrides in environment variables
   */
  private getExplicitBaseUrl(): string | null {
    const { isProduction } = this.envConfig;
    
    if (isProduction) {
      if (this.subdomainType === 'admin' && import.meta.env.VITE_PROD_ADMIN_API_BASE_URL) {
        return import.meta.env.VITE_PROD_ADMIN_API_BASE_URL;
      }
      if (import.meta.env.VITE_PROD_API_BASE_URL) {
        return import.meta.env.VITE_PROD_API_BASE_URL;
      }
    } else {
      if (this.subdomainType === 'admin' && import.meta.env.VITE_ADMIN_API_BASE_URL) {
        return import.meta.env.VITE_ADMIN_API_BASE_URL;
      }
      if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
      }
    }
    
    return null;
  }

  /**
   * Construct base URL from environment configuration
   */
  private constructBaseUrl(): string {
    const { protocol, domain, port, apiPath, mainSubdomain } = this.envConfig;
    
    const portPart = port ? `:${port}` : '';
    const subdomainPart = mainSubdomain ? `${mainSubdomain}.` : '';
    
    return `${protocol}://${subdomainPart}${domain}${portPart}${apiPath}`;
  }

  /**
   * Construct wildcard URL for dynamic subdomains
   */
  private constructWildcardUrl(): string {
    const { protocol, port, apiPath } = this.envConfig;
    
    if (typeof window === 'undefined') {
      return this.constructBaseUrl(); // Fallback for SSR
    }
    
    const hostname = window.location.hostname;
    const portPart = port ? `:${port}` : '';
    
    return `${protocol}://${hostname}${portPart}${apiPath}`;
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

        // Add environment and subdomain context
        config.headers['X-Subdomain-Type'] = this.subdomainType;
        config.headers['X-Environment'] = this.envConfig.isProduction ? 'production' : 'development';
        
        // Log request if debug logging is enabled
        if (this.envConfig.debugLogging) {
          console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
            subdomain: this.subdomainType,
            environment: this.envConfig.isProduction ? 'production' : 'development',
            baseURL: config.baseURL,
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
        // Log response if debug logging is enabled
        if (this.envConfig.debugLogging) {
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
        
        // Log error if debug logging is enabled
        if (this.envConfig.debugLogging) {
          console.error('[API Error]', error.response?.data || error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get authentication token from localStorage using dynamic key
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.envConfig.authTokenKey);
  }

  /**
   * Handle 401 Unauthorized
   */
  private handleUnauthorized(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.envConfig.authTokenKey);
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

  /**
   * GET request
   */
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  /**
   * POST request
   */
  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  /**
   * PUT request
   */
  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  /**
   * Upload file
   */
  async uploadFile<T = unknown>(url: string, file: File, progressCallback?: (progress: number) => void): Promise<AxiosResponse<T>> {
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
   * Set auth token using dynamic key
   */
  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.envConfig.authTokenKey, token);
    }
  }

  /**
   * Clear auth token using dynamic key
   */
  clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.envConfig.authTokenKey);
    }
  }

  /**
   * Get current environment configuration
   */
  getEnvironmentConfig(): EnvironmentConfig {
    return { ...this.envConfig };
  }

  /**
   * Get current environment info
   */
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

  /**
   * Test method to verify routing configuration
   * Use this in browser console: apiService.testRouting()
   */
  testRouting(): void {
    if (typeof window === 'undefined') return;
    
    console.log('🚀 API Service Routing Test');
    console.log('==========================');
    console.log(`Current Frontend: ${window.location.hostname}:${window.location.port}`);
    console.log(`Detected Subdomain Type: ${this.subdomainType}`);
    console.log(`API Backend URL: ${this.getBaseURL()}`);
    console.log(`Environment: ${this.envConfig.isProduction ? 'Production' : 'Development'}`);
    console.log(`Protocol: ${this.envConfig.protocol}`);
    
    console.log('\n📋 Expected Routing:');
    console.log('• localhost:5173 → localhost:8000/api (main backend)');
    console.log('• admin.localhost:5173 → localhost:8000/api (main backend)');
    console.log('• tenmil.localhost:5173 → tenmil.localhost:8000/api (tenant backend)');
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
