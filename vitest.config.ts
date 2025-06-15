import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'server-only': path.resolve(__dirname, 'src/__mocks__/server-only.ts'),
      'src/stack': path.resolve(__dirname, 'src/__mocks__/stack.ts'), // mock para '@/stack'
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    env: {
      NEXT_PUBLIC_STACK_PROJECT_ID: 'mock-project-id',
    },
  },
});
