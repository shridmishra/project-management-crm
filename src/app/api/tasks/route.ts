import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tasks } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET tasks by projectId
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    const tasksList = await db.query.tasks.findMany({
      where: eq(tasks.projectId, projectId),
      with: {
        assignee: true,
        comments: {
          with: {
            user: true,
          },
        },
      },
    });

    // Transform to match frontend format
    const formatted = tasksList.map((t) => ({
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
      comments: t.comments,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST create task
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, title, description, type, status, priority, assigneeId, dueDate } = body;

    const [newTask] = await db
      .insert(tasks)
      .values({
        projectId,
        title,
        description: description || '',
        type: type || 'TASK',
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        assigneeId,
        dueDate: dueDate ? new Date(dueDate) : new Date(),
      })
      .returning();

    // Fetch with assignee
    const completeTask = await db.query.tasks.findFirst({
      where: eq(tasks.id, newTask.id),
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
      comments: [],
    } : newTask;

    return NextResponse.json(formatted, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
