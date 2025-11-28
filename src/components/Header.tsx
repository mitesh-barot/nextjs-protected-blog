import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-purple-600">
          NextBlog
        </Link>

        <nav className="flex items-center gap-8">
          <Link
            href="/"
            className="text-gray-700 hover:text-purple-600 transition"
          >
            Home
          </Link>

          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-purple-600 transition"
              >
                Dashboard
              </Link>
              <Link
                href="/create"
                className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                New Post
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Hi, {session.user?.name}
                </span>
                <LogoutButton />
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
