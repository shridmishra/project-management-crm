import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import CreateProjectDialog from '../CreateProjectDialog'
import userEvent from '@testing-library/user-event'

// Mock toast to avoid errors or just check behavior
jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}))

describe('CreateProjectDialog', () => {
    const setIsDialogOpen = jest.fn()
    const user = userEvent.setup()

    const mockWorkspace = {
        id: 'ws-1',
        name: 'Test Workspace',
        members: [
            { user: { id: 'u1', email: 'user1@example.com' } },
            { user: { id: 'u2', email: 'user2@example.com' } }
        ]
    }

    beforeEach(() => {
        setIsDialogOpen.mockClear()
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    it('renders dialog when open', () => {
        renderWithProviders(<CreateProjectDialog isDialogOpen={true} setIsDialogOpen={setIsDialogOpen} />, {
            preloadedState: {
                workspace: {
                    currentWorkspace: mockWorkspace,
                    workspaces: [mockWorkspace],
                    loading: false,
                    error: null
                }
            }
        })

        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByText(/Create New Project/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/project name/i)).toBeInTheDocument()
    })

    it('submits form with valid data', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: 'new-proj', name: 'New Project' })
        })

        renderWithProviders(<CreateProjectDialog isDialogOpen={true} setIsDialogOpen={setIsDialogOpen} />, {
            preloadedState: {
                workspace: {
                    currentWorkspace: mockWorkspace,
                    workspaces: [mockWorkspace],
                    loading: false,
                    error: null
                }
            }
        })

        await user.type(screen.getByLabelText(/project name/i), 'New Project')

        // Select status - using getAllByRole to find the trigger
        // The trigger usually has role 'combobox' or 'button' in shadcn select
        // Wait, getting by label works for input, but Select trigger doesn't always associate with label easily in tests without "for".
        // Let's just create the project with default values for select

        const submitBtn = screen.getByRole('button', { name: /create project/i })
        await user.click(submitBtn)

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/projects', expect.objectContaining({
                method: 'POST',
                body: expect.stringContaining('New Project')
            }))
        })
    })
})
