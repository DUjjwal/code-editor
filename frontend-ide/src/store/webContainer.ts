import { WebContainer } from "@webcontainer/api";
import { Terminal } from "xterm";
import { create } from "zustand";
import { FitAddon } from "@xterm/addon-fit"
import type React from "react";

interface web {
    webContainer: WebContainer | null,
    terminal: Terminal | null,
    url: string | null,
    fitAddon: FitAddon | null,
    initialiseWebContainer: () => Promise<void>,
    initialiseTerminal: () => Promise<void>,
    mountFiles: (webContainerFiles: any) => Promise<void>,
    attachTerminal: (ref: React.RefObject<HTMLDivElement | null>) => void,
    link: () => Promise<void>,
    mountSeparateFile: (path: string, content: string) => Promise<void>

}

export const useWebContainer = create<web>((set, get) => ({
    webContainer: null,
    terminal: null,
    url: null,
    fitAddon: null,
    initialiseWebContainer: async () => {
        if(get().webContainer) return

        const wc = await WebContainer.boot()
            set({webContainer: wc})
    },
    initialiseTerminal: async () => {
        if(get().terminal) return

        const term = new Terminal({
            convertEol: true,
            cursorBlink: true,
            fontSize: 14,
            theme: {
                background: "#1e1e1e",
                foreground: "#ffffff"
            }
        })

        const fitAddon = new FitAddon()
        term.loadAddon(fitAddon)

        set({terminal: term, fitAddon})        
    },
    mountFiles: async (webcontainerfiles: any) => {
        
        const {terminal, webContainer} = get()

        if(!terminal || !webContainer)return 

        

        terminal.writeln(` Files changes detected\n`)
        terminal.writeln(` Mounting filesystem...`)
    
    
        await webContainer.mount(webcontainerfiles.directory)
        terminal.writeln(` Filesystem mounted successfully\n`)
        
        
    },
    mountSeparateFile: async (path: string, content: string) => {
        const {webContainer, terminal} = get()
        if(!webContainer || !terminal)return 

        terminal.writeln(` File Save detected\n`)
        terminal.writeln(` Rewriting File...`)

        await webContainer.fs.writeFile(path, content)

        terminal.writeln(` Rewriting File Completed`)


    },
    attachTerminal: (ref: React.RefObject<HTMLDivElement | null>) => {
        const {terminal, fitAddon} = get()

        if(!terminal || !fitAddon)return
        
        terminal.open(ref.current!)
        fitAddon.fit()

        const resizeObserver = new ResizeObserver(() => {
            fitAddon.fit()
        })

        resizeObserver.observe(ref.current!)

    },
    link: async () => {
        const webContainer = get().webContainer
        const terminal = get().terminal

        if(!webContainer || !terminal)return
        
        const shell = await webContainer.spawn("bash")

        shell.output.pipeTo(
            new WritableStream({
            write(data) {
                //@ts-ignore
                terminal.write(data)
            }
            })
        )

        const writer = shell.input.getWriter()

        terminal.onData((data: any) => {
            writer.write(data)
        })

        webContainer.on("server-ready", (port, url) => {
            set({url})
        })

    }
}))