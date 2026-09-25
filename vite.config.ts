import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Node 25's built-in localStorage shadows jsdom's and is unusable without a file.
    execArgv: ['--no-experimental-webstorage'],
  },
})
