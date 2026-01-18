import { useEffect, useRef } from "react"
import { useTree } from "@/store/fileStore"
import "xterm/css/xterm.css"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useWebContainer } from "@/store/webContainer"

export function Terminal() {
  
  const terminalRef = useRef<HTMLDivElement>(null)
  const url = useWebContainer((state) => state.url)
  const webcontainerfiles = useTree((state) => state.webContainerFiles)
  const data = useTree((state) => state.data)

  const initialiseTerminal = useWebContainer((state) => state.initialiseTerminal)
  const initialiseWebContainer = useWebContainer((state) => state.initialiseWebContainer)
  const mountFiles = useWebContainer((state) => state.mountFiles)
  const attachTerminal = useWebContainer((state) => state.attachTerminal)
  const link = useWebContainer((state) => state.link)

  useEffect(() => {
    
    const fn = async () => {
      
      await initialiseTerminal()
      await initialiseWebContainer()


      attachTerminal(terminalRef)

      await mountFiles(webcontainerfiles)

      await link()
     
    }

    fn()
   
  }, [])

  useEffect(() => { 
    mountFiles(webcontainerfiles)
  }, [data])

  return (
    <>
    <ResizablePanelGroup direction="vertical" className="h-[86%] w-[100%] pb-5">
        <ResizablePanel>
            <iframe
              //@ts-ignore
              src={url}
              className="w-full h-[100%] border-none rounded-lg p-2"
              sandbox="allow-scripts allow-same-origin allow-forms"
              allow="cross-origin-isolated"
            />

        </ResizablePanel>
        <ResizableHandle/>
        <ResizablePanel>
          <div className="w-full h-full rounded-lg p-2 bg-zinc-900 overflow-hidden">
            <div 
              ref={terminalRef} 
              className="
                w-[98%] h-[98%]
                /* 1. Target the internal Xterm viewport to hide Webkit scrollbar (Chrome/Safari) */
                [&_.xterm-viewport::-webkit-scrollbar]:hidden
                
                /* 2. Target the internal viewport to hide Firefox scrollbar */
                [&_.xterm-viewport]:[scrollbar-width:none]
              " 
            />

          </div>
  
        </ResizablePanel>
        
    </ResizablePanelGroup>
      
      
    </>

  )
}
