import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import rateLimit from 'axios-rate-limit';

// Function to get the tenant name from the hostname
export const getTenantName = (): string|null => {
    const hostname = window.location.hostname; // e.g., tenant_name.domain.com
    const parts = hostname.split('.');
    return parts.length > 1 ? parts[0] : null; // Assume subdomain is the tenant_name
};

// Function to construct the base URL dynamically
export const getBaseUrl = (): string => {
    const tenantName = getTenantName();
    if (!tenantName) {
        return `http://localhost:8000/v1/api/`; // Replace 'domain.com' with your actual domain
    }
    return `http://${tenantName}.localhost:8000/v1/api/`; // Replace 'domain.com' with your actual domain
};

// Create an Axios instance
const accessToken = localStorage.getItem('access')
const apiClient = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    },
});

// Add retry logic
axiosRetry(apiClient, {
    retries: 0, // Retry up to 3 times
    retryDelay: (retryCount) => retryCount * 1000, // Delay 1 second per retry
    retryCondition: (error) => {
        // Retry only for network errors or 5xx server errors
        return error.response?.status! >= 500 || !error.response;
    },
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
        return config;
    },
    (error: any) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor
rateLimitedApiClient.interceptors.response.use(
    
    (response: AxiosResponse) => {
        let res = response.data;
        let path = location.href
        path = path.split('?next=')[1];
        
        if (res.data?.access) {
            const accessToken = res.data.access;
            const refreshToken = res.data.refresh;
            localStorage.setItem('access', accessToken);
            localStorage.setItem('refresh', refreshToken);
            window.location.href = `/${path}`; // Redirect to login page
        }
        return res;
    },
    async (error: any) => {
        const originalRequest = error.config;

        // Handle token refresh for 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            let path =location.pathname
            if (path.startsWith('/')){
                path = path.slice(1)
            }
            if (path == undefined ||  path == 'login' || path == 'register' || path == 'logout' || path == null) {
                path = '' 
            }
            try {
                
                localStorage.removeItem('access');
                const refreshToken = localStorage.getItem('refresh') || '';
                const refreshResponse:any = await apiClient.post('/token/refresh/', {
                    refresh: refreshToken,
                });
                
                const accessToken = refreshResponse.access; 
                localStorage.setItem('refresh', refreshToken);
                localStorage.setItem('access', accessToken);
                window.location.href = `/${path}`; // Redirect to previous page

                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return apiClient(originalRequest); // Retry original request

            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                window.location.href = `/login?next=${path || ''}`; // Redirect to login page
            }
        }

        console.error('Response Error:', error);
        return Promise.reject(error);
    }
);

// Reusable API Call Method
export const apiCall = async <T>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
    data?: any,
    queryParams?: Record<string, string | number>,
    useCache = false
): Promise<T> => {
    console.log("apiCall queryParams", queryParams);
    
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
        };

        const response = await rateLimitedApiClient(config);

        if (useCache) {
            cache[cacheKey] = response.data;
        }

        return response.data;
    } catch (error: any) {        
        return Promise.reject(error);
    }
};

export default rateLimitedApiClient;
