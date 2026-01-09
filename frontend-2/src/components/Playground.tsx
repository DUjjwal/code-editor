import { useEffect, useState } from "react";
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

    const [data, setData] = useState<string>("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post("http://localhost:4000/playground/data", {
                    id: id
                }, {withCredentials: true})

                setData(res.data.data)

                
            }catch(err) {
                console.log(err)
                error("Error fetching playground data")
            }


        }

        fetchData()
    }, [])

    if(!data) return <div>Loading...</div>
    
    return (
        <>
        <SidebarProvider>
        <AppSidebar data2={JSON.parse(data)}/>
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