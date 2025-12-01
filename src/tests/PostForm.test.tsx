import PostForm from '@/components/PostForm';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockPush = jest.fn();
const mockRefresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

// Critical: Reset everything before EACH test
beforeEach(() => {
  jest.clearAllMocks();
  mockPush.mockReset();
  mockRefresh.mockReset();
  //@typescript-eslint/ban-ts-comment
  global.fetch = jest.fn();
});

describe('PostForm', () => {
  const user = userEvent.setup();

  it('shows validation errors on empty submit', async () => {
    render(<PostForm />);
    await user.click(screen.getByRole('button', { name: 'Publish Post' }));

    expect(await screen.findByText(/Title must be at least 5 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/Content must be at least 20 characters/i)).toBeInTheDocument();
  });

  it('submits successfully and navigates', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(<PostForm />);

    await user.type(screen.getByPlaceholderText('Enter a catchy title...'), 'Good Title');
    await user.type(
      screen.getByPlaceholderText('Write your full story...'),
      'This is long enough content to pass validation.',
    );

    await user.click(screen.getByRole('button', { name: 'Publish Post' }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
    expect(mockRefresh).toHaveBeenCalled();
  });

  it("shows 'Failed to save post' when API fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    render(<PostForm />);

    await user.type(screen.getByPlaceholderText('Enter a catchy title...'), 'Valid Title');
    await user.type(
      screen.getByPlaceholderText('Write your full story...'),
      'Valid content more than 20 chars',
    );

    await user.click(screen.getByRole('button', { name: 'Publish Post' }));

    expect(await screen.findByText('Failed to save post')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("shows 'Saving...' and disables form during submission", async () => {
    // Mock a slow response so "Saving..." stays visible
    (global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 300)),
    );

    render(<PostForm />);

    // Fill valid data FIRST — this prevents validation from blocking isLoading
    await user.type(screen.getByPlaceholderText('Enter a catchy title...'), 'Loading Test');
    await user.type(
      screen.getByPlaceholderText('Write your full story...'),
      'This content is definitely long enough and valid.',
    );

    const submitButton = screen.getByRole('button', { name: 'Publish Post' });
    await user.click(submitButton);

    // Now "Saving..." MUST appear because validation passed
    const savingButton = await screen.findByRole('button', {
      name: 'Saving...',
    });
    expect(savingButton).toBeInTheDocument();
    expect(savingButton).toBeDisabled();

    // Wait for success
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/dashboard'));
  });
});
