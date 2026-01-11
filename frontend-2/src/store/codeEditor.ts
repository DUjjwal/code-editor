import { create } from "zustand"

interface State {
    id: number,
    name: string,
    oldContent: string,
    newContent: string,
    hasUnsavedChanges: boolean
}

interface EditorState {
    activeId: number,
    count: number,
    headers: string[],
    headersId: number[],
    openFiles: Record<number, State>,
    openFile: (id: number, content: string, name: string) => void,
    removeFile: (id: number) => void,
    setActive: (id: number) => void
}

export const useEditor = create<EditorState>((set,get) => ({
    activeId: -1,
    count: 0,
    openFiles: {},
    headers: [],
    headersId: [],
    openFile: (id: number, name: string, content: string) => {
        const openFiles = get().openFiles
        const headers = get().headers
        const headersId = get().headersId
        if(!openFiles[id]) {
            set({openFiles: {
                ...openFiles, [id]: {
                    id,
                    name,
                    oldContent: content,
                    newContent: content,
                    hasUnsavedChanges: false
                }
            }, count: get().count + 1})
            set({headers: [...headers, name]})
            set({headersId: [...headersId, id]})
        }
        set({activeId: id})
    },
    removeFile: (id: number) => {
        const openFiles = get().openFiles

        delete openFiles[id]

        set({openFiles})

        const headers = get().headers
        const headersId = get().headersId
        
        const newHeaders = []
        for(let i = 0; i < headersId.length; i++)
            if(headersId[i] !== id)
                newHeaders.push(headers[i])
        
        const newHeadersId = headersId.filter(item => item !== id)

        set({headers: newHeaders, headersId: newHeadersId, count: get().count - 1})

        if(get().activeId === id)
            set({activeId: -1})
    },
    setActive: (id: number) => {
        set({activeId: id})
    }
}))