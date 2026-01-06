import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import { Spinner } from "./ui/spinner"

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

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { error } from "@/lib/error"


const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function Dashboard() {

    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        
        const checkIfLoggedIn = async () => {
            
            try {
                const res = await axios.get("http://localhost:4000/status",{withCredentials: true})
                setLoading(false)
            }
            catch(err) {
                error("Unauthenticated user Redirecting to home page");
                setTimeout(() => navigate("/"), 2000)
            }

                
            
        }

        checkIfLoggedIn()
        

    }, [])


    if(loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <Spinner/>
            </div>
        )
    }

    return (
        <div>
            <SidebarProvider>
        <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
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
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
      </SidebarProvider>
        </div>
    )
}