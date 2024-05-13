import express from "express"
import {upload} from "../MiddleWare/MulterConfig.js"
import { check } from "express-validator";
import { AddCar, AddDeal, BuyCar, EditCar, ViewCar, getAllDealers, getCarsForUser, getCarsOfDealer, getDealsOfDealer, getSoldVehicles, getYourVehicles } from "../Controller/vehicle.controller.js";
import { CheckFile } from "../MiddleWare/CheckFile.js";
import { parseObject } from "../Utils/parseObject.js";
const vehicleRouter=express.Router()

//endpoints for user and dealers
//endpoint 1 for dealer to add a car

// /table for info on cars
// Table cars{
//   car_id varchar [primary key, note: 'randomly generated']
//   type varchar
//   name varchar
//   model varchar
//   car_info json [note: 'store additional fields']
// }

vehicleRouter.post("/dealership/car",upload.single("car"),CheckFile,[check("name","Name must be present").isLength({min:1}),check("type","Type must be present").isLength({min:1}),check("model","Model must be present").isLength({min:1}),check("info","Car information must be object").custom(parseObject)],AddCar)
//endpoint-2 view car for users and dealers both
vehicleRouter.get("/cars",getCarsForUser)

//endpoint-3 view cars of specific dealer
vehicleRouter.get("/cars/dealership",getCarsOfDealer)

//endpoint-4 view specific car details
vehicleRouter.get("/car/:id",ViewCar)

//endpoint-5 edit a car detail for a dealer
vehicleRouter.patch("/dealership/car/:id",upload.single("profile"),[check("name","Name must be present").isLength({min:1}),check("type","Type must be present").isLength({min:1}),check("model","Model must be present").isLength({min:1}),check("info","Car information must be object").custom(parseObject),check("pricing","Pricing must be there in positive number").isInt({min:0}),check("warranty","Warranty must be in positive number").isInt({min:0})],EditCar)

//endpoiny-6 AllDealers list for user
vehicleRouter.get("/Dealers",getAllDealers)

//endpoint -7 Buy
vehicleRouter.get("/buy/:CarId/:DealerId/:DealId",BuyCar)
//endpoint-8 get Deals
vehicleRouter.get("/deals/dealership",getDealsOfDealer)
//endpoint- 9 Add Deal
vehicleRouter.post("/deal/:CarId",[check("pricing","Pricing must be there in positive number").isInt({min:0}),check("warranty","Warranty must be in positive number").isInt({min:0})],AddDeal)
//getting owned_vehicles
vehicleRouter.get("/yourVehicles",getYourVehicles)
//get sold_vehicles
vehicleRouter.get("/soldVehicles",getSoldVehicles)
export default vehicleRouter;