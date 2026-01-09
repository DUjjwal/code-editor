import { File, Folder } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useFile, useTree } from "@/store/fileStore"
import { FilePlus, FolderPlus, PencilLine, Trash,Ellipsis, EllipsisVertical } from "lucide-react"

import axios from "axios"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { error } from "@/lib/error"

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

import { Input } from "./ui/input"
import { useState } from "react"

const handleRename = async ({item, newName}: {item: any, newName: string}) => {
    try {
        const fileId = item.id

        await axios.post("http://localhost:4000/playground/rename", {
            fileId,
            name: newName
        }, {withCredentials: true})

        

    }catch(err) {
        console.log(err)
        error("File rename failed")
    }
    
}

const handleDelete = async ({item}: {item: any}) => {
    try {
        const fileId = item.id

        await axios.post("http://localhost:4000/playground/deletefile", {
            fileId
        }, {withCredentials: true})

        

    }catch(err) {
        console.log(err)
        error("File delete failed")
    }
    
}

import { Button } from "./ui/button"
import { useParams } from "react-router-dom"

export function AppSidebar({}: { }) {

    //@ts-ignore
    const data2 = useTree((state) => state.data)

    
    
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>File Explorer</SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
                {data2.items.map((subItem: any, idx: any) => (
                    <Tree item={subItem} key={idx}/>
                    
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}


function Tree({ item }: { item: any}) {
 
    const { id } = useParams<{ id: string}>()

    
    const [open, setOpen] = useState<boolean>(false)

    const [newName, setNewName] = useState<string>(item.name)
    // item.id=123;

    //@ts-ignore
    const name = useFile((state) => state.name)
    //@ts-ignore
    const setActive = useFile((state) => state.setActive)

    //@ts-ignore
    const updateData = useTree((state) => state.updateData)
  
  if (item.type === "FILE") {
    return (
        <>
      <SidebarMenuButton
        className="data-[active=true]:bg-transparent flex justify-between items-center"
        isActive={name === (item.name)}
        onClick={() => setActive({name: item.name, content: item.content, id: item.id})}
      >
        <div className="flex gap-x-2">
                <File className="w-4 h-4"/>
                {item.name}
      

        </div>
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Ellipsis className="hover:bg-gray-200 hover:rounded-sm w-4 h-4"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuItem className="text-foreground" onClick={() => {
                        console.log("clicked")
                        setOpen(true)
                    }}>
                        <PencilLine/>
                        Rename
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={async () =>  {
                        await handleDelete({item})
                        await updateData({id})
                    }}>
                        <Trash/>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuButton>
      <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>
                    Rename {item.type.toLowerCase()}
                </DialogTitle>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)}></Input>
                <Button variant="outline" onClick={async () => {
                    if(newName === "") {
                        error("File name is empty")
                    }
                    else {
                        await handleRename({item, newName})
                        await updateData({id})
                        setOpen(false)
                    }
                }}>Save Changes</Button>
            </DialogContent>
        </Dialog>
    
        </>
    )
  }

  return (
    <>
        <SidebarMenuItem>
        <Collapsible
            className="group/collapsible "
            // defaultOpen={name === "components" || name === "ui"}
        >
            <CollapsibleTrigger asChild>
            <SidebarMenuButton className="flex justify-between items-center">
                {/* <ChevronRight className="transition-transform" /> */}
                <div className="flex gap-x-2">
                    <Folder className="w-4 h-4"/>
                    {item.name}

                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <EllipsisVertical className="hover:bg-gray-200 hover:rounded-sm w-4 h-4"/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <FilePlus/>
                                New File
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <FolderPlus/>
                                New Folder
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="text-foreground" onClick={() => setOpen(true)}>
                                <PencilLine/>
                                Rename
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={async () =>  {
                                await handleDelete({item})
                                await updateData({id})
                            }}>
                                <Trash/>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                
            </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
            <SidebarMenuSub >
                {item.items.map((subItem: any, index: any) => (
                <Tree key={index} item={subItem}/>
                ))}
            </SidebarMenuSub>
            </CollapsibleContent>
        </Collapsible>
        </SidebarMenuItem>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>
                    Rename {item.type.toLowerCase()}
                </DialogTitle>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)}></Input>
                <Button variant="outline" onClick={async () => {
                    if(newName === "") {
                        error("File name is empty")
                    }
                    else {
                        await handleRename({item, newName})
                        await updateData({id})
                        setOpen(false)
                    }
                }}>Save Changes</Button>
            </DialogContent>
        </Dialog>
    
    </>
  )
}
