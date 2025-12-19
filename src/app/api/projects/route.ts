import { NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, projectMembers, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET projects by workspaceId
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId is required' }, { status: 400 });
    }

    const projectsList = await db.query.projects.findMany({
      where: eq(projects.workspaceId, workspaceId),
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
    });

    // Transform to match frontend format
    const formatted = projectsList.map((p) => ({
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
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST create project
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, priority, status, startDate, endDate, teamLead, workspaceId, memberIds } = body;

    const [newProject] = await db
      .insert(projects)
      .values({
        name,
        description,
        priority: priority || 'MEDIUM',
        status: status || 'PLANNING',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        teamLead,
        workspaceId,
        progress: 0,
      })
      .returning();

    // Add project members
    if (memberIds && memberIds.length > 0) {
      await db.insert(projectMembers).values(
        memberIds.map((userId: string) => ({
          userId,
          projectId: newProject.id,
        }))
      );
    }

    // Fetch the complete project with relations
    const completeProject = await db.query.projects.findFirst({
      where: eq(projects.id, newProject.id),
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
    });

    // Transform to match frontend format
    const formatted = completeProject ? {
      id: completeProject.id,
      name: completeProject.name,
      description: completeProject.description,
      priority: completeProject.priority,
      status: completeProject.status,
      start_date: completeProject.startDate,
      end_date: completeProject.endDate,
      team_lead: completeProject.teamLead,
      workspaceId: completeProject.workspaceId,
      progress: completeProject.progress,
      createdAt: completeProject.createdAt,
      updatedAt: completeProject.updatedAt,
      members: completeProject.members.map((pm) => ({
        id: pm.id,
        userId: pm.userId,
        projectId: pm.projectId,
        user: pm.user,
      })),
      tasks: [],
    } : newProject;

    return NextResponse.json(formatted, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
