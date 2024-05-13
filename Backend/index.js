import express from "express"
import dotenv from "dotenv"
dotenv.config()

import { connectWithMongo } from "./DatabaseConfig/ConnectToDb.js"
import UserRouter from "./API/user.api.js"
import vehicleRouter from "./API/vehicle.api.js"
import cors from "cors"
import { DecodeToken } from "./Utils/DecodeToken.js"

const app=express()
const Port = process.env.PORT || 8000
app.use(cors())
app.use(express.json())
app.use("/api/auth",UserRouter)
app.use("/api/vehicle",DecodeToken,vehicleRouter)
app.use("/UploadFolder",express.static("UploadFolder"))
app.listen(Port,async()=>{
    //("Server is started at http://localhost:"+Port)
    await connectWithMongo()
})