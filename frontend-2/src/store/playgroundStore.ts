import {create} from 'zustand'
import axios from "axios"

interface project {
    id: string,
    title: string,
    template: string,
    createdAt: string,
    username: string,
    picture?: string,
    starred: boolean,
    updatedAt: string
}

interface PlaygroundStore {
  projects: project[];
  updateProjects: () => Promise<void>;
}

export const usePlayground = create<PlaygroundStore>((set) => ({
    projects: [],
    updateProjects: async () => {
        try {
            const res = await axios.get("http://localhost:4000/playground/all", {withCredentials: true})
            console.log(res.data.playgrounds)

            let tempProjects: project[] = []

            res.data.playgrounds.forEach((item: any) => {
                tempProjects.push({
                    id: item.id,
                    title: item.title,
                    template: item.template,
                    createdAt: item.createdAt,
                    username: item.user.name,
                    picture: item.user.picture,
                    starred: item.isMarked,
                    updatedAt: item.updatedAt
                })
            })

            tempProjects.sort((a, b) => a.title.localeCompare(b.title))
            console.log(tempProjects)

            set({projects: tempProjects})

        }catch(err) {
            console.log(err)
            return
        }
    }
    
    
}))