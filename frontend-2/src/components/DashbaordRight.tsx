import { Button } from "./ui/button"
import {Plus, ArrowDown} from "lucide-react"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


import { Dropdown } from "./Dropdown"

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  }
]


export function DashboardRight() {
    return (
        <div className="h-screen">
            <div className="w-full h-[20%] flex justify-center items-center p-2 gap-x-2">
                <Button variant="outline" className="flex-1 h-[100%] flex justify-center">
                    <div className="h-10 w-10 flex justify-center items-center">
                        <Plus className="outline rounded-sm outline-1"/>

                    </div>
                    <div className="flex flex-col items-start">
                    <p className="text-xl tracking-tight text-foreground">Add New</p>
                    <p className="text-sm font-normal text-muted-foreground">Create a new playground</p>
                    </div>
                    
                </Button>
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
            <div className="pl-20 pr-20 pt-10 w-full">

                {
                    invoices.length > 0 ? 
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
                                {invoices.map((invoice) => (
                                <TableRow key={invoice.invoice}>
                                    <TableCell className="font-medium">{invoice.invoice}</TableCell>
                                    <TableCell>{invoice.paymentStatus}</TableCell>
                                    <TableCell>{invoice.paymentMethod}</TableCell>
                                    <TableCell>{invoice.totalAmount}</TableCell>
                                    <TableCell className="text-center">
                                        <Dropdown/>
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