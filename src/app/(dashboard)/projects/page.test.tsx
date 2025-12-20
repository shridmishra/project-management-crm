import { render, screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import ProjectsPage from './page'

// Mock dependencies
jest.mock('@/features/projects/components/ProjectCard', () => ({ project }: any) => <div data-testid="project-card">{project.name}</div>)
jest.mock('@/features/projects/components/CreateProjectDialog', () => () => <div data-testid="create-dialog">CreateProjectDialog</div>)

describe('Projects Page', () => {
    const mockProjects = [
        { id: '1', name: 'Alpha Project', status: 'ACTIVE', priority: 'HIGH' },
        { id: '2', name: 'Beta Project', status: 'PLANNING', priority: 'LOW' }
    ]

    const preloadedState = {
        workspace: {
            currentWorkspace: {
                id: 'ws-1',
                projects: mockProjects
            },
            workspaces: [],
        }
    }

    it('renders project list', () => {
        renderWithProviders(<ProjectsPage />, { preloadedState })

        expect(screen.getByText('Alpha Project')).toBeInTheDocument()
        expect(screen.getByText('Beta Project')).toBeInTheDocument()
    })

    it('filters projects by search', () => {
        renderWithProviders(<ProjectsPage />, { preloadedState })

        const searchInput = screen.getByPlaceholderText(/search projects/i)
        fireEvent.change(searchInput, { target: { value: 'Alpha' } })

        expect(screen.getByText('Alpha Project')).toBeInTheDocument()
        expect(screen.queryByText('Beta Project')).not.toBeInTheDocument()
    })

    it('shows empty state when no projects match', () => {
        renderWithProviders(<ProjectsPage />, { preloadedState })

        const searchInput = screen.getByPlaceholderText(/search projects/i)
        fireEvent.change(searchInput, { target: { value: 'Omega' } })

        expect(screen.getByText(/no projects found/i)).toBeInTheDocument()
        expect(screen.queryByText('Alpha Project')).not.toBeInTheDocument()
    })
})
