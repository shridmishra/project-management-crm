import { useEffect, useState } from "react";
import { GitCommit, MessageSquare, Clock, Bug, Zap, Square } from "lucide-react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const typeIcons = {
    BUG: { icon: Bug, color: "text-destructive" },
    FEATURE: { icon: Zap, color: "text-info" },
    TASK: { icon: Square, color: "text-success" },
    IMPROVEMENT: { icon: MessageSquare, color: "text-warning" },
    OTHER: { icon: GitCommit, color: "text-primary" },
};

const RecentActivity = () => {
    const [tasks, setTasks] = useState([]);
    const { currentWorkspace } = useSelector((state: any) => state.workspace);

    const getStatusVariant = (status) => {
        switch (status) {
            case 'TODO': return 'secondary';
            case 'IN_PROGRESS': return 'secondary';
            case 'DONE': return 'default';
            default: return 'outline';
        }
    };

    const getTasksFromCurrentWorkspace = () => {
        if (!currentWorkspace) return;
        const tasks = currentWorkspace.projects?.flatMap((project) => project.tasks?.map((task) => task) || []) || [];
        setTasks(tasks);
    };

    useEffect(() => {
        getTasksFromCurrentWorkspace();
    }, [currentWorkspace]);

    return (
        <Card className="overflow-hidden">
            <CardHeader className="border-b p-4">
                <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
                {tasks.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                            <Clock className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">No recent activity</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {tasks.map((task) => {
                            const TypeIcon = typeIcons[task.type]?.icon || Square;
                            const iconColor = typeIcons[task.type]?.color || "text-muted-foreground";

                            return (
                                <div key={task.id} className="p-6 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-muted rounded-lg">
                                            <TypeIcon className={`w-4 h-4 ${iconColor}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-medium truncate">
                                                    {task.title}
                                                </h4>
                                                <Badge variant={getStatusVariant(task.status)} className="ml-2">
                                                    {task.status.replace("_", " ")}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="capitalize">{task.type.toLowerCase()}</span>
                                                {task.assignee && (
                                                    <div className="flex items-center gap-1">
                                                        <Avatar className="h-4 w-4">
                                                            <AvatarImage src={task.assignee.image} alt={task.assignee.name} />
                                                            <AvatarFallback className="text-[10px]">
                                                                {task.assignee.name[0].toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        {task.assignee.name}
                                                    </div>
                                                )}
                                                <span>
                                                    {format(new Date(task.updatedAt), "MMM d, h:mm a")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default RecentActivity;
