import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  base: '/shellTactics/', // Add the base path here
});
