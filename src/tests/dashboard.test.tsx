import Dashboard from "@/app/dashboard/page";
import { render, screen } from "@testing-library/react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

jest.mock("next-auth");
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("Dashboard Page", () => {
  it("redirects to login if not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    await Dashboard({ searchParams: {} });

    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("renders posts when authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "123", name: "Mitesh" },
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          posts: [{ _id: "1", title: "Test Post" }],
          total: 1,
        }),
    });

    const Component = await Dashboard({ searchParams: {} });
    render(Component);

    expect(screen.getByText("Test Post")).toBeInTheDocument();
  });
});
