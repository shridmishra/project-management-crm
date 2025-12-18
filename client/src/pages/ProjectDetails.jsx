import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeftIcon, PlusIcon, SettingsIcon, BarChart3Icon, CalendarIcon, FileStackIcon, ZapIcon } from "lucide-react";
import ProjectAnalytics from "../components/ProjectAnalytics";
import ProjectSettings from "../components/ProjectSettings";
import CreateTaskDialog from "../components/CreateTaskDialog";
import ProjectCalendar from "../components/ProjectCalendar";
import ProjectTasks from "../components/ProjectTasks";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProjectDetail() {

    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab');
    const id = searchParams.get('id');

    const navigate = useNavigate();
    const projects = useSelector((state) => state?.workspace?.currentWorkspace?.projects || []);

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [activeTab, setActiveTab] = useState(tab || "tasks");

    useEffect(() => {
        if (tab) setActiveTab(tab);
    }, [tab]);

    useEffect(() => {
        if (projects && projects.length > 0) {
            const proj = projects.find((p) => p.id === id);
            setProject(proj);
            setTasks(proj?.tasks || []);
        }
    }, [id, projects]);

    const statusVariants = {
        PLANNING: "secondary",
        ACTIVE: "default",
        ON_HOLD: "warning", // Assuming warning variant exists or fallback to secondary/default
        COMPLETED: "default", // Or success if available
        CANCELLED: "destructive",
    };

    // Fallback for variants if custom ones aren't defined in Badge
    const getBadgeVariant = (status) => {
        switch (status) {
            case 'PLANNING': return 'secondary';
            case 'ACTIVE': return 'default';
            case 'ON_HOLD': return 'secondary'; // 'warning' might not be standard
            case 'COMPLETED': return 'default';
            case 'CANCELLED': return 'destructive';
            default: return 'outline';
        }
    }

    if (!project) {
        return (
            <div className="p-6 text-center text-foreground">
                <p className="text-3xl md:text-5xl mt-40 mb-10">Project not found</p>
                <Button onClick={() => navigate('/projects')} variant="secondary">
                    Back to Projects
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto text-foreground">
            {/* Header */}
            <div className="flex max-md:flex-col gap-4 flex-wrap items-start justify-between max-w-6xl">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
                        <ArrowLeftIcon className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-medium">{project.name}</h1>
                        <Badge variant={getBadgeVariant(project.status)} className="capitalize">
                            {project.status.replace("_", " ")}
                        </Badge>
                    </div>
                </div>
                <Button onClick={() => setShowCreateTask(true)}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    New Task
                </Button>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total Tasks", value: tasks.length, iconColor: "text-foreground" },
                    { label: "Completed", value: tasks.filter((t) => t.status === "DONE").length, iconColor: "text-primary" },
                    { label: "In Progress", value: tasks.filter((t) => t.status === "IN_PROGRESS" || t.status === "TODO").length, iconColor: "text-secondary-foreground" },
                    { label: "Team Members", value: project.members?.length || 0, iconColor: "text-muted-foreground" },
                ].map((card, idx) => (
                    <Card key={idx}>
                        <CardContent className="p-4 flex justify-between items-center">
                            <div>
                                <div className="text-sm text-muted-foreground">{card.label}</div>
                                <div className="text-2xl font-bold">{card.value}</div>
                            </div>
                            <ZapIcon className={`h-4 w-4 ${card.iconColor}`} />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setSearchParams({ id: id, tab: val }) }} className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                    <TabsTrigger value="tasks" className="flex items-center gap-2">
                        <FileStackIcon className="h-3.5 w-3.5" /> Tasks
                    </TabsTrigger>
                    <TabsTrigger value="calendar" className="flex items-center gap-2">
                        <CalendarIcon className="h-3.5 w-3.5" /> Calendar
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="flex items-center gap-2">
                        <BarChart3Icon className="h-3.5 w-3.5" /> Analytics
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2">
                        <SettingsIcon className="h-3.5 w-3.5" /> Settings
                    </TabsTrigger>
                </TabsList>
                
                <div className="mt-6">
                    <TabsContent value="tasks">
                        <ProjectTasks tasks={tasks} />
                    </TabsContent>
                    <TabsContent value="analytics">
                        <ProjectAnalytics tasks={tasks} project={project} />
                    </TabsContent>
                    <TabsContent value="calendar">
                        <ProjectCalendar tasks={tasks} />
                    </TabsContent>
                    <TabsContent value="settings">
                        <ProjectSettings project={project} />
                    </TabsContent>
                </div>
            </Tabs>

            {/* Create Task Modal */}
            {showCreateTask && <CreateTaskDialog showCreateTask={showCreateTask} setShowCreateTask={setShowCreateTask} projectId={id} />}
        </div>
    );
}
