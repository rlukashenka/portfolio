import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
    server: {
        host: true,
    },
    plugins: [react(), tailwindcss(), tsconfigPaths()],
    base: '/portfolio/', // because the repo is wh4t3ver-r/portfolio
})
