import { useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ChevronRightIcon, SettingsIcon, KanbanIcon, ChartColumnIcon, CalendarIcon, ArrowRightIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ProjectSidebar = () => {

    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [expandedProjects, setExpandedProjects] = useState(new Set());

    const projects = useSelector(
        (state) => state?.workspace?.currentWorkspace?.projects || []
    );

    const getProjectSubItems = (projectId) => [
        { title: 'Tasks', icon: KanbanIcon, url: `/projectsDetail?id=${projectId}&tab=tasks` },
        { title: 'Analytics', icon: ChartColumnIcon, url: `/projectsDetail?id=${projectId}&tab=analytics` },
        { title: 'Calendar', icon: CalendarIcon, url: `/projectsDetail?id=${projectId}&tab=calendar` },
        { title: 'Settings', icon: SettingsIcon, url: `/projectsDetail?id=${projectId}&tab=settings` }
    ];

    const toggleProject = (id) => {
        const newSet = new Set(expandedProjects);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        setExpandedProjects(newSet);
    };

    return (
        <div className="mt-6 px-3">
            <div className="flex items-center justify-between px-3 py-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Projects
                </h3>
                <Link to="/projects">
                    <Button variant="ghost" size="icon" className="h-5 w-5">
                        <ArrowRightIcon className="h-3 w-3" />
                    </Button>
                </Link>
            </div>

            <div className="space-y-1 px-3">
                {projects.map((project) => (
                    <Collapsible
                        key={project.id}
                        open={expandedProjects.has(project.id)}
                        onOpenChange={() => toggleProject(project.id)}
                    >
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full justify-start h-auto py-2 px-3 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                <ChevronRightIcon className={cn("h-3 w-3 mr-2 transition-transform duration-200", expandedProjects.has(project.id) && 'rotate-90')} />
                                <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                                <span className="truncate max-w-40 text-sm">{project.name}</span>
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="ml-5 mt-1 space-y-1">
                             {getProjectSubItems(project.id).map((subItem) => {
                                const isActive =
                                    location.pathname === `/projectsDetail` &&
                                    searchParams.get('id') === project.id &&
                                    searchParams.get('tab') === subItem.title.toLowerCase();

                                return (
                                    <Link key={subItem.title} to={subItem.url} className={cn(
                                        "flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors duration-200 text-xs",
                                        isActive 
                                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                                            : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50'
                                    )} >
                                        <subItem.icon className="h-3 w-3" />
                                        {subItem.title}
                                    </Link>
                                );
                            })}
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
        </div>
    );
};

export default ProjectSidebar;