import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Relative asset paths, so the build works from a GitHub Pages subpath
  // (/<repo>/) without hardcoding the repo name. Hash routing needs no rewrites.
  base: './',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    // Node 25's built-in localStorage shadows jsdom's and is unusable without a file.
    execArgv: ['--no-experimental-webstorage'],
  },
})
