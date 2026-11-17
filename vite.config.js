import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const localOnly = {
  host: '127.0.0.1',
  strictPort: true,
  allowedHosts: [],
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'X-Frame-Options': 'DENY',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  }
};

export default defineConfig({
  plugins: [react()],
  server: localOnly,
  preview: localOnly
});
