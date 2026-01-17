import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import axios from "axios"
import {error} from "@/lib/error"

export function Playground() {
    const [searchParams, setSearchParams] = useSearchParams()

    const token = searchParams.get("token")

    const { id } = useParams()

    const [loading, setLoading] = useState<boolean>(true)

    

    useEffect(() => {

        const fn = async () => {
    
            try {
                
                if(token) {
                    const res = await axios.get("http://localhost:4000/auth/verify", {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    })
                    
                    sessionStorage.setItem("access-token", JSON.stringify(res.data.token))
                    
                    setLoading(false) 

                    searchParams.delete("token");
                    setSearchParams(searchParams, { replace: true });


        
                }else {
                    
                    //checking sesion storage for access token
                    const access = sessionStorage.getItem("access-token")
                    
                    if(!access) {
                        //redirect to dashboard
                        error("Access token not found redirect to dashboard")
                        setTimeout(() => window.location.href = "http://localhost:5173/dashboard", 2000)
                        
                    }
                    else {
                        const status = await axios.get("http://localhost:4000/status", {
                            headers: {
                                'Authorization': `Bearer ${access}`,
                            }
                        })

                        setLoading(false)
                    }

                }

            }catch(err) {
                console.log(err)
                error("Unauthenticated access redirect to dashboard")
                setTimeout(() => window.location.href = "http://localhost:5173/dashboard", 2000)
                    
            }

        }

        fn()

    }, [])

    if(loading)
        return  <div>Loading...</div>

    return (
        <>
        <div>
            <p>token = {token}</p>
            <p>id = {id}</p>
        </div>
        </>
    )
}