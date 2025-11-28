import PostForm from "@/components/PostForm";
import { authOptions } from "@/lib/auth";
import { Post } from "@/models/Post";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function CreateOrEditPost({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { edit } = await searchParams;
  let post = null;

  if (edit) {
    post = await Post.findById(edit).lean();
    if (!post || post.authorId !== session.user.id) redirect("/dashboard");
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold mb-10">
        {post ? "Edit Post" : "Create New Post"}
      </h1>
      <PostForm
        post={post ? { ...post, _id: post._id.toString() } : undefined}
      />
    </div>
  );
}
