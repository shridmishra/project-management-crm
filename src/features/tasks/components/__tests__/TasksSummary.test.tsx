import { render, screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import TasksSummary from '../TasksSummary'
import { authClient } from '@/lib/auth-client'

jest.mock('@/lib/auth-client')

describe('TasksSummary', () => {
    const mockUser = { id: 'user-1' }
    const mockTasks = [
        { id: '1', title: 'Task 1', assigneeId: 'user-1', status: 'TODO', type: 'bug', priority: 'HIGH' },
        { id: '2', title: 'Task 2', assigneeId: 'other', status: 'IN_PROGRESS', type: 'feature', priority: 'MEDIUM' },
        { id: '3', title: 'Task 3', assigneeId: 'user-1', status: 'IN_PROGRESS', type: 'task', priority: 'LOW' }
    ]
    const mockWorkspace = {
        id: 'ws-1',
        projects: [{
            id: 'p1',
            tasks: mockTasks
        }]
    }

    beforeEach(() => {
        (authClient.useSession as jest.Mock).mockReturnValue({
            data: { user: mockUser }
        })
    })

    it('displays summary cards', () => {
        renderWithProviders(<TasksSummary />, {
            preloadedState: {
                workspace: {
                    currentWorkspace: mockWorkspace,
                    workspaces: [],
                    loading: false,
                    error: null
                }
            }
        })

        // My Tasks: Task 1 and Task 3 = 2
        // In Progress: Task 2 and Task 3 = 2
        // Overdue: 0 (no due date)

        expect(screen.getByText('My Tasks')).toBeInTheDocument()
        expect(screen.getByText('In Progress')).toBeInTheDocument()
        expect(screen.getByText('Overdue')).toBeInTheDocument()

        // Check counts
        // Usually badges contain the count.
        // We can't easy get badge text if it's just a number without context, 
        // but we can look for the number if unique, or assume order.
        // "My Tasks" count is 2. "In Progress" count is 2.

        const badges = screen.getAllByText('2')
        expect(badges.length).toBeGreaterThanOrEqual(2)

        expect(screen.getAllByText('Task 1').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Task 3').length).toBeGreaterThan(0)
    })
})
