import { create } from "zustand";
import axios from "axios"
import { error } from "@/lib/error";


export const useFile = create((set) => ({
    name: "",
    content: "",
    id: 0,
    setActive: ({name, content, id}: {name: string, content: string, id: number}) => {
        set({name, content, id})
    }
}))

interface Tree {
    data: any,
    filesMap: Record<number, string>,
    namesMap: Record<number, string>,
    updateData: ({id} : {id: string}) => Promise<boolean>
}

export const useTree = create<Tree>((set) => ({
    data: {},
    filesMap: {},
    namesMap: {},
    updateData: async ({id}: {id: string}) => {

        try {
            const res2 = await axios.post("http://localhost:4000/playground/files", {
                id: id
            }, {withCredentials: true})
    
            
            set({data: res2.data.data})
            set({filesMap: res2.data.filesMap})
            set({namesMap: res2.data.namesMap})
            return true

        }catch(err) {
            console.log(err)
            error("Error loading files redirecting to dashboard")
            return false
        }
    }
}))