import { create } from "zustand";


export const useFile = create((set) => ({
    name: "",
    content: "",
    id: 0,
    setActive: ({name, content, id}: {name: string, content: string, id: number}) => {
        set({name, content, id})
    }
}))