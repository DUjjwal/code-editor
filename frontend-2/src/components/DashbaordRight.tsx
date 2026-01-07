import { Button } from "./ui/button"
import {Plus, ArrowDown} from "lucide-react"
import type { Dispatch, SetStateAction } from "react"

import { Input } from "./ui/input"
import { error, success } from "@/lib/error"
import axios from "axios"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


import { Dropdown } from "./Dropdown"

interface project {
    id: string,
    title: string,
    template: string,
    createdAt: string,
    username: string,
    picture?: string,
    starred: boolean
}

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { usePlayground } from "@/store/playgroundStore"

const items = [
    {
        title: "React",
        desc: "A JavaScript library for bulding user interfaces with component-based architecture",
        tage: ["UI", "Frontend", "JavaScript"],
        url: "../../../public/react.svg",
    },
    {
        title: "Next.js",
        desc: "The React framework for production with server-side rendering and static site generation",
        tage: ["React", "SSR", "Fullstack"],
        url: "../../../public/nextjs.svg",
    },
    {
        title: "Express",
        desc: "Fast, unopinionated, minimalist web framework for Node.js to build APIs and web applications",
        tage: ["Node.js", "API", "Backend"],
        url: "../../../public/express.svg"
    },
    {
        title: "Vue.js",
        desc: "Progressive JavaScript framework for building user interfaces with an approachable learning curve",
        tage: ["UI", "Frontend", "JavaScript"],
        url: "../../../public/vue.svg"
    },
    {
        title: "Hono",
        desc: "Fast, lightweight, built on Web Standards, Support for any JavaScript runtime.",
        tage: ["Node.js", "TypeScript", "Backend"],
        url: "../../../public/hono.svg"
    },
    {
        title: "Angular",
        desc: "Angular is a web framework that empowers developers to build fast, reliable applications.",
        tage: ["React", "FullStack", "JavaScript"],
        url: "../../../public/angular.svg"
    }
]



export function DashboardRight() {

    const [selected, setSelected] = useState<string>("")
    const [name, setName] = useState<string>("")

    const [open,setOpen] = useState(false)

    //@ts-ignore
    const projects: project[] = usePlayground((state) => state.projects)
    //@ts-ignore
    const updateProjects = usePlayground((state) => state.updateProjects)


    // const [projects, setProjects] = useState<project[]>([])

    // const updateProjects = async () => {
    //     try {
    //         const res = await axios.get("http://localhost:4000/playground/all", {withCredentials: true})
    //         console.log(res.data.playgrounds)

    //         let tempProjects: project[] = []

    //         res.data.playgrounds.forEach((item: any) => {
    //             tempProjects.push({
    //                 id: item.id,
    //                 title: item.title,
    //                 template: item.template,
    //                 createdAt: item.createdAt,
    //                 username: item.user.name,
    //                 picture: item.user.picture,
    //                 starred: item.isMarked
    //             })
    //         })

    //         tempProjects.sort((a, b) => a.title.localeCompare(b.title))
    //         console.log(tempProjects)

    //         setProjects(tempProjects)

    //     }catch(err) {
    //         error("Error fetching projects, Please Refersh")
    //         return
    //     }
        

    // }

    const handleSubmit = async () => {
        if(name === "") {
            error("Enter Project Name")
            return
        }
        else if(selected === "") {
            error("Select a template")
            return
        }

        let template = ""
        if(selected === "React") {
            template = "REACT"
        }else if(selected === "Next.js") {
            template = "NEXTJS"
        }else if(selected === "Express") {
            template = "EXPRESS"
        }else if(selected === "Vue.js") {
            template = "VUE"
        }else if(selected === "Hono") {
            template = "HONO"
        }else if(selected === "Angular") {
            template = "ANGULAR"
        }

        try {
            await axios.post("http://localhost:4000/playground/create", {
                template, title: name
            }, {withCredentials: true})

            
            success("Project Created Successfully")
            updateProjects()
            setOpen(false)
            
        }catch(err) {
            console.log(err)
            error("Error occured retry")
            setOpen(false)
        }

        

    }

    

    useEffect(() => {
        updateProjects()
    }, [])

    const color: any = {}
    color["REACT"] = "text-violet-600 border-violet-600"
    color["NEXTJS"] = "text-pink-600 border-pink-600"
    color["ANGULAR"] = "text-lime-600 border-lime-600"
    color["EXPRESS"] = "text-sky-600 border-sky-600"
    color["VUE"] = "text-lime-600 border-lime-600"
    color["HONO"] = "text-amber-600 border-amber-600"


    return (
        <div className="w-full h-screen">
            <div className="w-full h-[20%] flex justify-center items-center p-2 gap-x-2">
                <div className="w-full flex-1 h-[100%] flex justify-center">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger  className="flex-1 h-[100%] flex justify-center">
                            <Button variant="outline" className="flex-1 h-[100%] flex justify-center">
                                <div className="h-10 w-10 flex justify-center items-center">
                                    <Plus className="outline rounded-sm outline-1"/>

                                </div>
                                <div className="flex flex-col items-start">
                                <p className="text-xl tracking-tight text-foreground">Add New</p>
                                <p className="text-sm font-normal text-muted-foreground">Create a new playground</p>
                                </div>
                                
                            </Button>

                        </DialogTrigger>
                        <DialogContent className="w-[60vw] h-[80vh] max-w-none overflow-auto">
                            <DialogTitle className="text-2xl text-foreground">
                                Configure your Project
                            </DialogTitle>
                            <DialogTitle>
                                Project Name
                            </DialogTitle>
                            <Input onChange={(e) => setName(e.target.value)}></Input>
                            <DialogTitle className="text-foreground">
                                Select a Template
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Choose a template to create your playground
                            </DialogDescription>
                            <div className="flex flex-wrap justify-center w-full gap-4">
                                {items.map((item, i) => (
                                    <Card key={i} title={item.title} desc={item.desc} tags={item.tage} url={item.url} selected={selected} setSelected={setSelected}/>
                                ))}
                            </div>
                            <div className="w-full flex justify-center">
                                <Button variant="outline" className="w-[20%]" onClick={handleSubmit}>Create Project</Button>

                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="flex-1 h-[100%] flex justify-center">
                    <Button variant="outline" className="flex-1 h-[100%] flex justify-center">
                        <div className="h-10 w-10 flex justify-center items-center">
                            <ArrowDown className="outline rounded-sm outline-1"/>

                        </div>
                        <div className="text-left">
                            <div className="flex flex-col items-start">
                            <p className="text-xl tracking-tight text-foreground">Open Github Repository</p>
                            <p className="text-sm font-normal text-muted-foreground">Work with your repositories in our editor</p>
                            </div>
                        </div>
                    </Button>

                </div>
            </div>
            <div className="pl-20 pr-20 pt-10 w-full">

                {
                    projects.length > 0 ? 
                        <Table className="w-full">
                            <TableHeader className="w-full">
                                <TableRow className="text-left">
                                <TableHead className="w-[45%]">Project</TableHead>
                                <TableHead className="w-[10%]">Template</TableHead>
                                <TableHead className="w-[20%]">Created</TableHead>
                                <TableHead className="w-[20%] text-left">User</TableHead>
                                <TableHead className="w-[5%]">Actions</TableHead>
                                
                                </TableRow>
                            </TableHeader>
                            <TableBody className="text-left">
                                {projects.map((project, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">{project.title}</TableCell>
                                    <TableCell>
                                        
                                        <div className={`flex justify-center items-center border-2 rounded-xl w-auto font-semibold ${color[project.template]}`}>
                                            {project.template}
                                    
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(project.createdAt).toLocaleString('en-US', {
                                            month: 'long',
                                            day: "2-digit",
                                            year: "2-digit"
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-start items-center gap-x-1">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={project.picture}></AvatarImage>
                                                <AvatarFallback>
                                                    {project.username[0].toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            {project.username}
                                        </div></TableCell>
                                    <TableCell className="text-center">
                                        <Dropdown id={project.id} call={updateProjects} starred={project.starred}/>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table> : 
                        <p className="text-sm text-center font-normal text-muted-foreground">No Project Found</p>

                }
                

            </div>
        </div>
    )
}

function Card({title, desc, tags, url, selected, setSelected}: {url: string, title: string, desc: string, tags: string[], selected: string, setSelected: Dispatch<SetStateAction<string>>}) {
  return (
    <div className={`w-[48%] h-[200px] rounded-lg flex items-center justify-center ${selected === title ? "border border-gray-500" : "" } hover:border hober:bg-gray-500`} onClick={() => setSelected(title)}>
        <div className="w-[30%] flex justify-center">
            <img src={url} className="w-20 h-20" />
        </div>
        <div className="w-[70%] p-1">
            <h1 className="text-lg text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{desc}</p>
            <div className="flex items-center justify-start pt-2">
                {tags.map((item) => <div className="border border-muted text-sm p-1 rounded-xl text-foreground">{item}</div>)}
            </div>
        </div>
    </div>
  )
}