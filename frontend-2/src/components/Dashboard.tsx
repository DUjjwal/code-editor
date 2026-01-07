import { SidebarProvider } from "@/components/ui/sidebar"


import { Spinner } from "./ui/spinner"



import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { error } from "@/lib/error"

import { DashboardLeft } from "./DashboardLeft"
import { DashboardRight } from "./DashbaordRight"




export function Dashboard() {

    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        
        const checkIfLoggedIn = async () => {
            
            try {
                await axios.get("http://localhost:4000/status",{withCredentials: true})
                setLoading(false)
            }
            catch(err) {
                error("Unauthenticated user Redirecting to home page");
                setTimeout(() => navigate("/"), 2000)
            }

                
            
        }

        checkIfLoggedIn()
        

    }, [])

    

    useEffect(() => {
        if(loading === false) {
            const func = async () => {
                const res = await axios.get("http://localhost:4000/playground/all",{withCredentials: true})
                console.log(res.data)
            }

            func()
        }
    }, [loading])


    if(loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <Spinner/>
            </div>
        )
    }

    return (
        <div className="w-full h-screen flex">
            <div className="h-screen w-[18%] border">
              <SidebarProvider>
                <DashboardLeft/>
              </SidebarProvider>              
            </div>
            <div className="h-screen w-[82%] border">
              <DashboardRight/>
            </div>
        </div>
    )
}