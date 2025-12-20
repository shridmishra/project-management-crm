import { NextResponse } from 'next/server';
import { db } from '@/db';
import { notifications } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// GET notifications for the current user
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userNotifications = await db.query.notifications.findMany({
      where: eq(notifications.userId, session.user.id),
      orderBy: [desc(notifications.createdAt)],
      limit: 20,
    });

    return NextResponse.json(userNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

// PATCH mark notification as read
export async function PATCH(request: Request) {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { notificationId, all } = await request.json();

    if (all) {
        await db
          .update(notifications)
          .set({ read: true })
          .where(eq(notifications.userId, session.user.id));
    } else if (notificationId) {
        await db
          .update(notifications)
          .set({ read: true })
          .where(and(eq(notifications.id, notificationId), eq(notifications.userId, session.user.id)));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
