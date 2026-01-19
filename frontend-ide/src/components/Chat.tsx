import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "./ui/separator"


import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Bot } from "lucide-react"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react"

import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Send } from "lucide-react"

interface msg {
    role: "USER" | "AGENT",
    content: string
}

import axios from "axios"

import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"

import "highlight.js/styles/github-dark.css" // choose theme

import { useRef, useEffect } from "react"

export function Chat({open, onOpenChange}: {open: any, onOpenChange: any}) {

    const [model, setModel] = useState("llama3-8b-8192")
    const [mode, setMode] = useState("Chat")

    const [messages, setMessages] = useState<msg[]>([])

    const [text, setText] = useState<string>("")

    const bottomRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        })
    }, [messages])


    useEffect(() => {
        const fn = async () => {

            console.log("clicked")

            const res = await axios.get("http://localhost:4000/ai/all", {headers: {
                'Authorization': `Bearer ${sessionStorage.getItem("access-token")}`,
            }})

            console.log(res.data)

            const temp: msg[] = []
            res.data.data.forEach((item: any) => {
                temp.push({
                    role: item.role,
                    content: item.content
                })
            })

            console.log(temp)

            setMessages(temp)

            bottomRef.current?.scrollIntoView({
                behavior: "smooth"
            })

        }
        
        fn()
    }, [])

    const handleSubmit = async () => {
        if(text === "")return

        setMessages((prev) => [...prev, {role: "USER", content: text}])

        const res = await axios.post("http://localhost:4000/ai/chat", {
            model,
            mode,
            text
        }, {headers: {
                'Authorization': `Bearer ${sessionStorage.getItem("access-token")}`,
        }})



        setMessages((prev) => [...prev, {role: "AGENT", content: res.data.data}])

        setText("")
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange} >
            <SheetContent className="w-[90%] sm:max-w-none flex flex-col h-full">
                <div className="shrink-0">
                    <div className="flex justify-start items-center gap-x-5">
                        <Bot className="w-10 h-10 border-black rounded-full border p-1"/>
                        <div>
                            <p className="text-lg">
                                Enhanced AI Assisstant
                            </p>
                            <p className="text-muted-foreground text-sm">
                                {messages.length} messages
                            </p>

                        </div>
               
                    </div>
                    <div className="flex mt-3">
                        <div className="w-[50%]">
                            <Tabs value={mode} onValueChange={setMode} className="shrink-0">
                                <TabsList className="grid grid-cols-4 w-fit">
                                <TabsTrigger value="Chat">Chat</TabsTrigger>
                                <TabsTrigger value="Review">Review</TabsTrigger>
                                <TabsTrigger value="Fix">Fix</TabsTrigger>
                                <TabsTrigger value="Optimize">Optimize</TabsTrigger>
                                </TabsList>
                            </Tabs>

                        </div>
                        <div className="w-[50%] flex justify-end items-center gap-x-2">
                            <p className="">Models: </p>
                            <Select value={model} onValueChange={setModel}>
                                <SelectTrigger className="w-[180px] shrink-0">
                                <SelectValue placeholder="Select a model" />
                                </SelectTrigger>

                                <SelectContent>
                                <SelectGroup>
                                    {/* <SelectItem value="deepseek-r1-distill-llama-70b">
                                    deepseek-r1-distill
                                    </SelectItem>
                                    <SelectItem value="mixtral-8x7b-32768">
                                    mixtral
                                    </SelectItem> */}
                                    <SelectItem value="llama3-8b-8192">
                                    llama-3.1
                                    </SelectItem>
                                </SelectGroup>
                                </SelectContent>
                            </Select>

                        </div>


                    </div>

                </div>
                <Separator/>
               <div className="flex-1 overflow-y-auto flex flex-col gap-y-2">
                    {messages.length === 0 ? <div className="flex flex-1 items-center justify-center text-muted-foreground text-3xl">Where should we start?</div> : ""}
                    {
                        messages.map((item) => {
                            if(item.role === "USER")
                                return (
                                <div className="bg-gray-100 text-right p-2 rounded-lg self-end w-auto max-w-[60%]">{item.content}</div>
                )
                            else 
                                return(
                                <div className="bg-gray-100 p-2 rounded-lg w-auto max-w-[60%]">
                                    <Markdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>{item.content}</Markdown>
                                </div>
                                )
                        })
                    }
                    <div ref={bottomRef} />
                </div>

                <Separator/>
                <div className="flex gap-x-1">
                    <Input placeholder="Ask anything" className="" value={text} onChange={(e) => setText(e.target.value)}/>
                    <Button variant="outline" className="bg-blue-600" onClick={handleSubmit}><Send className="text-white"/></Button>

                </div>
            </SheetContent>
        </Sheet>
    )
}