import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // Must match the backend's DEV_CLIENT_URL (CORS). Fail loudly instead of
  // silently moving to 5174 when the port is busy.
  server: { port: 5173, strictPort: true },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // same as tsconfig paths

    }
  }
});