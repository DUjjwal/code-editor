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
} from "@/components/ui/sidebar"

import { Calendar, Home, Inbox, Search, Database, LayoutDashboard } from "lucide-react"
import type { LucideIcon } from "lucide-react"

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "#",
    icon: LayoutDashboard,
  }
]

const starredProjects: projects[] = [
    {
        title: "Project 1",
        url: "#",
        icon: Database
    }
]

interface projects {
    title: string,
    url: string,
    icon: LucideIcon
}

const recentProjects: projects[] = [
    
]

export function DashboardLeft() {


    return (
        <Sidebar className="w-[18%]">
            <SidebarContent>
                <SidebarGroup>
                <SidebarGroupLabel>Code Editor</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                            <a href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                            </a>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenu>
                </SidebarGroupContent>
                
                <SidebarGroupLabel>Starred</SidebarGroupLabel>
                <SidebarGroupContent>
                    {
                        starredProjects.length > 0 ? 
                            <SidebarMenu>
                                {starredProjects.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu> : 
                            <SidebarMenu>
                                <SidebarMenuItem className="text-center">
                                    No Project Found
                                </SidebarMenuItem>
                            </SidebarMenu>
                    }
                </SidebarGroupContent>
                
                <SidebarGroupLabel>Recent</SidebarGroupLabel>
                
                <SidebarGroupContent>
                    {
                        recentProjects.length > 0 ? 
                            <SidebarMenu>
                                {recentProjects.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu> : 
                            <SidebarMenu>
                                <SidebarMenuItem className="text-center">
                                    No Project Found
                                </SidebarMenuItem>
                            </SidebarMenu>
                    }
                    
                </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}