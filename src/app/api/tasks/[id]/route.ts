import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tasks } from '@/db/schema';
import { eq } from 'drizzle-orm';

// PATCH update task
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.assigneeId !== undefined) updateData.assigneeId = body.assigneeId;
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    updateData.updatedAt = new Date();

    const [updated] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Fetch with assignee
    const completeTask = await db.query.tasks.findFirst({
      where: eq(tasks.id, updated.id),
      with: {
        assignee: true,
      },
    });

    // Transform to match frontend format
    const formatted = completeTask ? {
      id: completeTask.id,
      projectId: completeTask.projectId,
      title: completeTask.title,
      description: completeTask.description,
      status: completeTask.status,
      type: completeTask.type,
      priority: completeTask.priority,
      assigneeId: completeTask.assigneeId,
      due_date: completeTask.dueDate,
      createdAt: completeTask.createdAt,
      updatedAt: completeTask.updatedAt,
      assignee: completeTask.assignee,
    } : updated;

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE task
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [deleted] = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
