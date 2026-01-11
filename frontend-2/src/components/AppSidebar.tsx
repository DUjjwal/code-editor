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
import { FilePlus, FolderPlus, PencilLine, Trash,Ellipsis, EllipsisVertical, Plus } from "lucide-react"

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

import { Button } from "./ui/button"
import { useParams } from "react-router-dom"
import { useEditor } from "@/store/codeEditor"

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

        const {removeFile} = useEditor.getState()

        removeFile(item.id)

        

    }catch(err) {
        console.log(err)
        error("File delete failed")
    }
    
}

const handleFile = async ({name, parentId, type, playgroundId}: {name: string, parentId: number | null,type: string, playgroundId: string}) => {

    try {
        await axios.post("http://localhost:4000/playground/createfile",{
            name,
            parentId,
            type,
            playgroundId
        }, {withCredentials: true})

    }catch(err) {
        console.log(err)
        error(`${type} creation failed`)
    }


}



export function AppSidebar() {

    //@ts-ignore
    const data2 = useTree((state) => state.data)

    const [fileName, setFileName] = useState<string>("")
    const [type, setType] = useState<string>("")
    const [open, setOpen] = useState<boolean>(false)

    //@ts-ignore
    const updateData = useTree((state) => state.updateData)

    const { id } = useParams<{ id: string}>()
  
    
  return (
    <>
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
            <SidebarGroupLabel className="flex justify-between items-center">
                File Explorer
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Plus className="w-4 h-4 hover:bg-gray-100 hover:rounded-sm"/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => {
                                setType("FILE")
                                setOpen(true)
                            }}>
                                <FilePlus/>
                                New File
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                setType("FOLDER")
                                setOpen(true)
                            }}>
                                <FolderPlus/>
                                New Folder
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarGroupLabel>
          
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
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogTitle>
                {type} Name
            </DialogTitle>
            <Input value={fileName} onChange={(e) => setFileName(e.target.value)}></Input>
            <Button variant="outline" onClick={async () => {
                if(fileName === "") {
                    error(`${type} name is empty`)
                }
                else {
                    await handleFile({name: fileName, parentId: data2.id, type, playgroundId: id!})
                    if(id)
                        await updateData({id})
                    setOpen(false)
                }
            }}>Create {type}</Button>
        </DialogContent>
    </Dialog>
    </>
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
    const openFile = useEditor((state) => state.openFile)


    const [open2, setOpen2] = useState<boolean>(false)
    const [fileName, setFileName] = useState<string>("")
    const [type, setType] = useState<string>("")
  
  if (item.type === "FILE") {
    return (
        <>
      <SidebarMenuButton
        className="data-[active=true]:bg-transparent flex justify-between items-center"
        isActive={name === (item.name)}
        onClick={() => {
            setActive({name: item.name, content: item.content, id: item.id})

            openFile(item.id, item.name, item.content)
        }}
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
                        if(id)
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
                        if(id)
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
                            <DropdownMenuItem onClick={() => {
                                setType("FILE")
                                setOpen2(true)
                            }}>
                                <FilePlus/>
                                New File
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                setType("FOLDER")
                                setOpen2(true)
                            }}>
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
                                if(id)
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
                        if(id)
                        await updateData({id})
                        setOpen(false)
                    }
                }}>Save Changes</Button>
            </DialogContent>
        </Dialog>
        
        <Dialog open={open2} onOpenChange={setOpen2}>
            <DialogContent>
                <DialogTitle>
                    {type} Name
                </DialogTitle>
                <Input value={fileName} onChange={(e) => setFileName(e.target.value)}></Input>
                <Button variant="outline" onClick={async () => {
                    if(fileName === "") {
                        error(`${type} name is empty`)
                    }
                    else {
                        await handleFile({name: fileName, parentId: item.id, type, playgroundId: id!})
                        if(id)
                        await updateData({id})
                        setOpen2(false)
                    }
                }}>Create {type}</Button>
            </DialogContent>
        </Dialog>
    </>
  )
}

