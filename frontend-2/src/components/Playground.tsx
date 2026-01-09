import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"
import { error } from "@/lib/error";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { AppSidebar } from "./AppSidebar";


export function Playground() {

    const { id } = useParams<{ id: string}>()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post("http://localhost:4000/playground/data", {
                    id: id
                }, {withCredentials: true})

                console.log(res.data)
                console.log(JSON.parse(res.data.data.content))

            }catch(err) {
                console.log(err)
                error("Error fetching playground data")
            }


        }

        fetchData()
    }, [])
    
    return (
        <>
        <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
                <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">components</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">ui</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                    <BreadcrumbPage>button.tsx</BreadcrumbPage>
                </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
            </div>
            <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
            </div>
        </SidebarInset>
        </SidebarProvider>
        </>
    )
}