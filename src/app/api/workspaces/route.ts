import { NextResponse } from 'next/server';
import { db } from '@/db';
import { workspaces, workspaceMembers, projects, projectMembers, tasks, users } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// GET all workspaces with nested data
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const members = await db.query.workspaceMembers.findMany({
      where: eq(workspaceMembers.userId, session.user.id),
      columns: { workspaceId: true },
    });

    let workspaceIds = members.map(m => m.workspaceId);

    if (workspaceIds.length === 0) {
      const { createTemplateWorkspace } = await import('@/lib/seed-workspace');
      const templateWorkspace = await createTemplateWorkspace(session.user.id);
      workspaceIds = [templateWorkspace.id];
    }

    const allWorkspaces = await db.query.workspaces.findMany({
      where: inArray(workspaces.id, workspaceIds),
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

    // Transform to match frontend expected format
    const formatted = allWorkspaces.map((ws) => ({
      id: ws.id,
      name: ws.name,
      slug: ws.slug,
      description: ws.description,
      settings: ws.settings,
      ownerId: ws.ownerId,
      createdAt: ws.createdAt,
      image_url: ws.imageUrl,
      updatedAt: ws.updatedAt,
      owner: ws.owner,
      members: ws.members.map((m) => ({
        id: m.id,
        userId: m.userId,
        workspaceId: m.workspaceId,
        message: m.message,
        role: m.role,
        user: m.user,
      })),
      projects: ws.projects.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        priority: p.priority,
        status: p.status,
        start_date: p.startDate,
        end_date: p.endDate,
        team_lead: p.teamLead,
        workspaceId: p.workspaceId,
        progress: p.progress,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        members: p.members.map((pm) => ({
          id: pm.id,
          userId: pm.userId,
          projectId: pm.projectId,
          user: pm.user,
        })),
        tasks: p.tasks.map((t) => ({
          id: t.id,
          projectId: t.projectId,
          title: t.title,
          description: t.description,
          status: t.status,
          type: t.type,
          priority: t.priority,
          assigneeId: t.assigneeId,
          due_date: t.dueDate,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
          assignee: t.assignee,
          comments: [],
        })),
      })),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return NextResponse.json({ error: 'Failed to fetch workspaces' }, { status: 500 });
  }
}

// POST create workspace
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description, ownerId, imageUrl } = body;

    const [newWorkspace] = await db
      .insert(workspaces)
      .values({
        id: `org_${Date.now()}`,
        name,
        slug,
        description,
        ownerId,
        imageUrl: imageUrl || '',
      })
      .returning();

    // Add owner as admin member
    await db.insert(workspaceMembers).values({
      userId: ownerId,
      workspaceId: newWorkspace.id,
      role: 'ADMIN',
    });

    return NextResponse.json(newWorkspace, { status: 201 });
  } catch (error) {
    console.error('Error creating workspace:', error);
    return NextResponse.json({ error: 'Failed to create workspace' }, { status: 500 });
  }
}
