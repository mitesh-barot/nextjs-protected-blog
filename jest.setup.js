// Load jest-dom matchers FIRST
import '@testing-library/jest-dom';

// Mock next/headers cookies()
jest.mock('next/headers', () => ({
  cookies: () => ({
    get: jest.fn(),
  }),
}));

// Silence baseline-browser-mapping warning
jest.mock('baseline-browser-mapping', () => ({}));

// Polyfill Request for NextRequest mock
global.Request = class {
  constructor(url, init = {}) {
    this.url = url;
    this.method = init.method || 'GET';
    this.headers = init.headers || {};
    this.body = init.body || null;
  }
  async json() {
    return this.body ? JSON.parse(this.body) : {};
  }
};
