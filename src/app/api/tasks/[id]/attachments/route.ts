import { NextResponse } from 'next/server';
import { db } from '@/db';
import { attachments } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET attachments for a task
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const attachmentsList = await db.query.attachments.findMany({
      where: eq(attachments.taskId, id),
      with: {
        user: true,
      },
      orderBy: (attachments, { desc }) => [desc(attachments.createdAt)],
    });

    return NextResponse.json(attachmentsList);
  } catch (error) {
    console.error('Error fetching attachments:', error);
    return NextResponse.json({ error: 'Failed to fetch attachments' }, { status: 500 });
  }
}

// POST upload attachment (Simulated)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { fileName, fileUrl, fileType, fileSize, userId } = body;

    const [newAttachment] = await db
      .insert(attachments)
      .values({
        taskId: id,
        userId,
        fileName,
        fileUrl,
        fileType,
        fileSize,
      })
      .returning();

    // Fetch with user
    const completeAttachment = await db.query.attachments.findFirst({
      where: eq(attachments.id, newAttachment.id),
      with: {
        user: true,
      },
    });

    return NextResponse.json(completeAttachment, { status: 201 });
  } catch (error) {
    console.error('Error creating attachment:', error);
    return NextResponse.json({ error: 'Failed to create attachment' }, { status: 500 });
  }
}

// DELETE attachment
// Note: Usually this would also delete the file from storage
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // This would be /api/tasks/[taskId]/attachments?attachmentId=...
  try {
    const { searchParams } = new URL(request.url);
    const attachmentId = searchParams.get('attachmentId');

    if (!attachmentId) {
      return NextResponse.json({ error: 'attachmentId is required' }, { status: 400 });
    }

    const [deleted] = await db
      .delete(attachments)
      .where(eq(attachments.id, attachmentId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting attachment:', error);
    return NextResponse.json({ error: 'Failed to delete attachment' }, { status: 500 });
  }
}
