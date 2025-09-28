// ========================================
// API TYPES AND INTERFACES
// ========================================

// Common API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Pagination structure
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Paginated response
export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: Pagination;
}

// API Error structure
export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: any;
}

// Auth interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number;
  is_new?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  subdomain?: string;
  groups?: string[];
  permissions?: string[];
  isNew?: boolean;
  lastLogin?: string;
  profileComplete?: boolean;
}

// Backend error format
export interface BackendError {
  [key: string]: string | string[];
}

// Generic backend response format
export interface BackendResponse<T = any> {
  data?: T;
  errors?: BackendError;
  meta_data: {
    success: boolean;
    total?: number;
    status_code: number;
    message?: string;
  };
}

// Backend login response format
export interface BackendLoginResponse extends BackendResponse<{
  access: string;
  refresh: string;
  email: string;
  name: string;
  tenant_id: string;
  is_new?: boolean;
  groups?: string[];
  permissions?: string[];
}> {}

// Upload response
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}
