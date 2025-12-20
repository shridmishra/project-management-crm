import { useEffect, useState } from "react";
import { ArrowRight, Clock, AlertTriangle, User } from "lucide-react";
import { useSelector } from "react-redux";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { useSession } from "@/lib/auth-client";

export default function TasksSummary() {

    const { currentWorkspace } = useSelector((state: any) => state.workspace);
    const { data: session } = useSession();
    const user = session?.user;
    const [tasks, setTasks] = useState([]);

    // Get all tasks for all projects in current workspace
    useEffect(() => {
        if (currentWorkspace) {
            setTasks(currentWorkspace.projects?.flatMap((project) => project.tasks || []) || []);
        }
    }, [currentWorkspace]);

    const myTasks = user ? tasks.filter(i => i.assigneeId === user.id) : [];
    const overdueTasks = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'DONE');
    const inProgressIssues = tasks.filter(i => i.status === 'IN_PROGRESS');

    const summaryCards = [
        {
            title: "My Tasks",
            count: myTasks.length,
            icon: User,
            variant: "default" as const,
            items: myTasks.slice(0, 3)
        },
        {
            title: "Overdue",
            count: overdueTasks.length,
            icon: AlertTriangle,
            variant: "destructive" as const,
            items: overdueTasks.slice(0, 3)
        },
        {
            title: "In Progress",
            count: inProgressIssues.length,
            icon: Clock,
            variant: "secondary" as const,
            items: inProgressIssues.slice(0, 3)
        }
    ];

    return (
        <div className="space-y-6">
            {summaryCards.map((card) => (
                <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-muted rounded-lg">
                                <card.icon className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <CardTitle className="text-sm font-medium">
                                {card.title}
                            </CardTitle>
                        </div>
                        <Badge variant={card.variant}>
                            {card.count}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        {card.items.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No {card.title.toLowerCase()}
                            </p>
                        ) : (
                            <div className="space-y-3 pt-2">
                                {card.items.map((issue) => (
                                    <div key={issue.id} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                                        <h4 className="text-sm font-medium truncate mb-1">
                                            {issue.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground capitalize">
                                            {issue.type} • {issue.priority} priority
                                        </p>
                                    </div>
                                ))}
                                {card.count > 3 && (
                                    <Button variant="ghost" className="w-full text-xs h-8 mt-2">
                                        View {card.count - 3} more <ArrowRight className="w-3 h-3 ml-2" />
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
