import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all envs regardless of the `VITE_` prefix.
    const env = loadEnv(mode, '.', '');
    
    return {
      // Use relative base path for GitHub Pages deployment (e.g., /7226/)
      base: './',
      
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      
      plugins: [react()],
      
      define: {
        // Correctly stringify variables for the production build
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      
      resolve: {
        alias: {
          // Sets up the '@' alias to point to the root directory
          '@': path.resolve(__dirname, '.'),
        }
      },
      
      build: {
        // Ensures that the service worker and manifest are handled correctly in the dist folder
        outDir: 'dist',
        assetsDir: 'assets',
      }
    };
});
