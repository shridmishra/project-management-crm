import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, UsersIcon, FolderOpen } from "lucide-react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import CreateProjectDialog from "./CreateProjectDialog";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const ProjectOverview = () => {
    const getStatusVariant = (status) => {
        switch (status) {
            case 'PLANNING': return 'secondary';
            case 'ACTIVE': return 'default';
            case 'ON_HOLD': return 'secondary';
            case 'COMPLETED': return 'default';
            case 'CANCELLED': return 'destructive';
            default: return 'outline';
        }
    };

    const currentWorkspace = useSelector((state: any) => state?.workspace?.currentWorkspace || null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        setProjects(currentWorkspace?.projects || []);
    }, [currentWorkspace]);

    return currentWorkspace && (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b p-4">
                <CardTitle className="text-md font-medium">Project Overview</CardTitle>
                <Link href={'/projects'}>
                    <Button variant="link" className="text-sm h-auto p-0">
                        View all <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
            </CardHeader>

            <CardContent className="p-0">
                {projects.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                            <FolderOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">No projects yet</p>
                        <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
                            Create your First Project
                        </Button>
                        <CreateProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
                    </div>
                ) : (
                    <div className="divide-y">
                        {projects.slice(0, 5).map((project) => (
                            <Link key={project.id} href={`/projectsDetail?id=${project.id}&tab=tasks`} className="block p-6 hover:bg-accent/50 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 mr-4">
                                        <h3 className="font-semibold mb-1">
                                            {project.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {project.description || 'No description'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={getStatusVariant(project.status)}>
                                            {project.status.replace('_', ' ').replaceAll(/\b\w/g, c => c.toUpperCase())}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                                    <div className="flex items-center gap-4">
                                        {project.members?.length > 0 && (
                                            <div className="flex items-center gap-1">
                                                <UsersIcon className="w-3 h-3" />
                                                {project.members.length} members
                                            </div>
                                        )}
                                        {project.end_date && (
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {format(new Date(project.end_date), "MMM d, yyyy")}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span className="text-muted-foreground">{project.progress || 0}%</span>
                                    </div>
                                    <Progress value={project.progress || 0} className="h-1.5" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default ProjectOverview;
