import { defineConfig } from 'vite';

export default defineConfig({
  // ... other plugins and config
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5173/', // Update this from 3000 to 5000
        changeOrigin: true,
        // secure: false, // You may need this if you ever use https locally
      }
    }
  }
});