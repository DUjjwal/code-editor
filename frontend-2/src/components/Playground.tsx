import { act, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { editor } from "monaco-editor"

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

import Editor from '@monaco-editor/react';

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
    let ext = name.split(".").at(-1)

    if(!ext) ext = "js"
    const lang = monacoLanguageMap[ext]

    return (
        <div className="h-screen">
            <Editor
                height="90vh"
                defaultLanguage={lang}
                value={data}
                theme="github-light"
                options={options}
                onChange={(value) => setContent(value!)}
            />
        </div>
    )
}