import axios, { AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import rateLimit from 'axios-rate-limit';


const API_URL =  import.meta.env.VITE_BASE_URL

// Function to get the tenant name from the hostname
export const getTenantName = () => {
    const hostname = window.location.hostname; // e.g., tenant_name.domain.com
    const parts = hostname.split('.');
    let tenant_name;
    if (import.meta.env.VITE_ENVIRONMENT ===  "production") {
        tenant_name = parts.length > 2 ?   parts[0] :  null
    } else {
        tenant_name = parts.length > 1 ?   parts[0] :  null
    }
    if (tenant_name === 'www'){
        tenant_name = null
    }
    return tenant_name; // Assume subdomain is the tenant_name
};

// Function to construct the base URL dynamically
export const getBaseUrl = (): string => {
    const tenantName = getTenantName();
    if (!tenantName || tenantName=='admin') {
        return API_URL; 
    }
    const TENANT_URL = `${API_URL.split("//")[0]}//${tenantName}.${API_URL.split("//")[1]}`;
    // const TENANT_URL = `${import.meta.env.VITE_TENANT_URL}`; 
    console.log("TENANT_URL", TENANT_URL)
    return TENANT_URL; 
};

// Create an Axios instance
const accessToken = localStorage.getItem('access')
const apiClient = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Accept': 'application/json',
        // 'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${accessToken}`
    },
});

// Add retry logic
axiosRetry(apiClient, {
    retries: 1,
  shouldResetTimeout: false,
});

// Add rate limiting
const rateLimitedApiClient = rateLimit(apiClient, {
    maxRequests: 10, // Max 10 requests
    perMilliseconds: 1000, // Per second
});

// Request Interceptor
rateLimitedApiClient.interceptors.request.use(
    (config: any) => {
        // Attach Authorization token
        const token = localStorage.getItem('access');
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // Add JSON Content-Type only if:
        // 1. It's not a FormData (media upload)
        // 2. It's not already set
        // 3. The `noContentType` flag is not set
        const isFormData = config.data instanceof FormData;
        const noContentType = config.noContentType || config.headers['X-No-Content-Type'];

        if (!isFormData && !noContentType && !config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json;charset=UTF-8';
        }

        return config;
    },
    (error: any) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor
rateLimitedApiClient.interceptors.response.use(
    (response) => response, // just return
    async (error: any) => {
      const originalRequest = error.config;
  
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        const refreshToken = localStorage.getItem('refresh');
        if (!refreshToken) {
          const currentPath = window.location.pathname + window.location.search;
          const encodedPath = encodeURIComponent(currentPath || '/');
          window.location.href = `/login?next=${encodedPath}`;
          return;
        }
  
        try {
          const refreshResponse:any = await apiClient.post('/token/refresh/', { refresh: refreshToken });
          const newAccess = refreshResponse?.access;
  
          localStorage.setItem('access', newAccess);
          originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
  
          return apiClient(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
  
          const currentPath = window.location.pathname + window.location.search;
          const encodedPath = encodeURIComponent(currentPath || '/');
          window.location.href = `/login?next=${encodedPath}`;
          return;
        }
      }
  
      return Promise.reject(error);
    }
  );

// Reusable API Call Method
export const apiCall = async <T>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
    data?: any,
    queryParams?: Record<string, string | number>,
    useCache = false,
    noContentType=false
): Promise<T> => {    
    const cache: Record<string, any> = {};
    const cacheKey = `${url}?${JSON.stringify(queryParams)}`;

    if (useCache && cache[cacheKey]) {
        return cache[cacheKey];
    }

    try {
        const config: AxiosRequestConfig = {
            method,
            url,
            params: queryParams,
            data,
            headers:{}
        };
        if (noContentType) {
            (config as any).noContentType = true;
            config.headers!['X-No-Content-Type'] = true; // Optional fallback check
        }
        const response = await rateLimitedApiClient(config);

        if (useCache) {
            cache[cacheKey] = response.data.data;
        }

        return response.data.data;
    } catch (error: any) {        
        return Promise.reject(error);
    }
};

export default rateLimitedApiClient;
