
"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CalendarIcon, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

function TaskDetailsContent() {
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId");
    const taskId = searchParams.get("taskId");

    const user = { id: 'user_1' }
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
        if (!projectId || !taskId) return;

        const proj = currentWorkspace?.projects.find((p: any) => p.id === projectId);
        if (!proj) return;

        const tsk = proj.tasks.find((t: any) => t.id === taskId);
        if (!tsk) return;

        setTask(tsk);
        setProject(proj);
        setLoading(false);
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
                    userId: user.id,
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
                                        <div key={comment.id} className={`max-w-[85%] p-3 rounded-md border ${comment.user.id === user?.id ? "ml-auto bg-primary/10 border-primary/20" : "mr-auto bg-muted/50 border-border"}`} >
                                            <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                                                <Avatar className="h-5 w-5">
                                                    <AvatarImage src={comment.user.image} />
                                                    <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium text-foreground">{comment.user.name}</span>
                                                <span className="text-xs">
                                                    • {format(new Date(comment.createdAt), "dd MMM yyyy, HH:mm")}
                                                </span>
                                            </div>
                                            <p className="text-sm">{comment.content}</p>
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
                        <div className="mb-3">
                            <h1 className="text-lg font-medium">{task.title}</h1>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="secondary">
                                    {task.status}
                                </Badge>
                                <Badge variant="outline">
                                    {task.type}
                                </Badge>
                                <Badge variant={task.priority === 'HIGH' ? 'destructive' : task.priority === 'MEDIUM' ? 'default' : 'secondary'}>
                                    {task.priority}
                                </Badge>
                            </div>
                        </div>

                        {task.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{task.description}</p>
                        )}

                        <Separator className="my-3" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5">
                                    <AvatarImage src={task.assignee?.image} />
                                    <AvatarFallback>{task.assignee?.name?.[0]}</AvatarFallback>
                                </Avatar>
                                {task.assignee?.name || "Unassigned"}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <CalendarIcon className="h-4 w-4" />
                                Due : {format(new Date(task.due_date), "dd MMM yyyy")}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Project Info */}
                {project && (
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-xl font-medium mb-4">Project Details</p>
                            <h2 className="flex items-center gap-2 font-medium"> <Link href={`/projectsDetail?id=${project.id}&tab=tasks`} className="underline">{project.name}</Link></h2>
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
