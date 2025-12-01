import { connectToDatabase } from '@/lib/mongodb';
import { Post } from '@/models/Post';
import { postSchema } from '@/schemas/postSchema';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;

  const post = await Post.findById(id).lean();
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

  return NextResponse.json(post);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;

  const body = await request.json();
  const validation = postSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json({ errors: validation.error.format() }, { status: 400 });

  const updated = await Post.findByIdAndUpdate(id, validation.data, {
    new: true,
  }).lean();

  if (!updated) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

  return NextResponse.json(updated, { status: 200 });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();

  const { id } = await params;

  const deleted = await Post.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
}
