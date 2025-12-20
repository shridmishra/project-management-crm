import { render, screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import ProjectDetailPage from './page'
import { useParams, useSearchParams } from 'next/navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useParams: jest.fn(),
    useSearchParams: jest.fn(() => ({
        get: jest.fn()
    })),
    useRouter: jest.fn(() => ({
        push: jest.fn()
    }))
}))

// Mock components
jest.mock('@/features/tasks/components/ProjectTasks', () => () => <div>ProjectTasks</div>)
jest.mock('@/features/tasks/components/KanbanBoard', () => () => <div>KanbanBoard</div>)
jest.mock('@/features/analytics/components/ProjectAnalytics', () => () => <div>ProjectAnalytics</div>)
jest.mock('@/features/projects/components/ProjectCalendar', () => () => <div>ProjectCalendar</div>)
jest.mock('@/features/projects/components/ProjectSettings', () => () => <div>ProjectSettings</div>)

describe('Project Detail Page', () => {
    const mockProject = {
        id: 'p1',
        name: 'Test Project',
        status: 'ACTIVE',
        members: [],
        tasks: [
            { id: 't1', status: 'TODO', title: 'Task 1' },
            { id: 't2', status: 'DONE', title: 'Task 2' }
        ]
    }

    const preloadedState = {
        workspace: {
            currentWorkspace: {
                id: 'ws-1',
                projects: [mockProject]
            },
            workspaces: [],
            loading: false,
            error: null
        }
    }

    beforeEach(() => {
        (useParams as jest.Mock).mockReturnValue({ projectId: 'p1' })
    })

    it('renders project details', async () => {
        renderWithProviders(<ProjectDetailPage />, { preloadedState })

        await waitFor(() => {
            expect(screen.getByText(/Test Project/i)).toBeInTheDocument()
            expect(screen.getByText(/active/i)).toBeInTheDocument()
        })

        // Check tabs
        expect(screen.getByText('Calendar')).toBeInTheDocument()

        // Check Stats
        expect(screen.getByText('Total Tasks')).toBeInTheDocument()
        expect(screen.getByText('2')).toBeInTheDocument() // Total tasks count
    })

    it('shows not found state if project id invalid', () => {
        (useParams as jest.Mock).mockReturnValue({ projectId: 'invalid' })

        renderWithProviders(<ProjectDetailPage />, { preloadedState })

        expect(screen.getByText('Project not found')).toBeInTheDocument()
    })
})
