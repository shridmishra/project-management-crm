import { db } from "@/db";
import { workspaces, workspaceMembers, projects, projectMembers, tasks } from "@/db/schema";
import { v4 as uuidv4 } from 'uuid';

export async function createTemplateWorkspace(userId: string) {
    const workspaceId = `org_${Date.now()}`;
    const projectId = uuidv4();

    // 1. Create Workspace
    const [newWorkspace] = await db.insert(workspaces).values({
        id: workspaceId,
        name: "Example Template Workspace",
        slug: `example-template-${Date.now()}`,
        description: "This is a template workspace for you to explore features.",
        ownerId: userId,
        imageUrl: "/workspace_img_default.png",
    }).returning();

    // 2. Add Member (Owner)
    await db.insert(workspaceMembers).values({
        userId: userId,
        workspaceId: workspaceId,
        role: "ADMIN",
    });

    // 3. Create Example Project
    await db.insert(projects).values({
        id: projectId,
        name: "Example Project",
        description: "This is an example project to get you started.",
        priority: "MEDIUM",
        status: "ACTIVE",
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week later
        teamLead: userId,
        workspaceId: workspaceId,
        progress: 0,
    });

    // 4. Add Project Member
    await db.insert(projectMembers).values({
        userId: userId,
        projectId: projectId,
    });

    // 4b. Create Second Project (Planning Phase)
    const projectId2 = uuidv4();
    await db.insert(projects).values({
        id: projectId2,
        name: "Future Roadmap",
        description: "Ideas for next quarter.",
        priority: "LOW",
        status: "PLANNING",
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        teamLead: userId,
        workspaceId: workspaceId,
        progress: 0,
    });

    await db.insert(projectMembers).values({
        userId: userId,
        projectId: projectId2,
    });

    // 5. Create Example Tasks
    const tasksData = [
        // Project 1 Tasks
        {
            id: uuidv4(),
            projectId: projectId,
            title: "Explore the Dashboard",
            description: "Check out the stats and overview of your new workspace.",
            status: "DONE",
            type: "TASK",
            priority: "HIGH",
            assigneeId: userId,
            dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
        },
        {
            id: uuidv4(),
            projectId: projectId,
            title: "Create your first real project",
            description: "Click the 'New Project' button to start your own journey.",
            status: "IN_PROGRESS",
            type: "FEATURE",
            priority: "MEDIUM",
            assigneeId: userId,
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        },
        {
            id: uuidv4(),
            projectId: projectId,
            title: "Invite team members",
            description: "Go to workspace settings and invite your colleagues.",
            status: "TODO",
            type: "TASK",
            priority: "LOW",
            assigneeId: userId,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        {
            id: uuidv4(),
            projectId: projectId,
            title: "Report a bug example",
            description: "This is what a bug report looks like.",
            status: "TODO",
            type: "BUG",
            priority: "HIGH",
            assigneeId: userId,
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        },
        {
            id: uuidv4(),
            projectId: projectId,
            title: "Improve documentation",
            description: "An example of an improvement task.",
            status: "TODO",
            type: "IMPROVEMENT",
            priority: "MEDIUM",
            assigneeId: userId,
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        },
        {
            id: uuidv4(),
            projectId: projectId,
            title: "Research new tools",
            description: "An example of an 'Other' task type.",
            status: "TODO",
            type: "OTHER",
            priority: "LOW",
            assigneeId: userId,
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        }
    ];

    // Typcasting might be needed depending on strictness, but let's try direct insertion
    await db.insert(tasks).values(tasksData as any); 

    return newWorkspace;
}
