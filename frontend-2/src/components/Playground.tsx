import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"
import { error } from "@/lib/error";

export function Playground() {

    const { id } = useParams<{ id: string}>()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post("http://localhost:4000/playground/data", {
                    id: id
                }, {withCredentials: true})

                console.log(res.data)
                console.log(JSON.parse(res.data.data.content))

            }catch(err) {
                console.log(err)
                error("Error fetching playground data")
            }


        }

        fetchData()
    }, [])
    return (
        <div>Playground: {id}</div>
    )
}