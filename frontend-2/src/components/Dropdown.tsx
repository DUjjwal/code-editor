import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "./ui/input"

import axios from "axios"
import {error, success} from "@/lib/error"

import { Button } from "@/components/ui/button"
import {
  MoreVertical,
  StarOff,
  Star,
  Eye,
  ExternalLink,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { DialogClose } from "@radix-ui/react-dialog"

const handleDelete = async (id: string) => {
    try {
        const res = await axios.post("http://localhost:4000/playground/delete", {
            id: id
        }, {withCredentials: true})

        success("Project deleted")
    }catch(err) {
        console.log(err)
        error("Delete Failed")
    }
}

const handleDuplicate = async (id: string) => {
    try {
        const res = await axios.post("http://localhost:4000/playground/duplicate", {
            id: id
        }, {withCredentials: true})

        success("Project duplicated")
    }catch(err) {
        console.log(err)
        error("Duplicate Failed")
    }
}



export function Dropdown({id, call, starred, name2, desc2}: {id: string, call: () => Promise<void>, starred: boolean, name2: string, desc2: string}) {

    const navigate = useNavigate()
    const [flag, setFlag] = useState<boolean>(starred)

    const [name, setName] = useState<string>(name2)
    const [desc, setDesc] = useState<string>(desc2)

    const [open, setOpen] = useState<boolean>(false)

    const handleMark = async (id: string) => {
        try {
            const res = await axios.post("http://localhost:4000/playground/mark", {
                id: id
            }, {withCredentials: true})

            setFlag((p) => !p)
            call()

        }catch(err) {
            console.log(err)
            error("Try again")
        }
    }

    const handleUnmark = async (id: string) => {
        try {
            const res = await axios.post("http://localhost:4000/playground/unmark", {
                id: id
            }, {withCredentials: true})

            setFlag((p) => !p)
            call()
        }catch(err) {
            console.log(err)
            error("Try again")
        }
    }

    
    const handleEdit = async () => {
        try {

            if(name === "") {
                error("Name is empty")
                return
            }


            await axios.post("http://localhost:4000/playground/edit",{
                title: name,
                description: desc,
                id
            },{withCredentials: true})

            success("Edited Successfully")
            call()
            
        }catch(err) {
            console.log(err)
            error("Try Again ")
            
        }
        setOpen(false)
    }



    return (
        <>
            <DropdownMenu>
            
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8 focus-visible:ring-0 focus-visible:ring-offset-0">
                    <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuGroup>
                        {
                            flag ? <DropdownMenuItem onClick={() => handleUnmark(id)}>
                        <StarOff className="mr-2 h-4 w-4" />
                        Remove Favorite
                        </DropdownMenuItem> : <DropdownMenuItem onClick={() => handleMark(id)}>
                        <Star className="mr-2 h-4 w-4" />
                        Add to Favorite
                        </DropdownMenuItem>
                        }
                        

                        <DropdownMenuItem onClick={() => {
                            navigate(`/playground/${id}`)
                        }}>
                        <Eye className="mr-2 h-4 w-4" />
                        Open Project
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => {
                            window.open(`/playground/${id}`, "_blank", "noopener,noreferrer")
                        }}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open in New Tab
                        </DropdownMenuItem>

                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        
                                
                        <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault()
                            setOpen(true)
                        }} className="w-[100%]">
                            <Pencil className="mr-2 h-4 w-4" />
                                
                            Edit Project

                        </DropdownMenuItem>

                                
                            

                        <DropdownMenuItem onClick={async () => {
                            await handleDuplicate(id)
                            await call()
                        }}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={async () => {
                            await navigator.clipboard.writeText(`http://localhost:4000/playground/${id}`)
                            success("Project Url Copied")
                        }}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy URL
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={async () => {
                        await handleDelete(id)
                        await call()
                    }}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Project
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-[60vw] h-[50vh] max-w-none overflow-auto">
                    <DialogTitle className="text-2xl text-foreground">
                        Edit Project
                    </DialogTitle>
                    <DialogTitle>
                        Project Name
                    </DialogTitle>
                    <Input value={name} onChange={(e) => setName(e.target.value)}></Input>
                    <DialogTitle>
                        Project Description
                    </DialogTitle>
                    <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Optional"></Input>
                    <DialogClose>
                        <Button onClick={handleEdit}>Save Changes</Button>

                    </DialogClose>
                    
                </DialogContent>
            </Dialog>
        </>
        
    )
}