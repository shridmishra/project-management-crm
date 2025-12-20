"use client";

import React, { useState, useEffect } from "react";
import { FileIcon, PaperclipIcon, TrashIcon, XIcon, PlusIcon, FileTextIcon, ImageIcon, FileArchiveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { format } from "date-fns";

const getFileIcon = (type: string) => {
    if (type?.includes('image')) return ImageIcon;
    if (type?.includes('pdf')) return FileTextIcon;
    if (type?.includes('zip') || type?.includes('rar')) return FileArchiveIcon;
    return FileIcon;
};

const TaskAttachments = ({ taskId, userId }: { taskId: string; userId: string }) => {
    const [attachments, setAttachments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAttachments = async () => {
        try {
            const response = await fetch(`/api/tasks/${taskId}/attachments`);
            if (response.ok) {
                const data = await response.json();
                setAttachments(data);
            }
        } catch (error) {
            console.error("Failed to fetch attachments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (taskId) fetchAttachments();
    }, [taskId]);

    const handleFileUpload = async () => {
        // Simulating file upload since we don't have a storage backend
        const fileName = window.prompt("Enter simulated file name (e.g. design.png):");
        if (!fileName) return;

        const fileType = fileName.split('.').pop();
        const mockFileUrl = `https://placeholder.com/${fileName}`;

        try {
            toast.loading("Uploading attachment...");
            const response = await fetch(`/api/tasks/${taskId}/attachments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileName,
                    fileUrl: mockFileUrl,
                    fileType: fileType === 'png' || fileType === 'jpg' ? 'image/png' : 'application/pdf',
                    fileSize: Math.floor(Math.random() * 1000000),
                    userId,
                }),
            });

            if (response.ok) {
                const newAttachment = await response.json();
                setAttachments([newAttachment, ...attachments]);
                toast.dismiss();
                toast.success("Attachment uploaded.");
            } else {
                throw new Error("Failed to upload");
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to upload attachment");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            toast.loading("Deleting attachment...");
            const response = await fetch(`/api/tasks/${taskId}/attachments?attachmentId=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setAttachments(attachments.filter(a => a.id !== id));
                toast.dismiss();
                toast.success("Attachment deleted.");
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to delete attachment");
        }
    };

    if (loading) return <div className="text-sm text-muted-foreground animate-pulse">Loading attachments...</div>;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <PaperclipIcon className="h-4 w-4" /> Attachments ({attachments.length})
                </h3>
                <Button variant="ghost" size="sm" onClick={handleFileUpload} className="h-8 px-2 text-primary">
                    <PlusIcon className="h-4 w-4 mr-1" /> Add
                </Button>
            </div>

            {attachments.length === 0 ? (
                <div className="text-xs text-muted-foreground bg-muted/20 border border-dashed rounded-lg p-6 text-center">
                    No attachments yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {attachments.map((attachment) => {
                        const Icon = getFileIcon(attachment.fileType);
                        return (
                            <Card key={attachment.id} className="group hover:border-primary/50 transition-colors shadow-none bg-muted/10">
                                <CardContent className="p-3 flex items-center gap-3">
                                    <div className="h-10 w-10 bg-background rounded-md flex items-center justify-center border">
                                        <Icon className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate" title={attachment.fileName}>
                                            {attachment.fileName}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {format(new Date(attachment.createdAt), "dd MMM HH:mm")} • {(attachment.fileSize / 1024).toFixed(1)} KB
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                                        onClick={() => handleDelete(attachment.id)}
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TaskAttachments;
