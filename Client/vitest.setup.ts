import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

vi.mock('zustand'); // to auto-mock the way jest does

afterEach(() => {
  cleanup();
});
