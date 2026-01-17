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
    setActive: (id: number) => void,
    setContent: (value: string) => void,
    saveFile: (id: number) => void,
    initialiseFile: (id: number, name: string, content: string) => void,
    setCount: (count: number) => void,
    setHeadersId: (arr: number[]) => void
}

export const useEditor = create<EditorState>((set,get) => ({
    activeId: -1,
    count: 0,
    openFiles: {},
    headers: [],
    headersId: [],
    openFile: (id: number, name: string, content: string) => {
        console.log("open file called")
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

            const temp = [...headersId, id]
            localStorage.setItem("headersId", JSON.stringify(temp))
        }
        else {
            localStorage.setItem("headersId", JSON.stringify(get().headersId))
        }
        set({activeId: id})

        localStorage.setItem("activeId", JSON.stringify(id))
    },
    removeFile: (id: number) => {
        console.log("id-", id)
        const openFiles = get().openFiles
        const activeId = get().activeId

        console.log(activeId)

        if(id in openFiles)
            delete openFiles[id]

        set({openFiles})

        const headers = get().headers
        const headersId = get().headersId
        
        const newHeaders = []
        for(let i = 0; i < headersId.length; i++)
            if(headersId[i] !== id)
                newHeaders.push(headers[i])
        
        const newHeadersId = headersId.filter(item => item != id)

        if(newHeadersId[0] != -1)
            localStorage.setItem("headersId", JSON.stringify(newHeadersId))
        else
            localStorage.removeItem("headersId")
        
        

        set({headers: newHeaders, headersId: newHeadersId, count: get().count - 1})

        if(activeId == id) {
            set({activeId: -1})
            localStorage.removeItem("activeId")
        }
        else
            localStorage.setItem("activeId", JSON.stringify(activeId))

        
    },
    setActive: (id: number) => {
        set({activeId: id})
        localStorage.setItem("activeId", JSON.stringify(id))
    },
    setContent: (value: string) => {
        const openFiles = get().openFiles

        const content = openFiles[get().activeId].newContent
        openFiles[get().activeId].newContent = value

        openFiles[get().activeId].hasUnsavedChanges = (value !== content) 
        set({openFiles})
    },
    saveFile: (id: number) => {
        const openFiles = get().openFiles

        openFiles[id].oldContent = openFiles[id].newContent

        openFiles[id].hasUnsavedChanges = false
        
        set({openFiles})
        

    },
    initialiseFile: (id: number, name: string, content: string) => {
        const openFiles = get().openFiles

        openFiles[id] = {
            oldContent: content,
            newContent: content,
            name,
            hasUnsavedChanges: false,
            id
        }
        
        set({headers: [...get().headers, name]})

        set({openFiles})
    },
    setCount: (count: number) => {
        set({count})
    },
    setHeadersId: (arr: number[]) => {
        set({headersId: arr})
    }

}))