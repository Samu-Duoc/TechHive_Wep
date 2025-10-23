import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // ignoramos la advertencia de TypeScript porque "test" no forma parte del tipo oficial de Vite
  // @ts-ignore
  test: {
    globals: true,                     // permite usar describe, test, expect sin importarlos
    environment: 'jsdom',              // simula un navegador para los tests de React
    setupFiles: './src/setupTests.ts', // archivo para configurar librerías antes de los tests
  },
});