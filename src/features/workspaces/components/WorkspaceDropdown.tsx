import { Check, ChevronDown, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace } from "@/features/workspaces/store/workspaceSlice";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useState } from "react";
import CreateWorkspaceDialog from "./CreateWorkspaceDialog";

function WorkspaceDropdown() {

    const { workspaces } = useSelector((state: any) => state.workspace);
    const currentWorkspace = useSelector((state: any) => state.workspace?.currentWorkspace || null);

    const dispatch = useDispatch();
    const router = useRouter();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const onSelectWorkspace = (organizationId: any) => {
        dispatch(setCurrentWorkspace(organizationId))
        router.push('/')
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between h-auto p-3 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        <div className="flex items-center gap-3 text-left">
                            <Avatar className="h-8 w-8 rounded-md">
                                <AvatarImage src={(currentWorkspace?.image_url as any)?.src || currentWorkspace?.image_url} alt={currentWorkspace?.name} />
                                <AvatarFallback className="rounded-md">{currentWorkspace?.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{currentWorkspace?.name || "Select Workspace"}</span>
                                <span className="truncate text-xs text-muted-foreground">{workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""}</span>
                            </div>
                        </div>
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" align="start" side="bottom" sideOffset={4}>
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Workspaces</DropdownMenuLabel>
                    {workspaces.map((ws: any) => (
                        <DropdownMenuItem key={ws.id} onClick={() => onSelectWorkspace(ws.id)} className="gap-2 p-2 cursor-pointer">
                            <Avatar className="h-6 w-6 rounded-md">
                                <AvatarImage src={(ws.image_url as any)?.src || ws.image_url} alt={ws.name} />
                                <AvatarFallback className="rounded-md">{ws.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{ws.name}</span>
                                <span className="truncate text-xs text-muted-foreground">{ws.members?.length || 0} members</span>
                            </div>
                            {currentWorkspace?.id === ws.id && (
                                <Check className="ml-auto h-4 w-4" />
                            )}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 p-2 cursor-pointer" onClick={() => setIsCreateDialogOpen(true)}>
                        <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                            <Plus className="size-4" />
                        </div>
                        <div className="font-medium text-muted-foreground">Create Workspace</div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <CreateWorkspaceDialog isDialogOpen={isCreateDialogOpen} setIsDialogOpen={setIsCreateDialogOpen} />
        </div>
    );
}

export default WorkspaceDropdown;
