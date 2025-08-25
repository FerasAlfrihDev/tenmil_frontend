/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Environment Type
  readonly VITE_NODE_ENV: string
  
  // API Configuration
  readonly VITE_API_PROTOCOL: 'http' | 'https'
  readonly VITE_API_DOMAIN: string
  readonly VITE_API_PORT: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_ADMIN_API_BASE_URL?: string
  
  // Subdomain Configuration
  readonly VITE_MAIN_SUBDOMAIN: string
  readonly VITE_ADMIN_SUBDOMAIN: string
  readonly VITE_API_PATH: string
  
  // Production Overrides
  readonly VITE_PROD_DOMAIN?: string
  readonly VITE_PROD_PROTOCOL?: 'http' | 'https'
  readonly VITE_PROD_PORT?: string
  readonly VITE_PROD_API_BASE_URL?: string
  readonly VITE_PROD_ADMIN_API_BASE_URL?: string
  
  // Security & Performance
  readonly VITE_API_TIMEOUT: string
  readonly VITE_API_DEBUG_LOGGING: string
  readonly VITE_CORS_ENABLED: string
  
  // Authentication
  readonly VITE_AUTH_TOKEN_KEY: string
  readonly VITE_AUTO_REFRESH_TOKEN: string
  
  // Feature flags
  readonly VITE_ENABLE_SUBDOMAIN_ROUTING: string
  readonly VITE_AUTO_DETECT_ENVIRONMENT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
