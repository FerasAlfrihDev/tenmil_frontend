import type { BackendResponse, BackendError } from './types';

export interface ErrorHandlerOptions {
  showToast?: (type: 'error' | 'warning', title: string, message: string) => void;
  defaultTitle?: string;
  logErrors?: boolean;
}

export class ApiErrorHandler {
  private static instance: ApiErrorHandler;
  private toastHandler?: (type: 'error' | 'warning', title: string, message: string) => void;
  private logErrors: boolean = true;

  private constructor() {}

  static getInstance(): ApiErrorHandler {
    if (!ApiErrorHandler.instance) {
      ApiErrorHandler.instance = new ApiErrorHandler();
    }
    return ApiErrorHandler.instance;
  }

  setToastHandler(handler: (type: 'error' | 'warning', title: string, message: string) => void) {
    this.toastHandler = handler;
  }

  setLogErrors(enabled: boolean) {
    this.logErrors = enabled;
  }

  handleBackendResponse<T>(response: any, context?: string): T | never {
    // Check if response has the expected backend format
    if (!response || typeof response !== 'object') {
      this.handleInvalidResponse('Invalid response format', context);
      throw new Error('Invalid response format');
    }

    const backendResponse = response as BackendResponse<T>;

    // Check if meta_data exists
    if (!backendResponse.meta_data) {
      this.handleInvalidResponse('Missing meta_data in response', context);
      throw new Error('Invalid response format: missing meta_data');
    }

    // Handle successful responses
    if (backendResponse.meta_data.success) {
      return backendResponse.data as T;
    }

    // Handle error responses
    if (backendResponse.errors) {
      this.handleBackendErrors(backendResponse.errors, context);
    } else if (backendResponse.meta_data.message) {
      this.handleGenericError(backendResponse.meta_data.message, context);
    } else {
      this.handleGenericError('An unknown error occurred', context);
    }

    throw new Error('Request failed');
  }

  handleBackendErrors(errors: BackendError, context?: string) {
    if (this.logErrors) {
      console.error(`[API Error${context ? ` - ${context}` : ''}]:`, errors);
    }

    // Handle multiple errors
    Object.entries(errors).forEach(([field, messages]) => {
      const title = this.formatFieldName(field);
      const message = Array.isArray(messages) ? messages.join(', ') : messages;
      
      if (this.toastHandler) {
        this.toastHandler('error', title, message);
      }
    });
  }

  handleGenericError(message: string, context?: string) {
    if (this.logErrors) {
      console.error(`[API Error${context ? ` - ${context}` : ''}]:`, message);
    }

    if (this.toastHandler) {
      this.toastHandler('error', 'Error', message);
    }
  }

  handleInvalidResponse(message: string, context?: string) {
    if (this.logErrors) {
      console.error(`[API Invalid Response${context ? ` - ${context}` : ''}]:`, message);
    }

    if (this.toastHandler) {
      this.toastHandler('error', 'Invalid Response', 
        'The server response was not in the expected format. Please try again or contact support.');
    }
  }

  handleNetworkError(error: any, context?: string) {
    // Don't handle cancelled requests
    if (error.name === 'AbortError' || error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
      return;
    }

    if (this.logErrors) {
      console.error(`[Network Error${context ? ` - ${context}` : ''}]:`, error);
    }

    let title = 'Network Error';
    let message = 'Please check your connection and try again.';

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      
      if (status >= 500) {
        title = 'Server Error';
        message = 'The server is experiencing issues. Please try again later.';
      } else if (status === 404) {
        title = 'Not Found';
        message = 'The requested resource was not found.';
      } else if (status === 403) {
        title = 'Access Denied';
        message = 'You do not have permission to access this resource.';
      } else if (status === 401) {
        title = 'Authentication Required';
        message = 'Please log in to continue.';
      } else {
        title = `Error ${status}`;
        message = error.response.data?.message || 'An error occurred while processing your request.';
      }
    } else if (error.request) {
      // Network error
      title = 'Connection Error';
      message = 'Unable to connect to the server. Please check your internet connection.';
    }

    if (this.toastHandler) {
      this.toastHandler('error', title, message);
    }
  }

  private formatFieldName(field: string): string {
    // Convert field names to user-friendly titles
    const fieldMap: { [key: string]: string } = {
      'email': 'Email',
      'password': 'Password',
      'name': 'Name',
      'username': 'Username',
      'phone': 'Phone Number',
      'address': 'Address',
      'non_field_errors': 'Error',
      'detail': 'Error',
    };

    return fieldMap[field] || field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}

// Export singleton instance
export const errorHandler = ApiErrorHandler.getInstance();
