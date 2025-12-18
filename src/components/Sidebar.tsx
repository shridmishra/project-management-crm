import Link from "next/link";
import MyTasksSidebar from './MyTasksSidebar'
import ProjectSidebar from './ProjectsSidebar'
import WorkspaceDropdown from './WorkspaceDropdown'
import { FolderOpenIcon, LayoutDashboardIcon, SettingsIcon, UsersIcon } from 'lucide-react'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"

const AppSidebar = () => {
    const menuItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboardIcon },
        { name: 'Projects', href: '/projects', icon: FolderOpenIcon },
        { name: 'Team', href: '/team', icon: UsersIcon },
    ]

    return (
        <Sidebar>
            <SidebarHeader>
                <WorkspaceDropdown />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <button>
                                        <SettingsIcon />
                                        <span>Settings</span>
                                    </button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <MyTasksSidebar />
                <ProjectSidebar />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}

export default AppSidebar
