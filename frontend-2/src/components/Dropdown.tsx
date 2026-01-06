import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import {
  MoreVertical,
  StarOff,
  Eye,
  ExternalLink,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react"



export function Dropdown() {
    return (
        <DropdownMenu>
            
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 focus-visible:ring-0 focus-visible:ring-offset-0">
                <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                    <StarOff className="mr-2 h-4 w-4" />
                    Remove Favorite
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    Open Project
                    </DropdownMenuItem>

                    <DropdownMenuItem>
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

                    <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy URL
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                

                <DropdownMenuSeparator />

                <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}