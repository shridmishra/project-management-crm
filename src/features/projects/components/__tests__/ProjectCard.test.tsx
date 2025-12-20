import { render, screen } from '@testing-library/react'
import ProjectCard from '../ProjectCard'

describe('ProjectCard', () => {
    const mockProject = {
        id: '123',
        name: 'Test Project',
        description: 'Test Description',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        progress: 50
    }

    it('renders project info', () => {
        render(<ProjectCard project={mockProject} />)

        expect(screen.getByText('Test Project')).toBeInTheDocument()
        expect(screen.getByText('Test Description')).toBeInTheDocument()
        expect(screen.getByText('high priority')).toBeInTheDocument()
        expect(screen.getByText('50%')).toBeInTheDocument()
    })

    it('renders empty description correctly', () => {
        const projectNoDesc = { ...mockProject, description: '' }
        render(<ProjectCard project={projectNoDesc} />)
        expect(screen.getByText('No description')).toBeInTheDocument()
    })
})
