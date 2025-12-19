import { NextResponse } from 'next/server';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';

// PATCH update project
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.startDate !== undefined) updateData.startDate = body.startDate ? new Date(body.startDate) : null;
    if (body.endDate !== undefined) updateData.endDate = body.endDate ? new Date(body.endDate) : null;
    if (body.progress !== undefined) updateData.progress = body.progress;
    updateData.updatedAt = new Date();

    const [updated] = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Transform to match frontend format
    const formatted = {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      priority: updated.priority,
      status: updated.status,
      start_date: updated.startDate,
      end_date: updated.endDate,
      team_lead: updated.teamLead,
      workspaceId: updated.workspaceId,
      progress: updated.progress,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE project
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [deleted] = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
