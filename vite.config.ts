import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'dist');

// https://vite.dev/config/
export default defineConfig({
  root,
  publicDir: resolve(__dirname, 'public'),
  plugins: [react()],
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        wi: resolve(root, 'settings', 'index.html'),
      }
    }
  }
})
