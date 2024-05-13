import express from "express"
import { upload } from "../MiddleWare/MulterConfig.js"
import { check, query } from "express-validator"
import {  Login, getUser, signupForDealers, signupForUsers } from "../Controller/user.controller.js"
import { DecodeToken } from "../Utils/DecodeToken.js"
const UserRouter=express.Router()

//Endpoint -1 Signup
UserRouter.post("/user",upload.single("profile"),[check("email","Email is not valid").isEmail(),check("location","Location is not present").exists(),check("info","Info must be present").exists(),check("password","Password must be of atleast 6 characters long").isLength({min:6})],signupForUsers)


// Endpoint-2 Dealers signup
UserRouter.post("/dealer",upload.single("profile"),[check("email","Email is not valid").isEmail(),check("location","Location is not present").exists(),check("info","Info must be present").exists(),check("password","Password must be of atleast 6 characters long").isLength({min:6}),check("name","Name must be of atleast 3 characters long").isLength({min:3})],signupForDealers)

//Endpoint-3 Login
UserRouter.get("/login",[query("email","Email is not valid").isEmail(),query("password","Password must be of atleast 6 characters").isLength({min:6})],Login)

//Endpoint -4 Get User
UserRouter.get("/user_dealer",DecodeToken,getUser)



export default UserRouter