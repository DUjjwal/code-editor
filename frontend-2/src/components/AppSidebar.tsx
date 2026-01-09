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
import { useFile } from "@/store/fileStore"
import { FilePlus, FolderPlus, PencilLine, Trash,Ellipsis, EllipsisVertical } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AppSidebar({ data2 }: { data2: any }) {

  data2 = JSON.parse(data2)

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
 

    // item.id=123;

    //@ts-ignore
    const name = useFile((state) => state.name)
    //@ts-ignore
    const setActive = useFile((state) => state.setActive)
  
  if (item.type === "FILE") {
    return (
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
                    <DropdownMenuItem className="text-foreground">
                        <PencilLine/>
                        Rename
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Trash/>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuButton>
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
                            <DropdownMenuItem className="text-foreground">
                                <PencilLine/>
                                Rename
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
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
        
    
    </>
  )
}
