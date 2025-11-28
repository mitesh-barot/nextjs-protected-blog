// src/app/post/edit/[id]/page.tsx
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PostForm from "@/components/PostForm";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

const API_BASE = process.env.NEXTAUTH_URL
  ? `${process.env.NEXTAUTH_URL}/api`
  : "http://localhost:3000/api";

async function getPost(id: string) {
  const cookieStore = await cookies();
  const sessionToken =
    cookieStore.get("__Secure-next-auth.session-token")?.value ??
    cookieStore.get("next-auth.session-token")?.value;

  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (sessionToken) headers.Cookie = `next-auth.session-token=${sessionToken}`;

  const res = await fetch(`${API_BASE}/posts/${id}`, {
    headers,
    cache: "no-store",
  });

  if (!res.ok) return null;
  return await res.json();
}

export default async function EditPost({
  params,
}: {
  params: Promise<{ id: string }>; // ← params is now a Promise
}) {
  const { id } = await params; // ← AWAIT HERE

  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const post = await getPost(id);
  if (!post) notFound();

  if (post.authorId !== session.user.id) {
    return (
      <div className="text-center py-20 text-red-600 text-2xl">
        Not authorized
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">Edit Post</h1>
      <PostForm post={post} />
    </div>
  );
}
