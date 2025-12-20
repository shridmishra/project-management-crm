import { FolderOpen, CheckCircle, Users, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";

export default function StatsGrid() {
    const currentWorkspace = useSelector(
        (state: any) => state?.workspace?.currentWorkspace || null
    );

    const [stats, setStats] = useState({
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        myTasks: 0,
        overdueIssues: 0,
    });

    const statCards = [
        {
            icon: FolderOpen,
            title: "Total Projects",
            value: stats.totalProjects,
            subtitle: `projects in ${currentWorkspace?.name}`,
            bgColor: "bg-info/10",
            textColor: "text-info",
        },
        {
            icon: CheckCircle,
            title: "Completed Projects",
            value: stats.completedProjects,
            subtitle: `of ${stats.totalProjects} total`,
            bgColor: "bg-success/10",
            textColor: "text-success",
        },
        {
            icon: Users,
            title: "My Tasks",
            value: stats.myTasks,
            subtitle: "assigned to me",
            bgColor: "bg-primary/10",
            textColor: "text-primary",
        },
        {
            icon: AlertTriangle,
            title: "Overdue",
            value: stats.overdueIssues,
            subtitle: "need attention",
            bgColor: "bg-warning/10",
            textColor: "text-warning",
        },
    ];

    useEffect(() => {
        if (currentWorkspace) {
            const projects = currentWorkspace.projects || [];
            setStats({
                totalProjects: projects.length,
                activeProjects: projects.filter(
                    (p: any) => p.status !== "CANCELLED" && p.status !== "COMPLETED"
                ).length,
                completedProjects: projects
                    .filter((p: any) => p.status === "COMPLETED")
                    .reduce((acc: number, project: any) => acc + (project.tasks?.length || 0), 0),
                myTasks: projects.reduce(
                    (acc: number, project: any) =>
                        acc +
                        (project.tasks?.filter(
                            (t: any) => t.assignee?.email === currentWorkspace.owner?.email
                        ) || []).length,
                    0
                ),
                overdueIssues: projects.reduce(
                    (acc: number, project: any) =>
                        acc + (project.tasks?.filter((t: any) => t.due_date && new Date(t.due_date) < new Date()).length || 0),
                    0
                ),
            });
        }
    }, [currentWorkspace]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-9">
            {statCards.map(
                ({ icon: Icon, title, value, subtitle, bgColor, textColor }, i) => (
                    <Card key={i} className="hover:bg-accent/50 transition-colors duration-200">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">
                                        {title}
                                    </p>
                                    <h3 className="text-2xl font-bold">
                                        {value}
                                    </h3>
                                    {subtitle && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {subtitle}
                                        </p>
                                    )}
                                </div>
                                <div className={`p-2 rounded-lg ${bgColor}`}>
                                    <Icon className={`h-5 w-5 ${textColor}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            )}
        </div>
    );
}
