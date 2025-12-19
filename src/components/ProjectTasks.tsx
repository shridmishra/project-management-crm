"use client";

import { format } from "date-fns";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { updateTaskAsync, deleteTaskAsync } from "../features/workspaceSlice";
import type { AppDispatch } from "@/lib/store";
import { Bug, CalendarIcon, GitCommit, MessageSquare, Square, Trash, XIcon, Zap } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const typeIcons = {
    BUG: { icon: Bug, color: "text-destructive" },
    FEATURE: { icon: Zap, color: "text-info" },
    TASK: { icon: Square, color: "text-success" },
    IMPROVEMENT: { icon: GitCommit, color: "text-primary" },
    OTHER: { icon: MessageSquare, color: "text-warning" },
};

const priorityVariants = {
    LOW: "secondary",
    MEDIUM: "default",
    HIGH: "destructive",
};

const ProjectTasks = ({ tasks }) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [selectedTasks, setSelectedTasks] = useState([]);

    const [filters, setFilters] = useState({
        status: "",
        type: "",
        priority: "",
        assignee: "",
    });

    const assigneeList = useMemo(
        () => Array.from(new Set(tasks.map((t) => t.assignee?.name).filter(Boolean))),
        [tasks]
    );

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const { status, type, priority, assignee } = filters;
            return (
                (!status || task.status === status) &&
                (!type || task.type === type) &&
                (!priority || task.priority === priority) &&
                (!assignee || task.assignee?.name === assignee)
            );
        });
    }, [filters, tasks]);

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value === "ALL" ? "" : value }));
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const task = tasks.find((t) => t.id === taskId);
            if (!task) return;

            toast.loading("Updating status...");
            await dispatch(updateTaskAsync({
                id: taskId,
                status: newStatus,
                projectId: task.projectId,
            })).unwrap();

            toast.dismiss();
            toast.success("Task status updated successfully");
        } catch (error: any) {
            toast.dismiss();
            toast.error(error?.message || "Failed to update task");
        }
    };

    const handleDelete = async () => {
        try {
            const confirm = window.confirm("Are you sure you want to delete the selected tasks?");
            if (!confirm) return;

            toast.loading("Deleting tasks...");

            // Delete tasks one by one
            for (const taskId of selectedTasks) {
                const task = tasks.find((t) => t.id === taskId);
                if (task) {
                    await dispatch(deleteTaskAsync({
                        taskId,
                        projectId: task.projectId,
                    })).unwrap();
                }
            }

            toast.dismiss();
            toast.success("Tasks deleted successfully");
            setSelectedTasks([]);
        } catch (error: any) {
            toast.dismiss();
            toast.error(error?.message || "Failed to delete tasks");
        }
    };

    const toggleSelectAll = () => {
        if (selectedTasks.length === tasks.length) {
            setSelectedTasks([]);
        } else {
            setSelectedTasks(tasks.map((t) => t.id));
        }
    };

    const toggleSelectTask = (taskId) => {
        if (selectedTasks.includes(taskId)) {
            setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
        } else {
            setSelectedTasks([...selectedTasks, taskId]);
        }
    };

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                <Select value={filters.status || "ALL"} onValueChange={(val) => handleFilterChange("status", val)}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Statuses</SelectItem>
                        <SelectItem value="TODO">To Do</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="DONE">Done</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filters.type || "ALL"} onValueChange={(val) => handleFilterChange("type", val)}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Types</SelectItem>
                        <SelectItem value="TASK">Task</SelectItem>
                        <SelectItem value="BUG">Bug</SelectItem>
                        <SelectItem value="FEATURE">Feature</SelectItem>
                        <SelectItem value="IMPROVEMENT">Improvement</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filters.priority || "ALL"} onValueChange={(val) => handleFilterChange("priority", val)}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Priorities</SelectItem>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filters.assignee || "ALL"} onValueChange={(val) => handleFilterChange("assignee", val)}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="All Assignees" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Assignees</SelectItem>
                        {assigneeList.map((n) => (
                            <SelectItem key={String(n)} value={String(n)}>{String(n)}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Reset filters */}
                {(filters.status || filters.type || filters.priority || filters.assignee) && (
                    <Button variant="ghost" onClick={() => setFilters({ status: "", type: "", priority: "", assignee: "" })}>
                        <XIcon className="mr-2 h-4 w-4" /> Reset
                    </Button>
                )}

                {selectedTasks.length > 0 && (
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash className="mr-2 h-4 w-4" /> Delete
                    </Button>
                )}
            </div>

            {/* Tasks Table */}
            <div className="rounded-md border">
                <div className="hidden lg:block">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={tasks.length > 0 && selectedTasks.length === tasks.length}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Assignee</TableHead>
                                <TableHead>Due Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTasks.length > 0 ? (
                                filteredTasks.map((task) => {
                                    const { icon: Icon, color } = typeIcons[task.type] || {};

                                    return (
                                        <TableRow
                                            key={task.id}
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => router.push(`/taskDetails?projectId=${task.projectId}&taskId=${task.id}`)}
                                        >
                                            <TableCell onClick={(e) => e.stopPropagation()}>
                                                <Checkbox
                                                    checked={selectedTasks.includes(task.id)}
                                                    onCheckedChange={() => toggleSelectTask(task.id)}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{task.title}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {Icon && <Icon className={`h-4 w-4 ${color}`} />}
                                                    <span className="text-xs font-medium">{task.type}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={priorityVariants[task.priority]}>
                                                    {task.priority}
                                                </Badge>
                                            </TableCell>
                                            <TableCell onClick={(e) => e.stopPropagation()}>
                                                <Select
                                                    value={task.status}
                                                    onValueChange={(val) => handleStatusChange(task.id, val)}
                                                >
                                                    <SelectTrigger className="h-8 w-[130px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="TODO">To Do</SelectItem>
                                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                        <SelectItem value="DONE">Done</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={task.assignee?.image} />
                                                        <AvatarFallback>{task.assignee?.name?.[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm">{task.assignee?.name || "-"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <CalendarIcon className="h-4 w-4" />
                                                    {format(new Date(task.due_date), "dd MMM")}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        No tasks found for the selected filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile/Card View */}
                <div className="lg:hidden flex flex-col gap-4 p-4">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => {
                            const { icon: Icon, color } = typeIcons[task.type] || {};

                            return (
                                <Card key={task.id}>
                                    <CardContent className="p-4 flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold">{task.title}</h3>
                                            <Checkbox
                                                checked={selectedTasks.includes(task.id)}
                                                onCheckedChange={() => toggleSelectTask(task.id)}
                                            />
                                        </div>

                                        <div className="flex items-center gap-2 text-sm">
                                            {Icon && <Icon className={`h-4 w-4 ${color}`} />}
                                            <span className="font-medium">{task.type}</span>
                                        </div>

                                        <div>
                                            <Badge variant={priorityVariants[task.priority]}>
                                                {task.priority}
                                            </Badge>
                                        </div>

                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                                            <Select
                                                value={task.status}
                                                onValueChange={(val) => handleStatusChange(task.id, val)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="TODO">To Do</SelectItem>
                                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                    <SelectItem value="DONE">Done</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={task.assignee?.image} />
                                                <AvatarFallback>{task.assignee?.name?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <span>{task.assignee?.name || "-"}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <CalendarIcon className="h-4 w-4" />
                                            {format(new Date(task.due_date), "dd MMMM")}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <p className="text-center text-muted-foreground py-4">
                            No tasks found for the selected filters.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectTasks;
