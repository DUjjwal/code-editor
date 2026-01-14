import { create } from "zustand";

interface Web {
    preview: string,
    setPreview: (str: string) => void
}


export const useWebcontainer = create<Web>((set, get) => ({
    preview: "No Inititialsed",
    setPreview: (str: string) => {
        set({preview: str})
    }
}))