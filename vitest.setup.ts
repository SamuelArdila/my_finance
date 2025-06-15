import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('@/stack', () => {
  return {
    stackServerApp: {
      getUser: vi.fn().mockResolvedValue(null),
      urls: {},
    },
  };
});
