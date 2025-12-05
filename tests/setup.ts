import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock environment variables for testing
vi.stubEnv('OPENAI_API_KEY', 'test-key');
vi.stubEnv('POSTGRES_URL', 'postgres://test:test@localhost:5432/test');
vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'test-blob-token');
vi.stubEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000');
vi.stubEnv('NODE_ENV', 'test');
