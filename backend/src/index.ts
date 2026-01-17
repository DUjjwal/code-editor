import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { googleAuth } from "./lib/googleJWT.js"
import { authMiddleware, status } from "./lib/middleware.js"
import router from "./routes/playgroundRoutes.js"
import authRouter from "./routes/authRoutes.js"

const app = express()

app.use(express.json())
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow non-browser tools like postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

app.use(cookieParser())

app.post("/api/auth/google", googleAuth)
app.get("/status", status)

app.use("/playground", router)
app.use("/auth", authRouter)


app.listen(4000, () => {
    console.log(`Server is running at port 4000`)
})