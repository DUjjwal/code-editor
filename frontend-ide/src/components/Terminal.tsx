import { useEffect, useRef } from "react"
import { WebContainer } from "@webcontainer/api"
import { useTree } from "@/store/fileStore"
import { Terminal as XTerminal } from "xterm"
import { FitAddon } from "@xterm/addon-fit"
import "xterm/css/xterm.css"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export function Terminal() {
  const webContainer = useRef<WebContainer | null>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const webcontainerfiles = useTree((state) => state.webContainerFiles)
  const data = useTree((state) => state.data)

  let terminal: any = null

  const bootContainer = async () => {
      webContainer.current = await WebContainer.boot()
      
  }

  const mountFiles = async () => {
    terminal.writeln("Mounting filesystem...\r\n")
    
    if(!webContainer.current)bootContainer()
    
    await webContainer.current?.mount(webcontainerfiles.directory)

    terminal.writeln("Files mounted")
    terminal.writeln("Running npm install...\r\n")

  }

  useEffect(() => {
    
    const fn = async () => {
      if (!webContainer.current) {
        await bootContainer()
      }

      terminal = new XTerminal({
        convertEol: true,
        cursorBlink: true,
        fontSize: 14,
        theme: {
          background: "#1e1e1e",
          foreground: "#ffffff"
        }
      })

      const fitAddon = new FitAddon()
      terminal.loadAddon(fitAddon)
      

      terminal.open(terminalRef.current!)
      fitAddon.fit()

      const resizeObserver = new ResizeObserver(() => {
        fitAddon.fit()
      })

      resizeObserver.observe(terminalRef.current!)

      mountFiles()

      //@ts-ignore
      const shell = await webContainer.current.spawn("jsh")

      shell.output.pipeTo(
        new WritableStream({
          write(data) {
            terminal.write(data)
          }
        })
      )

      const writer = shell.input.getWriter()

      terminal.onData((data: any) => {
        writer.write(data)
      })

      //@ts-ignore
      webContainer.current.on("server-ready", (port, url) => {
        iframeRef.current!.src = url
      })




      
    }

    fn()

    
  }, [])

  useEffect(() => { 
    console.log("changed")
  }, [data])

  return (
    <>
    <ResizablePanelGroup direction="vertical" className="h-[86%] w-[100%]">
        <ResizablePanel>
            <iframe
              ref={iframeRef}
              className="w-full h-[100%] border-none"
              sandbox="allow-scripts allow-same-origin allow-forms"
              allow="cross-origin-isolated"
            />

        </ResizablePanel>
        <ResizableHandle/>
        <ResizablePanel>
            <div
              ref={terminalRef}
              className="w-[100%] h-[100%]"
            />
            
        </ResizablePanel>
        
    </ResizablePanelGroup>
      
      
    </>

  )
}
