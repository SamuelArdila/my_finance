import { defineConfig } from 'vitest/config';
import path from 'path';


export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'server-only': path.resolve(__dirname, 'src/__mocks__/server-only.ts'),
      '@/stack': path.resolve(__dirname, 'src/__mocks__/stack.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    env: {
      NEXT_PUBLIC_STACK_PROJECT_ID: 'mock-project-id',
    },
    coverage: {
      include: [     
        'src/components/**/*.{ts,tsx}',
        'src/actions/**/*.{ts,tsx}'
      ],
      exclude: [
        'src/components/Navbar.tsx',
        'src/components/ui/**',
        'src/__tests__/**',
        'src/__mocks__/**',
        'src/**/*.d.ts',
        'src/**/index.ts',
        'node_modules/**'
      ],
      reporter: ['text', 'lcov'],
    },
  },
});
