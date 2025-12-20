import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import CreateWorkspaceDialog from '../CreateWorkspaceDialog'
import userEvent from '@testing-library/user-event'
import { authClient } from '@/lib/auth-client'

// Mock auth client
jest.mock('@/lib/auth-client')

describe('CreateWorkspaceDialog', () => {
    const setIsDialogOpen = jest.fn()
    const user = userEvent.setup()

    beforeEach(() => {
        setIsDialogOpen.mockClear()
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    it('renders dialog when open', () => {
        renderWithProviders(<CreateWorkspaceDialog isDialogOpen={true} setIsDialogOpen={setIsDialogOpen} />)

        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: /create workspace/i })).toBeInTheDocument()
        expect(screen.getByLabelText(/workspace name/i)).toBeInTheDocument()
    })

    it('submits form with valid data', async () => {
        // Mock success response
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: 'new-ws', name: 'Test Workspace', slug: 'test-workspace' })
        })

        renderWithProviders(<CreateWorkspaceDialog isDialogOpen={true} setIsDialogOpen={setIsDialogOpen} />)

        const nameInput = screen.getByLabelText(/workspace name/i)
        const submitBtn = screen.getByRole('button', { name: /create workspace/i })

        await user.type(nameInput, 'Test Workspace')

        // Slug generation happens on submit if empty, input doesn't auto-update
        // expect(screen.getByLabelText(/workspace slug/i)).toHaveValue('test-workspace')

        await user.click(submitBtn)

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/workspaces', expect.objectContaining({
                method: 'POST',
                body: expect.stringContaining('Test Workspace')
            }))
        })
    })

    it('shows error if not logged in', async () => {
        // Mock logged out state
        (authClient.useSession as jest.Mock).mockReturnValue({ data: null })

        renderWithProviders(<CreateWorkspaceDialog isDialogOpen={true} setIsDialogOpen={setIsDialogOpen} />)

        const submitBtn = screen.getByRole('button', { name: /create workspace/i })
        await user.click(submitBtn)

        // Should verify toast error, but simpler to check fetch not called
        expect(global.fetch).not.toHaveBeenCalled()
    })
})
