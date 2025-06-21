import '@testing-library/jest-dom';
import { vi } from 'vitest';
import type { Mock } from 'vitest';

// Mock scrollIntoView because it's not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock fetch to avoid real network requests in tests
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ cwd: '/mock/path' }),
    ok: true,
  })
) as Mock; 