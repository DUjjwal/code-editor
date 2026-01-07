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
import { Avatar } from "./ui/avatar"
import { AvatarImage } from "./ui/avatar"
import { AvatarFallback } from "./ui/avatar"

import { Home, Database, LayoutDashboard } from "lucide-react"
import { useEffect, useMemo } from "react"

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
    picture?: string,
    starred: boolean,
    updatedAt: string,
    description?: string
}

import { Star, FileChartLine } from "lucide-react"

export function DashboardLeft() {

    const projects: project[] = usePlayground((state) => state.projects)

    
    const starredProjects = useMemo(
    () => projects.filter(p => p.starred),
    [projects]
    );

    const recentProjects = useMemo(
    () =>
        [...projects]
        .sort(
            (a, b) =>
            new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime()
        )
        .slice(0, 5),
    [projects]
    );

    useEffect(() => {
        console.log(`project changed`)
    }, [projects])
    

    const dict: any = {}

    dict["REACT"] = "../../../public/react.svg"
    dict["NEXTJS"] = "../../../public/nextjs.svg"
    dict["EXPRESS"] = "../../../public/express.svg"
    dict["VUE"] = "../../../public/vue.svg"
    dict["HONO"] = "../../../public/hono.svg"
    dict["ANGULAR"] = "../../../public/angular.svg"
    




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
                                    <SidebarMenuItem key={item.title} className="flex justify-start items-center mt-1">
                                        
                                    <SidebarMenuButton asChild className="p-1">
                                        <div>
                                            <Star/>
                                        <span>{item.title}</span>
                                        </div>
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
                                    <SidebarMenuItem key={item.title} className="mt-1">
                                    <SidebarMenuButton asChild>
                                        <div>
                                            <FileChartLine/>
                                            <span>{item.title}</span>
                                        </div>
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