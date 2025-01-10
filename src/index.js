// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

// config .env
dotenv.config({
    path: './.env'
})

const Port = process.env.PORT || 3000

// connecting db
connectDB()
.then(() => {
    app.listen(Port, () => {
        console.log(`server is ruining at port : ${Port} `);
    })
    app.on("error", (error) => {
        console.log("SERVER CONNECTION FAILED : ", error);
        process.exit(1)
    })
})
.catch((error) => {
    console.log("MMONGO DB CONNECTION FAILED !!", error);
})

