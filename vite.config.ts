import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    proxy: {
      // Proxy API requests to avoid CORS issues
      '/api': {
        target: 'https://api.alfrih.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/v1/api'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          // Removed verbose logging for cleaner console
        },
      },
      // Proxy tenant-specific API requests - dynamic tenant routing
      '/tenant-api': {
        target: 'https://company.api.alfrih.com', // This will be overridden dynamically
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/tenant-api/, '/v1/api'),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Extract tenant from referer header
            const referer = req.headers.referer || '';
            const match = referer.match(/\/\/([^.]+)\.localhost/);
            const tenant = match?.[1] || 'company';
            
            // Dynamically set the target based on tenant
            const tenantTarget = `https://${tenant}.api.alfrih.com`;
            // Tenant routing configured
            
            // Override the target for this specific request
            proxyReq.setHeader('Host', `${tenant}.api.alfrih.com`);
          });
        },
        router: (req) => {
          // Dynamic routing based on referer
          const referer = req.headers.referer || '';
          const match = referer.match(/\/\/([^.]+)\.localhost/);
          const tenant = match?.[1] || 'company';
          const target = `https://${tenant}.api.alfrih.com`;
          return target;
        }
      }
    }
  },
})
