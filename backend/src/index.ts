import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { googleAuth } from "./lib/googleJWT.js"

const app = express()

app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())

app.post("/api/auth/google", googleAuth)

app.listen(4000, () => {
    console.log(`Server is running at port 4000`)
})