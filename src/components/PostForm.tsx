"use client";

import { postSchema } from "@/schemas/postSchema";
import { Post } from "@/types/post";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ← THIS STOPS PAGE RELOAD & INPUT CLEARING
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      title: (formData.get("title") as string) || "",
      content: (formData.get("content") as string) || "",
    };

    const result = postSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(post ? `/api/posts/${post._id}` : "/api/posts", {
        method: post ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setErrors({ title: "Failed to save post" });
      }
    } catch {
      setErrors({ title: "Network error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto space-y-10 py-10"
    >
      <div>
        <input
          name="title"
          type="text"
          defaultValue={post?.title ?? ""}
          placeholder="Enter a catchy title..."
          className="w-full rounded-2xl border-2 border-gray-200 px-8 py-6 text-4xl font-bold focus:border-purple-600 focus:outline-none transition"
          disabled={isLoading}
        />
        {errors.title && (
          <p className="mt-3 text-lg font-medium text-red-600">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <textarea
          name="content"
          defaultValue={post?.content ?? ""}
          rows={16}
          placeholder="Write your full story..."
          className="w-full rounded-2xl border-2 border-gray-200 px-8 py-6 text-lg focus:border-purple-600 focus:outline-none transition resize-none"
          disabled={isLoading}
        />
        {errors.content && (
          <p className="mt-3 text-lg font-medium text-red-600">
            {errors.content}
          </p>
        )}
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white px-16 py-6 rounded-2xl font-bold text-2xl shadow-2xl transition transform hover:scale-105"
        >
          {isLoading ? "Saving..." : post ? "Update Post" : "Publish Post"}
        </button>
      </div>
    </form>
  );
}
