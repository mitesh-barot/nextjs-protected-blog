import { POST } from "@/app/api/posts/route";
import { Post } from "@/models/Post";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

jest.mock("next-auth");
jest.mock("@/lib/mongodb");

describe("POST /api/posts", () => {
  it("creates a post when authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "123", name: "Mitesh" },
    });

    Post.create = jest.fn().mockResolvedValue({ _id: "new1", title: "Hello" });

    const req = new NextRequest("http://localhost/api/posts", {
      method: "POST",
      body: JSON.stringify({ title: "Hello", content: "World" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.title).toBe("Hello");
  });

  it("returns 401 if not logged in", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest("http://localhost/api/posts", {
      method: "POST",
    });
    const res = await POST(req);

    expect(res.status).toBe(401);
  });
});
