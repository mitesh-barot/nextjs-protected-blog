import PostForm from "@/components/PostForm";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("PostForm", () => {
  const push = jest.fn();
  const refresh = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push, refresh });
    global.fetch = jest.fn();
  });

  it("shows validation errors on empty submit", async () => {
    render(<PostForm />);

    fireEvent.click(screen.getByText("Publish Post"));

    expect(
      await screen.findByText(/Title must be at least 5 characters/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Content must be at least 20 characters/i)
    ).toBeInTheDocument();
  });

  it("submits successfully with valid data", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(<PostForm />);

    fireEvent.change(screen.getByPlaceholderText(/catchy title/i), {
      target: { value: "My Awesome Post" },
    });
    fireEvent.change(screen.getByPlaceholderText(/full story/i), {
      target: {
        value: "This is a very long and detailed blog post content...",
      },
    });

    fireEvent.click(screen.getByText("Publish Post"));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/dashboard");
      expect(refresh).toHaveBeenCalled();
    });
  });
});
