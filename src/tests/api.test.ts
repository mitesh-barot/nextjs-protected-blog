import { POST } from '@/app/api/posts/route';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

jest.mock('next-auth');
jest.mock('@/lib/mongodb');
jest.mock('@/models/Post');

const mockedSession = getServerSession as jest.Mock;

beforeEach(() => jest.clearAllMocks());

describe('POST /api/posts', () => {
  it('creates post when authenticated', async () => {
    mockedSession.mockResolvedValue({ user: { id: '123', name: 'Mitesh' } });

    const req = new NextRequest('http://localhost/api/posts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: 'Valid Title',
        content: 'This content is definitely longer than 50 characters so Zod passes.',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it('returns 401 when not authenticated', async () => {
    mockedSession.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/posts', {
      method: 'POST',
      body: JSON.stringify({ title: 'x', content: 'y' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });
});
