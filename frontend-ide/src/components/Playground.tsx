import { useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import axios from "axios"
import {error, success} from "@/lib/error"
import {useEditor} from "@/store/codeEditor"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import Editor from '@monaco-editor/react';
import type { editor } from "monaco-editor"

import { AppSidebar } from "./AppSidebar"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { useTree } from "@/store/fileStore"
import { BotIcon, X, Save, SaveAll, Settings, FileText } from "lucide-react";

import { Button } from "./ui/button"
import { Terminal } from "./Terminal"
import { useWebContainer } from "@/store/webContainer"

export function Playground() {
    const [searchParams, setSearchParams] = useSearchParams()

    const token = searchParams.get("token")

    const { id } = useParams()

    
    const updateData = useTree((state) => state.updateData)

    const data = useTree((state) => state.data)


    
    const initialiseFile = useEditor((state) => state.initialiseFile)

    const setHeadersId = useEditor((state) => state.setHeadersId)
    const setCount = useEditor((state) => state.setCount)
    const openFile = useEditor((state) => state.openFile)

    const fn2 = async () => {
        if(id) {
            const res = await updateData({id})
            if(!res) {
                window.location.href = `http://localhost:5173/dashboard`
            }

        }
        

        const playId = localStorage.getItem("playId")
        
        if(playId === JSON.stringify(id)) {

            let headersId = localStorage.getItem("headersId")
            if(headersId) {
                let arr: number[] = Array.from(JSON.parse(headersId))
                
                let {filesMap, namesMap} = useTree.getState()

                arr = arr.filter((item: any) => item in filesMap && item in namesMap)
                
                console.log(arr, filesMap, namesMap)

                arr.forEach((item: any) => {
                    initialiseFile(item, namesMap[item], filesMap[item])
                })

                setCount(arr.length)

                setHeadersId(arr)

                if(localStorage.getItem("activeId") !== null) {
                    const file = Number(localStorage.getItem("activeId"))
                    openFile(file, filesMap[file], namesMap[file])
                }

                if(arr.length) {
                    localStorage.setItem("headersId", JSON.stringify(arr))
                }
                else {
                    localStorage.removeItem("headersId")
                    localStorage.removeItem("activeId")
                }

            }
            else {
                localStorage.removeItem("headersId")
                localStorage.removeItem("activeId")
            }
                       
        }
        else {
            localStorage.removeItem("activeId")
            localStorage.removeItem("headersId")
            localStorage.setItem("playId", JSON.stringify(id))
        }




    }
    

    useEffect(() => {

        const fn1 = async () => {
    
            try {
                
                if(token) {
                    const res = await axios.get("http://localhost:4000/auth/verify", {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    })
                    
                    sessionStorage.setItem("access-token", JSON.stringify(res.data.token))
                    

                    searchParams.delete("token");
                    setSearchParams(searchParams, { replace: true });


        
                }else {
                    
                    //checking sesion storage for access token
                    const access = sessionStorage.getItem("access-token")
                    
                    if(!access) {
                        //redirect to dashboard
                        error("Access token not found redirect to dashboard")
                        setTimeout(() => window.location.href = "http://localhost:5173/dashboard", 2000)
                        
                    }
                    else {
                        await axios.get("http://localhost:4000/status", {
                            headers: {
                                'Authorization': `Bearer ${access}`,
                            }
                        })

                    }

                }

            }catch(err) {
                console.log(err)
                error("Unauthenticated access redirect to dashboard")
                setTimeout(() => window.location.href = "http://localhost:5173/dashboard", 2000)
                    
            }

        }

        fn1()

        fn2()

    }, [])

    if(!data.id) return <div>Loading...</div>

    return (
        <>
        <div>
            <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <Header1/>
                <Header2/>
                <Body/>
            </SidebarInset>
            </SidebarProvider>

        </div>
        </>
    )
}

function Header1() {

    const count = useEditor((state) => state.count)

    const activeId = useEditor((state) => state.activeId)
    const openFiles = useEditor((state) => state.openFiles)
    const saveFile = useEditor((state) => state.saveFile)
    
    const pathMap = useTree((state) => state.pathMap)

    const mountSeparateFile = useWebContainer((state) => state.mountSeparateFile)

    const handleSave = async () => {


        try {
            await axios.post("http://localhost:4000/playground/savefile", {
                fileId: activeId,
                content: openFiles[activeId].newContent
            }, {headers: {
                'Authorization': `Bearer ${sessionStorage.getItem("access-token")}`,
            }})


            saveFile(activeId)

            await mountSeparateFile(pathMap[activeId], openFiles[activeId].newContent)

            success("File Saved")
            

        }catch(err) {
            console.log(err)
            error("Error in saving file")
        }
    }

    const handleSaveAll = async () => {


        try {

            const {headersId} = useEditor.getState()

            headersId.forEach(async (item) => {
               
                await axios.post("http://localhost:4000/playground/savefile", {
                    fileId: item,
                    content: openFiles[item].newContent
                }, {headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("access-token")}`,
                }})
               
                saveFile(item)

                await mountSeparateFile(pathMap[item], openFiles[item].newContent)
            })
            



            success("All File's Saved")
            

        }catch(err) {
            console.log(err)
            error("Error in saving file")
        }
    }

    return (
        <>
            <header className="h-[7%] shrink-0 items-center gap-2 border-b px-4 flex justify-between item-center">
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
                            <Button className="w-5" variant="outline" onClick={handleSave}>
                                <Save className="text-gray-700"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black border shadow-md">
                            <p>Save file</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button className="w-5" variant="outline" onClick={handleSaveAll}>
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
            <header className="flex h-[7%] shrink-0 items-center gap-2 px-4 mt-1">
                {headers.map((item, idx) => (
                    <Button variant="outline" className={`w-fit px-3 ${headersId[idx] === activeId ? "text-foreground" : "text-muted-foreground"} flex items-center gap-1`} onClick={() => setActive(headersId[idx])} key={idx}>
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
    const setContent = useEditor((state) => state.setContent)

    
    if(activeId === -1)
        return <div className="w-full h-[86%] flex justify-center items-center flex-col gap-y-2">
            <FileText className="w-20 h-20 text-gray-700"/>
            <div className="text-center"> 
                <p>No Files open</p>
                <p className="text-muted-foreground">Select a file from the sidebar to start editing</p> 

            </div>
        </div>

    let data = openFiles[activeId].newContent

    const options: editor.IStandaloneEditorConstructionOptions = {
  fontSize: 14,
  fontFamily: "'Droid Sans Mono', monospace",

  minimap: { enabled: false },

  lineNumbers: "on",        // ✅ now this is "on" | "off" | "relative"
  wordWrap: "on",         // ✅ union type
  renderWhitespace: "selection",
  renderLineHighlight: "line",

  scrollBeyondLastLine: true,
  automaticLayout: true,

  bracketPairColorization: {
    enabled: true,
  },

  inlineSuggest: {
    enabled: true,
  },

  quickSuggestions: {
    other: true,
    comments: false,
    strings: false,
  },

  parameterHints: {
    enabled: true,
  },
}

    const name = openFiles[activeId].name
    
    return (
    <>
        <ResizablePanelGroup direction="horizontal" className="h-[86%] w-[100%]">
            <ResizablePanel>
                <Editor
                    height="90vh"
                    path={name}
                    value={data}
                    theme="github-light"
                    options={options}
                    onChange={(value) => setContent(value!)}
                />

            </ResizablePanel>
            <ResizableHandle/>
            <ResizablePanel>
                <Terminal/>
                
            </ResizablePanel>
        
        </ResizablePanelGroup>
        
    
    </>
    )
}