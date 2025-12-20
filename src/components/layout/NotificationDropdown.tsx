"use client";

import React, { useState, useEffect } from "react";
import { BellIcon, CheckIcon, CircleDotIcon, InfoIcon, MessageSquareIcon, UserPlusIcon, ZapIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

const notificationIcons: any = {
    TASK_ASSIGNED: { icon: UserPlusIcon, color: "text-primary bg-primary/10" },
    TASK_UPDATED: { icon: ZapIcon, color: "text-warning bg-warning/10" },
    COMMENT_ADDED: { icon: MessageSquareIcon, color: "text-info bg-info/10" },
    PROJECT_INVITE: { icon: InfoIcon, color: "text-success bg-success/10" },
};

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const router = useRouter();

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/notifications');
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
                setUnreadCount(data.filter((n: any) => !n.read).length);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id?: string) => {
        try {
            const response = await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(id ? { notificationId: id } : { all: true }),
            });

            if (response.ok) {
                if (id) {
                    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
                    setUnreadCount(prev => Math.max(0, prev - 1));
                } else {
                    setNotifications(notifications.map(n => ({ ...n, read: true })));
                    setUnreadCount(0);
                }
            }
        } catch (error) {
            console.error("Failed to mark notifications as read:", error);
        }
    };

    const handleNotificationClick = (notification: any) => {
        if (!notification.read) markAsRead(notification.id);

        const data = notification.data || {};
        if (data.taskId) {
            router.push(`/tasks/${data.taskId}`);
        } else if (data.projectId) {
            router.push(`/projects/${data.projectId}`);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 relative rounded-lg">
                    <BellIcon className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-[10px] font-bold text-destructive-foreground rounded-full flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between p-4 border-b">
                    <DropdownMenuLabel className="p-0 font-semibold">Notifications</DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs font-medium text-primary hover:text-primary/80"
                            onClick={() => markAsRead()}
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[400px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 p-4 text-center">
                            <BellIcon className="h-10 w-10 text-muted-foreground/20 mb-2" />
                            <p className="text-sm text-muted-foreground">No notifications yet</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => {
                                const { icon: Icon, color } = notificationIcons[notification.type] || { icon: CircleDotIcon, color: "text-muted-foreground bg-muted" };
                                return (
                                    <div
                                        key={notification.id}
                                        className={`flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer ${!notification.read ? "bg-primary/5" : ""}`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className={`mt-0.5 p-2 rounded-lg ${color}`}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm leading-snug mb-1 ${!notification.read ? "font-semibold" : "text-muted-foreground"}`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <div className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>
                <DropdownMenuSeparator />
                <div className="p-2">
                    <Button variant="ghost" className="w-full h-8 text-xs text-muted-foreground" onClick={() => router.push('/notifications')}>
                        View all notifications
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationDropdown;
