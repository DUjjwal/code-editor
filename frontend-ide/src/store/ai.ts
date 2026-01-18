import {create} from "zustand"

interface ai {
    flag: boolean,
    toggleFlag: () => void
}

export const useAi = create<ai>((set, get) => ({
    flag: false,
    toggleFlag: () => {
        set({flag: !(get().flag)})
    }
}))