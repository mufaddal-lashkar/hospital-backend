import cookieParser from "cookie-parser";
import express from "express"
import cors from "cors"
  
const app = express()

// cors, express, cookie-parser configure
app.use(cors({ 
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

app.use(cookieParser())



// import routes
import userRouter from "../src/routes/user.route.js"
import managerRouter from "../src/routes/manager.route.js"
import pantryRouter from "../src/routes/pantry.route.js"

// declerations of routes
app.use("/api/v1/users", userRouter)
app.use("/api/v1/manager", managerRouter)
app.use("/api/v1/pantry", pantryRouter)


export { app }