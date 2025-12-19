import { NextResponse } from 'next/server';
import { db } from '@/db';
import { comments } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET comments by taskId
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
    }

    const commentsList = await db.query.comments.findMany({
      where: eq(comments.taskId, taskId),
      with: {
        user: true,
      },
      orderBy: (comments, { asc }) => [asc(comments.createdAt)],
    });

    return NextResponse.json(commentsList);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST create comment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { taskId, userId, content } = body;

    const [newComment] = await db
      .insert(comments)
      .values({
        taskId,
        userId,
        content,
      })
      .returning();

    // Fetch with user
    const completeComment = await db.query.comments.findFirst({
      where: eq(comments.id, newComment.id),
      with: {
        user: true,
      },
    });

    return NextResponse.json(completeComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
