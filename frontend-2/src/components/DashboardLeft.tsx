import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePlayground } from "@/store/playgroundStore"

import { Home, Database, LayoutDashboard } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useEffect, useState } from "react"

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

interface project {
    id: string,
    title: string,
    template: string,
    createdAt: string,
    username: string,
    starred: boolean,
    updatedAt: string
}


export function DashboardLeft() {

    //@ts-ignore
    const projects: project[] = usePlayground((state) => state.projects)

    console.log(projects)
    const [starredProjects, setStarredProjects] = useState<project[]>([])
    const [recentProjects, setRecentProjects] = useState<project[]>([])
    
    useEffect(() => {

        const starred = projects.filter(p => p.starred);
        console.log("starred-", starred)
        setStarredProjects(starred);

        const recent = [...projects]
            .sort(
            (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            )
            .slice(0, 5);

        setRecentProjects(recent);

    }, [projects])
    

    
    




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
                                        <span>{item.title}</span>
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
                                        <span>{item.title}</span>
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