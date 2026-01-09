import { useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { AppSidebar } from "./AppSidebar";
import { useTree } from "@/store/fileStore";




export function Playground() {

    const { id } = useParams<{ id: string}>()

    //@ts-ignore
    const updateData = useTree((state) => state.updateData)

    //@ts-ignore
    const data = useTree((state) => state.data)

    useEffect(() => {
        const fn = async () => {
            await updateData({id})
        } 
        // updateData({id})    
        fn()

    }, [])

    if(!data.id) return <div>Loading...</div>
    
    return (
        <>
        <SidebarProvider>
        <AppSidebar/>
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            {/* <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
            /> */}
            {/* <Breadcrumb>
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
            </Breadcrumb> */}
            </header>
            body
        </SidebarInset>
        </SidebarProvider>
        </>
    )
}