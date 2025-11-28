// src/app/post/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";

const API_BASE = process.env.NEXTAUTH_URL
  ? `${process.env.NEXTAUTH_URL}/api`
  : "http://localhost:3000/api";

async function getPost(id: string) {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return await res.json();
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) notFound();

  return (
    <article className="max-w-4xl mx-auto py-16 px-6">
      <Link
        href="/dashboard"
        className="text-purple-600 hover:underline mb-8 inline-block"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">
        {post.title}
      </h1>

      <div className="flex items-center gap-4 text-gray-600 mb-12">
        <span className="font-medium">{post.authorName}</span>
        <span>•</span>
        <time>
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>

      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
        <p className="whitespace-pre-wrap">{post.content}</p>
      </div>

      <div className="mt-16 pt-8 border-t border-gray-200">
        <Link
          href="/dashboard"
          className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition font-medium"
        >
          Back to My Posts
        </Link>
      </div>
    </article>
  );
}
