import Dashboard from '@/app/dashboard/page';
import { render, screen } from '@testing-library/react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

jest.mock('next-auth');
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
  useRouter: () => ({
    refresh: jest.fn(),
    push: jest.fn(),
  }),
}));

jest.mock('@/models/Post');
jest.mock('@/lib/mongodb');

const mockedSession = getServerSession as jest.Mock;
const mockedRedirect = redirect as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ posts: [], total: 0 }),
  });
});

describe('Dashboard Page', () => {
  it('redirects when not logged in', async () => {
    mockedSession.mockResolvedValue(null);
    await Dashboard({ searchParams: Promise.resolve({}) });
    expect(mockedRedirect).toHaveBeenCalledWith('/login');
  });

  it('shows empty state', async () => {
    mockedSession.mockResolvedValue({ user: { id: '123' } });

    const Page = await Dashboard({ searchParams: Promise.resolve({}) });

    render(Page); // FIXED — no <Page />
    expect(screen.getByText(/no posts yet/i)).toBeInTheDocument();
  });

  it('renders posts', async () => {
    mockedSession.mockResolvedValue({ user: { id: '123' } });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        posts: [
          { _id: '1', title: 'Hello' },
          { _id: '2', title: 'World' },
        ],
        total: 2,
      }),
    });

    const Page = await Dashboard({ searchParams: Promise.resolve({}) });

    render(Page); // ✅ FIXED

    expect(screen.getByText('My Posts (2)')).toBeInTheDocument();
  });
});
