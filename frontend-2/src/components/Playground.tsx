import { act, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { AppSidebar } from "./AppSidebar";
import { useTree } from "@/store/fileStore";
import { useEditor } from "@/store/codeEditor";
import { BotIcon, X, Save, SaveAll, Settings } from "lucide-react";
import { Button } from "./ui/button";



export function Playground() {

    const { id } = useParams<{ id: string}>()
    const navigate = useNavigate()

    //@ts-ignore
    const updateData = useTree((state) => state.updateData)

    //@ts-ignore
    const data = useTree((state) => state.data)

    useEffect(() => {
        const fn = async () => {
            const res = await updateData({id})
            if(!res) {
                navigate("/dashboard")
            }
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
            <Header1/>
            <Header2/>
            <Body/>
        </SidebarInset>
        </SidebarProvider>
        </>
    )
}

function Header1() {

    const count = useEditor((state) => state.count)

    return (
        <>
            <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 flex justify-between item-center">
                <div className="flex items-center gap-x-2">
                    <SidebarTrigger className="-ml-1" />
                    <div>
                    <p className="text-sm text-foreground">Code Playground</p>
                    <p className="text-sm text-muted-foreground">{count} file {count>1 ? "(s)" : ""} open</p>

                    </div>
                </div>
                <div className="flex gap-x-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button className="w-5" variant="outline">
                                <Save className="text-gray-700"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black border shadow-md">
                            <p>Save file</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button className="w-5" variant="outline">
                                <SaveAll className="text-gray-700"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black border shadow-md">
                            <p>Save all</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button className="w-5" variant="outline">
                                <BotIcon className="text-gray-700"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black border shadow-md">
                            <p>AI Help</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button className="w-5" variant="outline">
                                <Settings className="text-gray-700"/>
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black border shadow-md">
                            <p>Settings</p>
                        </TooltipContent>
                    </Tooltip>
                    
                    
                    
                </div>  
            </header>
        </>
    )
}


function Header2() {

    const headers = useEditor((state) => state.headers)
    const headersId = useEditor((state) => state.headersId)
    
    const removeFile = useEditor((state) => state.removeFile)
    
    const activeId = useEditor((state) => state.activeId)
    const setActive = useEditor((state) => state.setActive)

    return (
        <>
            <header className="flex h-10 shrink-0 items-center gap-2 border-b px-4">
                {headers.map((item, idx) => (
                    <Button variant="outline" className={`w-fit px-3 ${headersId[idx] === activeId ? "text-foreground" : "text-muted-foreground"} flex items-center gap-1`} onClick={() => setActive(headersId[idx])}>
                        {item}
                    <span onClick={(e) => {
                        e.stopPropagation()
                        removeFile(headersId[idx])
                    }} className="ml-2 flex items-center justify-center rounded-md p-1 hover:text-red-700 hover:bg-gray-200">
                        <X className="h-4 w-4" />
                    </span>
                    </Button>
                ))}            
            </header>
        </>
    )
}

function Body() {

    const activeId = useEditor((state) => state.activeId)
    const openFiles = useEditor((state) => state.openFiles)


    if(activeId === -1)
        return <div>No File Opened</div>

    return (
        <div className="h-screen border border-red-400">{openFiles[activeId].newContent}</div>
    )
}