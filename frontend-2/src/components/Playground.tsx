import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { editor } from "monaco-editor"
import { error, success } from "@/lib/error";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import axios from "axios"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import Editor from '@monaco-editor/react';

import { AppSidebar } from "./AppSidebar";
import { useTree } from "@/store/fileStore";
import { useEditor } from "@/store/codeEditor";
import { BotIcon, X, Save, SaveAll, Settings, FileText } from "lucide-react";
import { Button } from "./ui/button";



export function Playground() {

    const { id } = useParams<{ id: string}>()
    const navigate = useNavigate()

    const updateData = useTree((state) => state.updateData)

    const data = useTree((state) => state.data)

    const initialiseFile = useEditor((state) => state.initialiseFile)

    const setHeadersId = useEditor((state) => state.setHeadersId)
    const setCount = useEditor((state) => state.setCount)
    const openFile = useEditor((state) => state.openFile)
    
    const fn = async () => {
        if(id) {
            const res = await updateData({id})
            if(!res) {
                navigate("/dashboard")
            }

        }
        

        const playId = localStorage.getItem("playId")
        
        if(playId === JSON.stringify(id)) {
            let temp = []
            let headersId = localStorage.getItem("headersId")
            if(headersId) {
                headersId = JSON.parse(headersId)
                
                console.log(headersId)
                if(Array.isArray(headersId) && headersId.length > 0) {
                
                    let {filesMap, namesMap} = useTree.getState()
                    
                    temp = headersId.filter(item => item in filesMap && item in namesMap)

                    // console.log(temp)

                    temp.forEach((item) => {
                        //i have the file id now i want to set headers, activeId, count, openFiles
                        
                        console.log("hi")
                        console.log(item,namesMap[item], filesMap[item])
                        initialiseFile(item, namesMap[item], filesMap[item])
    
    
                    })
    
                    setCount(temp.length)
    
                    setHeadersId(temp)
    
                    if(localStorage.getItem("activeId") !== null) {
                        const file = Number(localStorage.getItem("activeId"))
                        openFile(file, filesMap[file], namesMap[file])
                    }
                    
                }
                else {
                    localStorage.removeItem("headersId")
                    localStorage.removeItem("activeId")
                }
            }

            if(temp.length)
                localStorage.setItem("headersId", JSON.stringify(temp))
            else {
                localStorage.removeItem("headersId")
                localStorage.removeItem("activeId")
            }
            
        }
        else {
            console.log("hua")
            localStorage.removeItem("activeId")
            localStorage.removeItem("headersId")
            localStorage.setItem("playId", JSON.stringify(id))
        }




    }

    useEffect(() => {
        

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

    const activeId = useEditor((state) => state.activeId)
    const openFiles = useEditor((state) => state.openFiles)
    const saveFile = useEditor((state) => state.saveFile)
    
    const handleSave = async () => {


        try {
            await axios.post("http://localhost:4000/playground/savefile", {
                fileId: activeId,
                content: openFiles[activeId].newContent
            }, {withCredentials: true})


            saveFile(activeId)

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
                }, {withCredentials: true})
               
                saveFile(item)
            })
            



            success("All File's Saved")
            

        }catch(err) {
            console.log(err)
            error("Error in saving file")
        }
    }

    return (
        <>
            <header className="h-14 shrink-0 items-center gap-2 border-b px-4 flex justify-between item-center">
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
            <header className="flex h-10 shrink-0 items-center gap-2 px-4 mt-1">
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
    const setContent = useEditor((state) => state.setContent)

    

    if(activeId === -1)
        return <div className="w-full h-[70%] flex justify-center items-center flex-col gap-y-2">
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

  minimap: { enabled: true },

  lineNumbers: "on",        // ✅ now this is "on" | "off" | "relative"
  wordWrap: "off",         // ✅ union type
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
        <div className="h-screen">
            <div className="w-[70%]">
                <Editor
                    height="90vh"
                    path={name}
                    value={data}
                    theme="github-light"
                    options={options}
                    onChange={(value) => setContent(value!)}
                />

            </div>
            <div className="h-screen">
                <iframe src="/editor.html" className="w-full h-full bg-red-500"></iframe>
            </div>
        </div>
    )
}