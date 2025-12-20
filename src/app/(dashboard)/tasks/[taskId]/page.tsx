
"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { CalendarIcon, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useSession } from "@/lib/auth-client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useDispatch } from "react-redux";
import { updateTaskAsync } from "@/features/workspaces/store/workspaceSlice";
import { AppDispatch } from "@/lib/store";
import TaskAttachments from "@/features/tasks/components/TaskAttachments";

function TaskDetailsContent() {
    const params = useParams();
    const taskId = params?.taskId as string;
    const dispatch = useDispatch<AppDispatch>();

    const { data: session } = useSession();
    const user = session?.user;

    const [task, setTask] = useState<any>(null);
    const [project, setProject] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);

    const { currentWorkspace } = useSelector((state: any) => state.workspace);

    const fetchComments = async () => {
        if (!taskId) return;
        try {
            const response = await fetch(`/api/comments?taskId=${taskId}`);
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        }
    };

    const fetchTaskDetails = async () => {
        setLoading(true);
        if (!taskId) return;

        const projects = currentWorkspace?.projects || [];
        let tsk = null;
        let foundProj = null;

        for (const p of projects) {
            const t = p.tasks?.find((t: any) => t.id === taskId);
            if (t) {
                tsk = t;
                foundProj = p;
                break;
            }
        }

        if (!tsk) {
            setLoading(false);
            return;
        }

        setTask(tsk);
        setProject(foundProj);
        setLoading(false);
    };

    const handleUpdateTask = async (data: any) => {
        try {
            toast.loading("Updating task...");
            await dispatch(updateTaskAsync({ id: taskId, projectId: task.projectId, ...data })).unwrap();
            setTask((prev: any) => ({ ...prev, ...data }));
            toast.dismiss();
            toast.success("Task updated.");
        } catch (error: any) {
            toast.dismiss();
            toast.error(error?.message || "Failed to update task");
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            toast.loading("Adding comment...");

            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    taskId,
                    userId: user?.id,
                    content: newComment,
                }),
            });

            if (!response.ok) throw new Error("Failed to add comment");

            const data = await response.json();
            setComments((prev) => [...prev, data]);
            setNewComment("");
            toast.dismiss();
            toast.success("Comment added.");
        } catch (error: any) {
            toast.dismiss();
            toast.error(error?.message || "Failed to add comment");
            console.error(error);
        }
    };

    useEffect(() => { fetchTaskDetails(); }, [taskId]);

    useEffect(() => {
        if (taskId && task) {
            fetchComments();
            const interval = setInterval(() => { fetchComments(); }, 10000);
            return () => clearInterval(interval);
        }
    }, [taskId, task]);

    if (loading) return <div className="text-muted-foreground px-4 py-6">Loading task details...</div>;
    if (!task) return <div className="text-destructive px-4 py-6">Task not found.</div>;

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-6 sm:p-4 text-foreground max-w-6xl mx-auto py-8 px-6">
            {/* Left: Comments / Chatbox */}
            <div className="w-full lg:w-2/3">
                <Card className="flex flex-col lg:h-[80vh]">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" /> Task Discussion ({comments.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto no-scrollbar pr-2 -mr-2">
                            {comments.length > 0 ? (
                                <div className="flex flex-col gap-4 mb-6">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className={`max-w-[90%] p-4 rounded-xl border ${comment.user.id === user?.id ? "ml-auto bg-primary/5 border-primary/20" : "mr-auto bg-card border-border shadow-sm"}`} >
                                            <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                                                <Avatar className="h-6 w-6 border">
                                                    <AvatarImage src={comment.user.image} />
                                                    <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-semibold text-foreground">{comment.user.name}</span>
                                                <span>
                                                    {format(new Date(comment.createdAt), "dd MMM, HH:mm")}
                                                </span>
                                            </div>
                                            <p className="text-sm leading-relaxed">{comment.content}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground mb-4 text-sm">No comments yet. Be the first!</p>
                            )}
                        </div>

                        {/* Add Comment */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 mt-4 pt-4 border-t">
                            <Textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full resize-none"
                                rows={3}
                            />
                            <Button onClick={handleAddComment}>
                                Post
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right: Task + Project Info */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
                {/* Task Info */}
                <Card>
                    <CardContent className="p-5">
                        <div className="mb-4">
                            <h1 className="text-xl font-bold mb-3">{task.title}</h1>
                            <div className="flex flex-wrap gap-3">
                                <Select value={task.status} onValueChange={(val) => handleUpdateTask({ status: val })}>
                                    <SelectTrigger className="h-8 w-fit min-w-[110px] bg-muted/50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TODO">To Do</SelectItem>
                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="DONE">Done</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={task.priority} onValueChange={(val) => handleUpdateTask({ priority: val })}>
                                    <SelectTrigger className={`h-8 w-fit min-w-[100px] bg-muted/50 ${task.priority === 'HIGH' ? 'text-destructive' : ''}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LOW">Low</SelectItem>
                                        <SelectItem value="MEDIUM">Medium</SelectItem>
                                        <SelectItem value="HIGH">High</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Badge variant="outline" className="h-8 px-3">
                                    {task.type}
                                </Badge>
                            </div>
                        </div>

                        {task.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{task.description}</p>
                        )}

                        <Separator className="my-3" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4">
                            <div className="space-y-1.5">
                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Assignee</span>
                                {project?.members ? (
                                    <Select
                                        value={task.assigneeId}
                                        onValueChange={(val) => handleUpdateTask({ assigneeId: val })}
                                    >
                                        <SelectTrigger className="h-9 w-full bg-muted/30">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {project.members.map((m: any) => (
                                                <SelectItem key={m.userId} value={m.userId}>
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-4 w-4">
                                                            <AvatarImage src={m.user?.image} />
                                                            <AvatarFallback>{m.user?.name?.[0]}</AvatarFallback>
                                                        </Avatar>
                                                        {m.user?.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="flex items-center gap-2 h-9">
                                        <Avatar className="h-5 w-5">
                                            <AvatarImage src={task.assignee?.image} />
                                            <AvatarFallback>{task.assignee?.name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        {task.assignee?.name || "Unassigned"}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Due Date</span>
                                <div className="flex items-center gap-2 text-foreground h-9 bg-muted/30 px-3 rounded-md border border-input">
                                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                    {format(new Date(task.due_date), "dd MMM yyyy")}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Attachments */}
                <Card>
                    <CardContent className="p-5">
                        <TaskAttachments taskId={taskId} userId={user?.id || ""} />
                    </CardContent>
                </Card>

                {/* Project Info */}
                {project && (
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-xl font-medium mb-4">Project Details</p>
                            <h2 className="flex items-center gap-2 font-medium"> <Link href={`/projects/${project.id}?tab=tasks`} className="underline">{project.name}</Link></h2>
                            <p className="text-xs mt-3 text-muted-foreground">Project Start Date: {format(new Date(project.start_date), "dd MMM yyyy")}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
                                <span>Status: {project.status}</span>
                                <span>Priority: {project.priority}</span>
                                <span>Progress: {project.progress}%</span>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default function TaskDetails() {
    return (
        <Suspense fallback={<div className="p-6 text-center">Loading task...</div>}>
            <TaskDetailsContent />
        </Suspense>
    )
}
