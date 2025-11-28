// src/app/api/posts/[id]/route.ts
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Post } from "@/models/Post";
import { postSchema } from "@/schemas/postSchema";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await connectToDatabase();
  const post = await Post.findById(id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // SAME VALIDATION AS FORM
  const validation = postSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { errors: validation.error.format() },
      { status: 400 }
    );
  }

  await connectToDatabase();

  const post = await Post.findOneAndUpdate(
    { _id: params.id, authorId: session.user.id },
    validation.data,
    { new: true }
  );

  if (!post)
    return NextResponse.json({ error: "Post not found" }, { status: 404 });

  return NextResponse.json(post);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectToDatabase();
  const result = await Post.findOneAndDelete({
    _id: id,
    authorId: session.user.id,
  });
  if (!result) return new Response(null, { status: 404 });
  return new Response(null, { status: 204 });
}
