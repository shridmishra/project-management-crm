import { useEffect, useState } from 'react';
import { CheckSquareIcon, ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import Link from "next/link";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from '@/lib/auth-client';

function MyTasksSidebar() {

    const { data: session } = useSession();
    const user = session?.user;

    const { currentWorkspace } = useSelector((state: any) => state.workspace);
    const [isOpen, setIsOpen] = useState(false);
    const [myTasks, setMyTasks] = useState([]);

    const getTaskStatusColor = (status: any) => {
        switch (status) {
            case 'DONE':
                return 'bg-success';
            case 'IN_PROGRESS':
                return 'bg-warning';
            case 'TODO':
                return 'bg-muted-foreground';
            default:
                return 'bg-muted';
        }
    };

    const fetchUserTasks = () => {
        const userId = user?.id || '';
        if (!userId || !currentWorkspace) return;
        const currentWorkspaceTasks = currentWorkspace.projects?.flatMap((project: any) => {
            return project.tasks?.filter((task: any) => task?.assignee?.id === userId) || [];
        }) || [];

        setMyTasks(currentWorkspaceTasks);
    }

    useEffect(() => {
        fetchUserTasks()
    }, [currentWorkspace])

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>
                My Tasks
                <span className="ml-auto text-xs text-muted-foreground">{myTasks.length}</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {myTasks.length === 0 ? (
                        <div className="px-2 py-1 text-xs text-muted-foreground">
                            No tasks assigned
                        </div>
                    ) : (
                        myTasks.map((task: any, index: number) => (
                            <SidebarMenuItem key={index}>
                                <SidebarMenuButton asChild>
                                    <Link href={`/tasks/${task.id}`}>
                                        <div className={`size-2 rounded-full ${getTaskStatusColor(task.status)} shrink-0 translate-x-1`} />
                                        <div className="flex flex-col gap-0.5 ml-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                                            <span className="truncate">{task.title}</span>
                                            <span className="text-[10px] text-muted-foreground lowercase truncate">
                                                {task.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

export default MyTasksSidebar;
