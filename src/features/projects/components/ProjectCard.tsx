import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const getStatusClass = (status: any) => {
    switch (status) {
        case 'ACTIVE': return 'bg-success/15 text-success hover:bg-success/25 border-success/20';
        case 'ON_HOLD': return 'bg-warning/15 text-warning hover:bg-warning/25 border-warning/20';
        case 'COMPLETED': return 'bg-info/15 text-info hover:bg-info/25 border-info/20';
        case 'CANCELLED': return 'bg-destructive/15 text-destructive hover:bg-destructive/25 border-destructive/20';
        case 'PLANNING': return 'bg-muted text-muted-foreground hover:bg-muted/80 border-border';
        default: return '';
    }
}

const ProjectCard = ({ project }: any) => {
    return (
        <Link href={`/projects/${project.id}?tab=tasks`} className="block h-full">
            <Card className="hover:bg-accent/50 transition-colors duration-200 h-full flex flex-col">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-base font-semibold truncate leading-tight">
                            {project.name}
                        </CardTitle>
                        <Badge variant="outline" className={getStatusClass(project.status)}>
                            {project.status.replace("_", " ")}
                        </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 text-xs mt-1">
                        {project.description || "No description"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-3 flex-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span className="capitalize">{project.priority.toLowerCase()} priority</span>
                    </div>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 pt-0">
                    <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{project.progress || 0}%</span>
                    </div>
                    <Progress value={project.progress || 0} className="h-1.5" />
                </CardFooter>
            </Card>
        </Link>
    );
};

export default ProjectCard;
