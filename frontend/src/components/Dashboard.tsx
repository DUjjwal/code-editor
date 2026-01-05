import { useEffect, useState } from "react"
import axios from "axios"
import { error } from "@/lib/error"
import { useNavigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"

export function Dashboard() {

    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        
        const checkIfLoggedIn = async () => {
            
            try {
                const res = await axios.get("http://localhost:4000/status",{withCredentials: true})
                setLoading(false)
            }
            catch(err) {
                error("Unauthenticated user Redirecting to home page");
                setTimeout(() => navigate("/"), 2000)
            }

                
            
        }

        checkIfLoggedIn()
        

    }, [])


    if(loading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            dashboard
            
        </div>
    )
}