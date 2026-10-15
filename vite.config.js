import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    plugins: [react()],

    server: {
        port: 5173,
        proxy: {
            '/api': 'http://localhost:3000'
        }
    },

    preview: {
        port: 4173,
        proxy: {
            '/api': 'http://localhost:3000'
        }
    },

    build: {
        rollupOptions: {
            input: {
                main: resolve(raiz, 'index.html'),
                landing: resolve(raiz, 'src/landing/landing.html'),
                login: resolve(raiz, 'src/login/login.html'),
                dashboard: resolve(raiz, 'src/dashboard/dashboard.html')
            }
        }
    }
});
