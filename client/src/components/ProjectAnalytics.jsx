import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { CheckCircle, Clock, AlertTriangle, Users, ArrowRightIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Colors for charts and priorities
const COLORS = ["var(--info)", "var(--success)", "var(--warning)", "var(--destructive)", "var(--primary)"];
const PRIORITY_COLORS = {
    LOW: "bg-destructive",
    MEDIUM: "bg-info",
    HIGH: "bg-success",
};

const ProjectAnalytics = ({ project, tasks }) => {
    const { stats, statusData, typeData, priorityData } = useMemo(() => {
        const now = new Date();
        const total = tasks.length;

        const stats = {
            total,
            completed: 0,
            inProgress: 0,
            todo: 0,
            overdue: 0,
        };

        const statusMap = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
        const typeMap = { TASK: 0, BUG: 0, FEATURE: 0, IMPROVEMENT: 0, OTHER: 0 };
        const priorityMap = { LOW: 0, MEDIUM: 0, HIGH: 0 };

        tasks.forEach((t) => {
            if (t.status === "DONE") stats.completed++;
            if (t.status === "IN_PROGRESS") stats.inProgress++;
            if (t.status === "TODO") stats.todo++;
            if (new Date(t.due_date) < now && t.status !== "DONE") stats.overdue++;

            if (statusMap[t.status] !== undefined) statusMap[t.status]++;
            if (typeMap[t.type] !== undefined) typeMap[t.type]++;
            if (priorityMap[t.priority] !== undefined) priorityMap[t.priority]++;
        });

        return {
            stats,
            statusData: Object.entries(statusMap).map(([k, v]) => ({ name: k.replace("_", " "), value: v })),
            typeData: Object.entries(typeMap).filter(([_, v]) => v > 0).map(([k, v]) => ({ name: k, value: v })),
            priorityData: Object.entries(priorityMap).map(([k, v]) => ({
                name: k,
                value: v,
                percentage: total > 0 ? Math.round((v / total) * 100) : 0,
            })),
        };
    }, [tasks]);

    const completionRate = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

    const metrics = [
        {
            label: "Completion Rate",
            value: `${completionRate}%`,
            color: "text-success",
            icon: <CheckCircle className="size-5 text-success" />,
            bg: "bg-success/20",
        },
        {
            label: "Active Tasks",
            value: stats.inProgress,
            color: "text-info",
            icon: <Clock className="size-5 text-info" />,
            bg: "bg-info/20",
        },
        {
            label: "Overdue Tasks",
            value: stats.overdue,
            color: "text-destructive",
            icon: <AlertTriangle className="size-5 text-destructive" />,
            bg: "bg-destructive/20",
        },
        {
            label: "Team Size",
            value: project?.members?.length || 0,
            color: "text-primary",
            icon: <Users className="size-5 text-primary" />,
            bg: "bg-primary/20",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{m.label}</p>
                                    <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                                </div>
                                <div className={`p-2 rounded-md ${m.bg}`}>{m.icon}</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Tasks by Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tasks by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={statusData}>
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                                    axisLine={{ stroke: "var(--border)" }}
                                />
                                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={{ stroke: "var(--border)" }} />
                                <Bar dataKey="value" fill="var(--info)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Tasks by Type */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tasks by Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={typeData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {typeData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Priority Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Tasks by Priority</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {priorityData.map((p) => (
                            <div key={p.name} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <ArrowRightIcon className="size-3.5 text-muted-foreground" />
                                        <span className="capitalize font-medium">{p.name.toLowerCase()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">{p.value} tasks</span>
                                        <span className="px-2 py-0.5 border rounded text-xs text-muted-foreground">
                                            {p.percentage}%
                                        </span>
                                    </div>
                                </div>
                                <Progress value={p.percentage} className="h-1.5" indicatorClassName={PRIORITY_COLORS[p.name]} />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProjectAnalytics;
