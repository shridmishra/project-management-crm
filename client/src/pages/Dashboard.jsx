import { Plus } from 'lucide-react'
import { useState } from 'react'
import StatsGrid from '../components/StatsGrid'
import ProjectOverview from '../components/ProjectOverview'
import RecentActivity from '../components/RecentActivity'
import TasksSummary from '../components/TasksSummary'
import CreateProjectDialog from '../components/CreateProjectDialog'
import { Button } from "@/components/ui/button"

const Dashboard = () => {

    const user = { fullName: 'User' }
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <div className='max-w-6xl mx-auto space-y-8'>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 ">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-1"> Welcome back, {user?.fullName || 'User'} </h1>
                    <p className="text-muted-foreground text-sm"> Here's what's happening with your projects today </p>
                </div>

                <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>

                <CreateProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
            </div>

            <StatsGrid />

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <ProjectOverview />
                    <RecentActivity />
                </div>
                <div>
                    <TasksSummary />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
