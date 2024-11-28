import '@testing-library/jest-dom'; 
import { vi } from 'vitest'; 

vi.mock('some-library', () => ({
  someFunction: vi.fn(),
}));