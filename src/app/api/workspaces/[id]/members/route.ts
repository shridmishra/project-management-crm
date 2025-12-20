import { NextResponse } from 'next/server';
import { db } from '@/db';
import { workspaceMembers, users, workspaces } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: workspaceId } = await params;
    const body = await request.json();
    const { email, role } = body;

    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found. They must sign up first.' }, { status: 404 });
    }

    // Check if already a member
    const existingMember = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, user.id)
      ),
    });

    if (existingMember) {
      return NextResponse.json({ error: 'User is already a member of this workspace' }, { status: 400 });
    }

    // Add member
    await db.insert(workspaceMembers).values({
      userId: user.id,
      workspaceId,
      role: role === 'org:admin' ? 'ADMIN' : 'MEMBER',
    });

    // Fetch updated workspace with nested data to return
    const updatedWorkspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
      with: {
        owner: true,
        members: {
          with: {
            user: true,
          },
        },
        projects: {
          with: {
            members: {
              with: {
                user: true,
              },
            },
            tasks: {
              with: {
                assignee: true,
              },
            },
          },
        },
      },
    });

    if (!updatedWorkspace) {
        return NextResponse.json({ error: 'Workspace not found after update' }, { status: 404 });
    }

    // Transform to match frontend format
    const formatted = {
        ...updatedWorkspace,
        image_url: updatedWorkspace.imageUrl,
        members: updatedWorkspace.members.map(m => ({
            ...m,
            user: m.user
        })),
        projects: updatedWorkspace.projects.map(p => ({
            ...p,
            start_date: p.startDate,
            end_date: p.endDate,
            team_lead: p.teamLead,
            members: p.members.map(pm => ({ ...pm, user: pm.user })),
            tasks: p.tasks.map(t => ({ ...t, due_date: t.dueDate, assignee: t.assignee }))
        }))
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error adding member:', error);
    return NextResponse.json({ error: 'Failed to add member' }, { status: 500 });
  }
}
