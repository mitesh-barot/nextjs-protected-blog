import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto text-center py-20">
      <h1 className="text-6xl font-bold text-gray-900 mb-6">
        Welcome to <span className="text-purple-600">NextBlog</span>
      </h1>
      <p className="text-xl text-gray-600 mb-10">
        A full-stack protected blog built with Next.js 14 App Router, NextAuth
        v5, MongoDB & Server Actions
      </p>
      <Link
        href="/login"
        className="bg-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-700 transition"
      >
        Get Started →
      </Link>
    </div>
  );
}
