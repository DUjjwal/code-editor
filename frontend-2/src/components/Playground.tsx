import { act, useEffect, useState } from "react";
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
import { BotIcon, X, Save, SaveAll, Settings } from "lucide-react";
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
            
            let headersId = localStorage.getItem("headersId")
            if(headersId) {
                headersId = JSON.parse(headersId)
                
                console.log(headersId)
                if(Array.isArray(headersId)) {
                
                    const {filesMap, namesMap} = useTree.getState()
                    
                    headersId.forEach((item) => {
                        //i have the file id now i want to set headers, activeId, count, openFiles
                        
                        console.log("hi")
                        console.log(item,namesMap[item], filesMap[item])
                        initialiseFile(item, namesMap[item], filesMap[item])
    
    
                    })
    
                    setCount(headersId.length)
    
                    setHeadersId(headersId)
    
                    if(localStorage.getItem("activeId") !== null) {
                        const file = Number(localStorage.getItem("activeId"))
                        openFile(file, filesMap[file], namesMap[file])
                    }
                    
                }
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


const monacoLanguageMap: Record<string, string> = {
  // ===============================
  // JavaScript / TypeScript
  // ===============================
  js: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  jsx: "javascript",
  ts: "typescript",
  mts: "typescript",
  cts: "typescript",
  tsx: "typescript",

  // ===============================
  // Vue / Svelte
  // ===============================
  vue: "vue",
  svelte: "svelte",

  // ===============================
  // Web
  // ===============================
  html: "html",
  htm: "html",
  css: "css",
  scss: "scss",
  sass: "scss",
  less: "less",

  // ===============================
  // Data / Config
  // ===============================
  json: "json",
  jsonc: "json",
  yaml: "yaml",
  yml: "yaml",
  toml: "toml",
  ini: "ini",
  conf: "ini",

  // ===============================
  // Backend
  // ===============================
  graphql: "graphql",
  gql: "graphql",
  sql: "sql",

  // ===============================
  // Docs
  // ===============================
  md: "markdown",
  markdown: "markdown",
  txt: "plaintext",

  // ===============================
  // Shell / Scripts
  // ===============================
  sh: "shell",
  bash: "shell",
  zsh: "shell",

  // ===============================
  // DevOps
  // ===============================
  dockerfile: "dockerfile",
  dockerignore: "plaintext",

  // ===============================
  // Git
  // ===============================
  gitignore: "plaintext",
  gitattributes: "plaintext",
  gitmodules: "plaintext",

  // ===============================
  // Low level
  // ===============================
  wasm: "wat",

  // ===============================
  // Misc
  // ===============================
  log: "plaintext",
};



function Body() {

    const activeId = useEditor((state) => state.activeId)
    const openFiles = useEditor((state) => state.openFiles)
    const setContent = useEditor((state) => state.setContent)

    

    if(activeId === -1)
        return <div>No File Opened</div>

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
            <Editor
                height="90vh"
                path={name}
                value={data}
                theme="github-light"
                options={options}
                onChange={(value) => setContent(value!)}
            />
        </div>
    )
}