import DeleteButton from '@/components/DeleteButton';
import { authOptions } from '@/lib/auth';
import { Post } from '@/types/post';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const API_BASE = process.env.NEXTAUTH_URL
  ? `${process.env.NEXTAUTH_URL}/api`
  : 'http://localhost:3000/api';

const POSTS_PER_PAGE = 5;

async function getPosts(page: number) {
  const cookieStore = await cookies();
  const sessionToken =
    cookieStore.get('__Secure-next-auth.session-token')?.value ??
    cookieStore.get('next-auth.session-token')?.value;

  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (sessionToken) headers.Cookie = `next-auth.session-token=${sessionToken}`;

  const res = await fetch(`${API_BASE}/posts?page=${page}&limit=${POSTS_PER_PAGE}`, {
    headers,
    cache: 'no-store',
  });

  if (!res.ok) return { posts: [], total: 0 };

  const data = await res.json();

  // Handle both formats: { posts, total } OR plain array
  if (Array.isArray(data)) {
    return { posts: data, total: data.length };
  }
  return { posts: data.posts || [], total: data.total || 0 };
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const { posts, total } = await getPosts(page);
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="max-w-5xl mx-auto py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">My Posts ({total})</h1>
        <Link
          href="/create"
          className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition font-medium"
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-2xl">
          <p className="text-2xl text-gray-600 mb-6">No posts yet</p>
          <Link href="/create" className="text-purple-600 text-lg font-medium hover:underline">
            Write your first post
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-8">
            {posts.map((post: Post) => (
              <div
                key={post._id}
                className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100"
              >
                <h2 className="text-3xl font-bold mb-4 text-gray-800">{post.title}</h2>
                <p className="text-gray-600 mb-8 leading-relaxed line-clamp-3">{post.content}</p>
                <div className="flex gap-8 text-sm font-medium">
                  <Link href={`/post/${post._id}`} className="text-purple-600 hover:underline">
                    View Full Post
                  </Link>
                  <Link href={`/create?edit=${post._id}`} className="text-blue-600 hover:underline">
                    Edit
                  </Link>
                  <DeleteButton id={post._id} />
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-8 mt-16">
              {hasPrev && (
                <Link
                  href={`/dashboard?page=${page - 1}`}
                  className="px-8 py-4 bg-gray-200 rounded-xl hover:bg-gray-300 transition font-medium"
                >
                  Previous
                </Link>
              )}
              <span className="text-lg font-medium text-gray-700">
                Page {page} of {totalPages}
              </span>
              {hasNext && (
                <Link
                  href={`/dashboard?page=${page + 1}`}
                  className="px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-medium"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
