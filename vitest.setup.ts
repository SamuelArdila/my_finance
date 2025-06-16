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

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
}));

global.ResizeObserver = class {
  observe() {
    // Method intentionally left blank for mocking
  }
  unobserve() {
    // Method intentionally left blank for mocking
  }
  disconnect() {
    // Method intentionally left blank for mocking
  }
};

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {};
}

// --- Expanded prisma mock to include all needed mocks ---
vi.mock('@/lib/prisma', () => {
  const updateManyMock = vi.fn();
  const findManyMock = vi.fn();
  const upsertMock = vi.fn();
  const findUniqueMock = vi.fn();
  const createMock = vi.fn();
  const updateMock = vi.fn();

  // Attach mocks for access in tests if needed
  return {
    prisma: {
      incomes: {
        updateMany: updateManyMock,
        findMany: findManyMock,
        findUnique: findUniqueMock,
        create: createMock,
        update: updateMock,
      },
      expenses: {
        updateMany: updateManyMock,
        findMany: findManyMock,
        findUnique: findUniqueMock,
        create: createMock,
        update: updateMock,
      },
      monthlySavings: {
        upsert: upsertMock,
        findMany: findManyMock,
      },
      goals: {
        findMany: findManyMock,
        findUnique: findUniqueMock,
        create: createMock,
        update: updateMock,
      },
      __mocks: { updateManyMock, findManyMock, upsertMock, findUniqueMock, createMock, updateMock },
    },
  };
});
// --------------------------------------------------------

(globalThis as any).revalidatePathMock = vi.fn();
vi.mock("next/cache", () => ({
  revalidatePath: (globalThis as any).revalidatePathMock,
}));

