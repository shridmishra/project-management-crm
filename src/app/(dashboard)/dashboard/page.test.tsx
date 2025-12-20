import { render, screen } from '@testing-library/react'
import Dashboard from './page'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import workspaceReducer from '@/features/workspaces/store/workspaceSlice'
import themeReducer from '@/features/theme/store/themeSlice'

// Mock components that might cause issues or are not focus of this test
jest.mock('@/features/analytics/components/StatsGrid', () => () => <div data-testid="stats-grid">StatsGrid</div>)
jest.mock('@/features/projects/components/ProjectOverview', () => () => <div data-testid="project-overview">ProjectOverview</div>)
jest.mock('@/features/activity/components/RecentActivity', () => () => <div data-testid="recent-activity">RecentActivity</div>)
jest.mock('@/features/tasks/components/TasksSummary', () => () => <div data-testid="tasks-summary">TasksSummary</div>)
jest.mock('@/features/projects/components/CreateProjectDialog', () => () => <div data-testid="create-project-dialog">CreateProjectDialog</div>)

// Create a render helper with Redux 
const renderWithRedux = (
    component: React.ReactElement,
    {
        preloadedState = {},
        store = configureStore({
            reducer: {
                workspace: workspaceReducer,
                theme: themeReducer,
            },
            preloadedState,
        }),
    } = {}
) => {
    return {
        ...render(<Provider store={store}>{component}</Provider>),
        store,
    }
}

describe('Dashboard Page', () => {
    it('renders dashboard content', () => {
        renderWithRedux(<Dashboard />)

        expect(screen.getByText(/Welcome back/i)).toBeInTheDocument()
        expect(screen.getByText('New Project')).toBeInTheDocument()
        expect(screen.getByTestId('stats-grid')).toBeInTheDocument()
        expect(screen.getByTestId('project-overview')).toBeInTheDocument()
    })
})
