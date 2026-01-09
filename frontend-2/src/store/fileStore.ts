import { create } from "zustand";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { error } from "@/lib/error";


export const useFile = create((set) => ({
    name: "",
    content: "",
    id: 0,
    setActive: ({name, content, id}: {name: string, content: string, id: number}) => {
        set({name, content, id})
    }
}))

export const useTree = create((set) => ({
    data: {},
    updateData: async ({id}: {id: string}) => {

        try {
            const res2 = await axios.post("http://localhost:4000/playground/files", {
                id: id
            }, {withCredentials: true})
    
            // console.log(res2.data.data)
            set({data: res2.data.data})

        }catch(err) {
            console.log(err)
            error("Error loading files redirecting to dashboard")
            // navigate("/dashboard")
        }
    }
}))