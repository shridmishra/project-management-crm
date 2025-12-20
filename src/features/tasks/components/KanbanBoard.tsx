"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTaskAsync } from "@/features/workspaces/store/workspaceSlice";
import type { AppDispatch } from "@/lib/store";
import { motion, Reorder } from "motion/react";
import { Bug, CalendarIcon, GitCommit, MessageSquare, Square, Zap, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const typeIcons: any = {
    BUG: { icon: Bug, color: "text-destructive" },
    FEATURE: { icon: Zap, color: "text-info" },
    TASK: { icon: Square, color: "text-success" },
    IMPROVEMENT: { icon: GitCommit, color: "text-primary" },
    OTHER: { icon: MessageSquare, color: "text-warning" },
};

const priorityVariants: any = {
    LOW: "secondary",
    MEDIUM: "default",
    HIGH: "destructive",
};

const columns = [
    { id: "TODO", title: "To Do" },
    { id: "IN_PROGRESS", title: "In Progress" },
    { id: "DONE", title: "Done" },
];

interface KanbanBoardProps {
    tasks: any[];
}

const KanbanBoard = ({ tasks }: KanbanBoardProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const handleDragEnd = async (taskId: string, newStatus: string) => {
        const task = tasks.find((t) => t.id === taskId);
        if (!task || task.status === newStatus) return;

        try {
            toast.loading("Updating status...");
            await dispatch(updateTaskAsync({
                id: taskId,
                status: newStatus,
                projectId: task.projectId,
            })).unwrap();
            toast.dismiss();
            toast.success("Task moved to " + newStatus.replace("_", " "));
        } catch (error: any) {
            toast.dismiss();
            toast.error(error?.message || "Failed to move task");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[500px]">
            {columns.map((column) => (
                <div
                    key={column.id}
                    className="flex flex-col gap-4 bg-muted/30 p-4 rounded-xl border border-border/50"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        const taskId = e.dataTransfer.getData("taskId");
                        handleDragEnd(taskId, column.id);
                    }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                                {column.title}
                            </h3>
                            <Badge variant="secondary" className="rounded-full h-5 px-1.5 min-w-[20px] flex items-center justify-center">
                                {tasks.filter(t => t.status === column.id).length}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 min-h-[200px]">
                        {tasks
                            .filter((t) => t.status === column.id)
                            .map((task) => (
                                <KanbanCard
                                    key={task.id}
                                    task={task}
                                    onClick={() => router.push(`/tasks/${task.id}`)}
                                />
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const KanbanCard = ({ task, onClick }: { task: any; onClick: () => void }) => {
    const { icon: Icon, color } = typeIcons[task.type] || {};

    return (
        <motion.div
            layoutId={task.id}
            draggable
            onDragStart={(e: any) => e.dataTransfer.setData("taskId", task.id)}
            className="group"
            whileHover={{ y: -2 }}
        >
            <Card
                className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow dark:bg-card/50"
                onClick={onClick}
            >
                <CardContent className="p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                            {Icon && <Icon className={`h-3.5 w-3.5 ${color}`} />}
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                                {task.type}
                            </span>
                        </div>
                        <Badge variant={priorityVariants[task.priority]} className="text-[10px] px-1.5 py-0 h-4">
                            {task.priority}
                        </Badge>
                    </div>

                    <h4 className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">
                        {task.title}
                    </h4>

                    {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                            {task.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                            <CalendarIcon className="h-3 w-3" />
                            {format(new Date(task.due_date), "MMM d")}
                        </div>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 border-2 border-background">
                                <AvatarImage src={task.assignee?.image} />
                                <AvatarFallback className="text-[10px]">
                                    {task.assignee?.name?.[0]}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default KanbanBoard;
