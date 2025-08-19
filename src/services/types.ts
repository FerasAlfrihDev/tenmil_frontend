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
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  subdomain?: string;
}

// Upload response
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}
