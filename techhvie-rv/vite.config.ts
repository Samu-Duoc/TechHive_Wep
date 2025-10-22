import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],


 //@ts-ignore

 test: {
  globals: true,
  enviorment: 'jsdom',
  setupFiles: './src/setupTests.ts'

  //setupFiles: './src/test/login.tsx' porque no así?
 }

})
