import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronRightIcon, SettingsIcon, KanbanIcon, ChartColumnIcon, CalendarIcon, ArrowRightIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

const ProjectSidebar = () => {

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [expandedProjects, setExpandedProjects] = useState(new Set());

    const projects = useSelector(
        (state: any) => state?.workspace?.currentWorkspace?.projects || []
    );

    const getProjectSubItems = (projectId: any) => [
        { title: 'Tasks', icon: KanbanIcon, url: `/projects/${projectId}?tab=tasks` },
        { title: 'Analytics', icon: ChartColumnIcon, url: `/projects/${projectId}?tab=analytics` },
        { title: 'Calendar', icon: CalendarIcon, url: `/projects/${projectId}?tab=calendar` },
        { title: 'Settings', icon: SettingsIcon, url: `/projects/${projectId}?tab=settings` }
    ];

    const toggleProject = (id: any) => {
        const newSet = new Set(expandedProjects);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        setExpandedProjects(newSet);
    };

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupAction title="View All" asChild>
                <Link href="/projects">
                    <ArrowRightIcon />
                </Link>
            </SidebarGroupAction>
            <SidebarGroupContent>
                <SidebarMenu>
                    {projects.map((project: any) => (
                        <Collapsible
                            key={project.id}
                            asChild
                            open={expandedProjects.has(project.id)}
                            onOpenChange={() => toggleProject(project.id)}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={project.name}>
                                        <div className="flex size-2 shrink-0 rounded-full bg-primary" />
                                        <span className="truncate group-data-[collapsible=icon]:!hidden">{project.name}</span>
                                        <ChevronRightIcon className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:!hidden" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {getProjectSubItems(project.id).map((subItem: any) => {
                                            const isActive =
                                                pathname === `/projects/${project.id}` &&
                                                searchParams.get('tab') === subItem.title.toLowerCase();

                                            return (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton asChild isActive={isActive}>
                                                        <Link href={subItem.url}>
                                                            <subItem.icon />
                                                            <span>{subItem.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            );
                                        })}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};

export default ProjectSidebar;