import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Post } from '@/models/Post';
import { postSchema } from '@/schemas/postSchema';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  await connectToDatabase();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;

  const posts = await Post.find({ authorId: session.user.id })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const total = await Post.countDocuments({ authorId: session.user.id });

  return NextResponse.json({ posts, total });
}

export async function POST(req: Request) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const validation = postSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ errors: validation.error.format() }, { status: 400 });
  }

  const post = await Post.create({
    ...validation.data,
    authorId: session.user.id,
    authorName: session.user.name || 'Anonymous',
  });

  return NextResponse.json(post, { status: 201 });
}
