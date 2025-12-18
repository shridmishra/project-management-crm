import { useEffect, useState } from 'react';
import { CheckSquareIcon, ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import Link from "next/link";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function MyTasksSidebar() {

    const user = { id: 'user_1' }

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
        const currentWorkspaceTasks = currentWorkspace.projects.flatMap((project: any) => {
            return project.tasks.filter((task: any) => task?.assignee?.id === userId);
        });

        setMyTasks(currentWorkspaceTasks);
    }

    useEffect(() => {
        fetchUserTasks()
    }, [currentWorkspace])

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="mt-6 px-3 space-y-2"
        >
            <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between px-3 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                    <div className="flex items-center gap-2">
                        <CheckSquareIcon className="w-4 h-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium">My Tasks</h3>
                        <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                            {myTasks.length}
                        </Badge>
                    </div>
                    {isOpen ? (
                        <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
                    ) : (
                        <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
                    )}
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pl-2">
                {myTasks.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-muted-foreground text-center">
                        No tasks assigned
                    </div>
                ) : (
                    myTasks.map((task: any, index: number) => (
                        <Link key={index} href={`/taskDetails?projectId=${task.projectId}&taskId=${task.id}`} className="block">
                            <Button variant="ghost" className="w-full justify-start h-auto py-2 px-3 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                <div className="flex items-center gap-2 w-full min-w-0 text-left">
                                    <div className={`w-2 h-2 rounded-full ${getTaskStatusColor(task.status)} flex-shrink-0`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate">
                                            {task.title}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground lowercase">
                                            {task.status.replace('_', ' ')}
                                        </p>
                                    </div>
                                </div>
                            </Button>
                        </Link>
                    ))
                )}
            </CollapsibleContent>
        </Collapsible>
    );
}

export default MyTasksSidebar;
