import { create } from "zustand";


export const useFile = create((set) => ({
    name: "",
    filename: "",
    fileExtension: "",
    fileContent: "",
    setActive: ({filename, fileExtension, fileContent}: {filename: string, fileExtension: string, fileContent: string}) => {
        set({name: filename+"."+fileExtension,filename: filename, fileExtension: fileExtension, fileContent: fileContent})
    }
}))