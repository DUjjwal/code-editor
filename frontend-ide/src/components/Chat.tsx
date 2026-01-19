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

import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"

import "highlight.js/styles/github-dark.css" // choose theme

import { useRef, useEffect } from "react"

export function Chat({open, onOpenChange}: {open: any, onOpenChange: any}) {

    const [model, setModel] = useState("deepseek-coder-33b-instruct")
    const [mode, setMode] = useState("Chat")

    const [messages, setMessages] = useState<msg[]>([])

    const aiResponse = `
Here’s how you can optimize your function.

The main issue is that the timer variable is recreated on every call.
You should keep it in closure scope.

Below is the improved version:

\`\`\`js
function debounce(fn, delay) {
  let timer = null;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
\`\`\`

### Why this works

- timer is preserved between calls
- prevents unnecessary calls

Let me know if you want the throttle version too.
`;

    const bottomRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        })
    }, [messages])


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
                                0 messages
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
                                    <SelectItem value="deepseek-coder-33b-instruct">
                                    deepseek
                                    </SelectItem>
                                    <SelectItem value="qwen2.5-coder-32b-instruct">
                                    qwen2.5
                                    </SelectItem>
                                    <SelectItem value="llama-3.1-70b-versatile">
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
                    <Input placeholder="Ask anything" className=""/>
                    <Button variant="outline" className="bg-blue-600" onClick={() => {
                        setMessages((prev) => [...prev, {role: "USER", content: "Hello"}])
                    }}><Send className="text-white"/></Button>

                </div>
            </SheetContent>
        </Sheet>
    )
}