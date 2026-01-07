import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu"

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



export function Dropdown({id, call, starred}: {id: string, call: () => Promise<void>, starred: boolean}) {

    const navigate = useNavigate()
    const [flag, setFlag] = useState<boolean>(starred)

    const handleMark = async (id: string) => {
        try {
            const res = await axios.post("http://localhost:4000/playground/mark", {
                id: id
            }, {withCredentials: true})

            setFlag((p) => !p)

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
        }catch(err) {
            console.log(err)
            error("Try again")
        }
    }

    return (
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
                    <DropdownMenuItem>
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

    )
}