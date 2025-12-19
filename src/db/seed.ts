import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local before anything else
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Run with: npx tsx src/db/seed.ts
// Make sure DATABASE_URL is set in your .env.local

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const seed = async () => {
  console.log(' Seeding database...');

  // Create users
  const usersData = [
    {
      id: 'user_1',
      name: 'Alex Smith',
      email: 'alexsmith@example.com',
      image: '/profile_img_a.svg',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'user_2',
      name: 'John Warrel',
      email: 'johnwarrel@example.com',
      image: '/profile_img_j.svg',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'user_3',
      name: 'Oliver Watts',
      email: 'oliverwatts@example.com',
      image: '/profile_img_o.svg',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  console.log('Creating users...');
  await db.insert(schema.users).values(usersData).onConflictDoNothing();

  // Create workspaces
  const workspacesData = [
    {
      id: 'org_1',
      name: 'Corp Workspace',
      slug: 'corp-workspace',
      ownerId: 'user_3',
      imageUrl: '/workspace_img_default.png',
    },
    {
      id: 'org_2',
      name: 'Cloud Ops Hub',
      slug: 'cloud-ops-hub',
      ownerId: 'user_3',
      imageUrl: '/workspace_img_default.png',
    },
  ];

  console.log('Creating workspaces...');
  await db.insert(schema.workspaces).values(workspacesData).onConflictDoNothing();

  // Create workspace members
  const workspaceMembersData = [
    { userId: 'user_1', workspaceId: 'org_1', role: 'ADMIN' as const },
    { userId: 'user_2', workspaceId: 'org_1', role: 'ADMIN' as const },
    { userId: 'user_3', workspaceId: 'org_1', role: 'ADMIN' as const },
    { userId: 'user_1', workspaceId: 'org_2', role: 'ADMIN' as const },
    { userId: 'user_2', workspaceId: 'org_2', role: 'ADMIN' as const },
    { userId: 'user_3', workspaceId: 'org_2', role: 'ADMIN' as const },
  ];

  console.log('Creating workspace members...');
  await db.insert(schema.workspaceMembers).values(workspaceMembersData).onConflictDoNothing();

  // Create projects
  const projectsData = [
    {
      id: '4d0f6ef3-e798-4d65-a864-00d9f8085c51',
      name: 'LaunchPad CRM',
      description: 'A next-gen CRM for startups to manage customer pipelines, analytics, and automation.',
      priority: 'HIGH' as const,
      status: 'ACTIVE' as const,
      startDate: new Date('2025-10-10T00:00:00.000Z'),
      endDate: new Date('2026-02-28T00:00:00.000Z'),
      teamLead: 'user_3',
      workspaceId: 'org_1',
      progress: 65,
    },
    {
      id: 'e5f0a667-e883-41c4-8c87-acb6494d6341',
      name: 'Brand Identity Overhaul',
      description: 'Rebranding client products with cohesive color palettes and typography systems.',
      priority: 'MEDIUM' as const,
      status: 'PLANNING' as const,
      startDate: new Date('2025-10-18T00:00:00.000Z'),
      endDate: new Date('2026-03-10T00:00:00.000Z'),
      teamLead: 'user_3',
      workspaceId: 'org_1',
      progress: 25,
    },
    {
      id: 'c45e93ec-2f68-4f07-af4b-aa84f1bd407c',
      name: 'Kubernetes Migration',
      description: 'Migrate the monolithic app infrastructure to Kubernetes for scalability.',
      priority: 'HIGH' as const,
      status: 'ACTIVE' as const,
      startDate: new Date('2025-10-15T00:00:00.000Z'),
      endDate: new Date('2026-01-20T00:00:00.000Z'),
      teamLead: 'user_3',
      workspaceId: 'org_2',
      progress: 0,
    },
    {
      id: 'b190343f-a7b1-4a40-b483-ecc59835cba3',
      name: 'Automated Regression Suite',
      description: 'Selenium + Playwright hybrid test framework for regression testing.',
      priority: 'MEDIUM' as const,
      status: 'ACTIVE' as const,
      startDate: new Date('2025-10-03T00:00:00.000Z'),
      endDate: new Date('2025-10-15T00:00:00.000Z'),
      teamLead: 'user_3',
      workspaceId: 'org_2',
      progress: 0,
    },
  ];

  console.log('Creating projects...');
  await db.insert(schema.projects).values(projectsData).onConflictDoNothing();

  // Create project members
  const projectMembersData = [
    { userId: 'user_1', projectId: '4d0f6ef3-e798-4d65-a864-00d9f8085c51' },
    { userId: 'user_2', projectId: '4d0f6ef3-e798-4d65-a864-00d9f8085c51' },
    { userId: 'user_3', projectId: '4d0f6ef3-e798-4d65-a864-00d9f8085c51' },
    { userId: 'user_1', projectId: 'e5f0a667-e883-41c4-8c87-acb6494d6341' },
    { userId: 'user_2', projectId: 'e5f0a667-e883-41c4-8c87-acb6494d6341' },
    { userId: 'user_3', projectId: 'e5f0a667-e883-41c4-8c87-acb6494d6341' },
    { userId: 'user_1', projectId: 'c45e93ec-2f68-4f07-af4b-aa84f1bd407c' },
    { userId: 'user_2', projectId: 'c45e93ec-2f68-4f07-af4b-aa84f1bd407c' },
    { userId: 'user_3', projectId: 'c45e93ec-2f68-4f07-af4b-aa84f1bd407c' },
    { userId: 'user_1', projectId: 'b190343f-a7b1-4a40-b483-ecc59835cba3' },
    { userId: 'user_2', projectId: 'b190343f-a7b1-4a40-b483-ecc59835cba3' },
    { userId: 'user_3', projectId: 'b190343f-a7b1-4a40-b483-ecc59835cba3' },
  ];

  console.log('Creating project members...');
  await db.insert(schema.projectMembers).values(projectMembersData).onConflictDoNothing();

  // Create tasks
  const tasksData = [
    // LaunchPad CRM tasks
    {
      id: '24ca6d74-7d32-41db-a257-906a90bca8f4',
      projectId: '4d0f6ef3-e798-4d65-a864-00d9f8085c51',
      title: 'Design Dashboard UI',
      description: 'Create a modern, responsive CRM dashboard layout.',
      status: 'IN_PROGRESS' as const,
      type: 'FEATURE' as const,
      priority: 'HIGH' as const,
      assigneeId: 'user_1',
      dueDate: new Date('2025-10-31T00:00:00.000Z'),
    },
    {
      id: '9dbd5f04-5a29-4232-9e8c-a1d8e4c566df',
      projectId: '4d0f6ef3-e798-4d65-a864-00d9f8085c51',
      title: 'Integrate Email API',
      description: 'Set up SendGrid integration for email campaigns.',
      status: 'TODO' as const,
      type: 'TASK' as const,
      priority: 'MEDIUM' as const,
      assigneeId: 'user_2',
      dueDate: new Date('2025-11-30T00:00:00.000Z'),
    },
    {
      id: '0e6798ad-8a1d-4bca-b0cd-8199491dbf03',
      projectId: '4d0f6ef3-e798-4d65-a864-00d9f8085c51',
      title: 'Fix Duplicate Contact Bug',
      description: 'Duplicate records appear when importing CSV files.',
      status: 'TODO' as const,
      type: 'BUG' as const,
      priority: 'HIGH' as const,
      assigneeId: 'user_1',
      dueDate: new Date('2025-12-05T00:00:00.000Z'),
    },
    {
      id: '7989b4cc-1234-4816-a1d9-cc86cd09596a',
      projectId: '4d0f6ef3-e798-4d65-a864-00d9f8085c51',
      title: 'Add Role-Based Access Control (RBAC)',
      description: 'Define user roles and permissions for the dashboard.',
      status: 'IN_PROGRESS' as const,
      type: 'IMPROVEMENT' as const,
      priority: 'MEDIUM' as const,
      assigneeId: 'user_2',
      dueDate: new Date('2025-12-20T00:00:00.000Z'),
    },
    // Brand Identity Overhaul tasks
    {
      id: 'a51bd102-6789-4e60-81ba-57768c63b7db',
      projectId: 'e5f0a667-e883-41c4-8c87-acb6494d6341',
      title: 'Create New Logo Concepts',
      description: 'Sketch and finalize 3 logo concepts for client review.',
      status: 'IN_PROGRESS' as const,
      type: 'FEATURE' as const,
      priority: 'MEDIUM' as const,
      assigneeId: 'user_2',
      dueDate: new Date('2025-10-31T00:00:00.000Z'),
    },
    {
      id: 'c7cafc09-5138-4918-9277-5ab94b520410',
      projectId: 'e5f0a667-e883-41c4-8c87-acb6494d6341',
      title: 'Update Typography System',
      description: 'Introduce new font hierarchy with responsive scaling.',
      status: 'TODO' as const,
      type: 'IMPROVEMENT' as const,
      priority: 'MEDIUM' as const,
      assigneeId: 'user_1',
      dueDate: new Date('2025-11-15T00:00:00.000Z'),
    },
    {
      id: '53883b41-1912-460e-8501-43363ff3f5d4',
      projectId: 'e5f0a667-e883-41c4-8c87-acb6494d6341',
      title: 'Client Feedback Integration',
      description: 'Implement client-requested adjustments to the brand guide.',
      status: 'TODO' as const,
      type: 'TASK' as const,
      priority: 'LOW' as const,
      assigneeId: 'user_2',
      dueDate: new Date('2025-10-31T00:00:00.000Z'),
    },
    // Kubernetes Migration tasks
    {
      id: 'fc8ac710-ad12-4508-b934-9d59dea01872',
      projectId: 'c45e93ec-2f68-4f07-af4b-aa84f1bd407c',
      title: 'Security Audit',
      description: 'Run container vulnerability scans and review IAM roles.',
      status: 'TODO' as const,
      type: 'OTHER' as const,
      priority: 'MEDIUM' as const,
      assigneeId: 'user_3',
      dueDate: new Date('2025-12-10T00:00:00.000Z'),
    },
    {
      id: '1cd6f85d-889a-4a5b-901f-ed8fa221d62b',
      projectId: 'c45e93ec-2f68-4f07-af4b-aa84f1bd407c',
      title: 'Set Up EKS Cluster',
      description: 'Provision EKS cluster on AWS and configure nodes.',
      status: 'TODO' as const,
      type: 'TASK' as const,
      priority: 'HIGH' as const,
      assigneeId: 'user_1',
      dueDate: new Date('2025-12-15T00:00:00.000Z'),
    },
    {
      id: '8125eeac-196d-4797-8b14-21260f46abcc',
      projectId: 'c45e93ec-2f68-4f07-af4b-aa84f1bd407c',
      title: 'Implement CI/CD with GitHub Actions',
      description: 'Add build, test, and deploy steps using GitHub Actions.',
      status: 'TODO' as const,
      type: 'TASK' as const,
      priority: 'MEDIUM' as const,
      assigneeId: 'user_2',
      dueDate: new Date('2025-10-31T00:00:00.000Z'),
    },
    // Automated Regression Suite tasks
    {
      id: '8836edf0-b4d7-4eec-a170-960d715a0b7f',
      projectId: 'b190343f-a7b1-4a40-b483-ecc59835cba3',
      title: 'Migrate to Playwright 1.48',
      description: 'Update scripts to use latest Playwright features.',
      status: 'IN_PROGRESS' as const,
      type: 'IMPROVEMENT' as const,
      priority: 'HIGH' as const,
      assigneeId: 'user_1',
      dueDate: new Date('2025-10-31T00:00:00.000Z'),
    },
    {
      id: 'ce3dc378-f959-42f4-b12b-4c6cae6195c9',
      projectId: 'b190343f-a7b1-4a40-b483-ecc59835cba3',
      title: 'Parallel Test Execution',
      description: 'Enable concurrent test runs across CI pipelines.',
      status: 'TODO' as const,
      type: 'TASK' as const,
      priority: 'MEDIUM' as const,
      assigneeId: 'user_2',
      dueDate: new Date('2025-11-28T00:00:00.000Z'),
    },
    {
      id: 'e01fda50-8818-4635-bcb6-9cde5c140b3d',
      projectId: 'b190343f-a7b1-4a40-b483-ecc59835cba3',
      title: 'Visual Snapshot Comparison',
      description: 'Implement screenshot diffing for UI regression detection.',
      status: 'TODO' as const,
      type: 'FEATURE' as const,
      priority: 'LOW' as const,
      assigneeId: 'user_1',
      dueDate: new Date('2025-11-20T00:00:00.000Z'),
    },
  ];

  console.log('Creating tasks...');
  await db.insert(schema.tasks).values(tasksData).onConflictDoNothing();

  console.log('✅ Seeding complete!');
};

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  });
