import { validationResult } from "express-validator";
import { Wrapper } from "../Utils/AsyncWrapper.js";
import clientInstance, {
  DealCollection,
  DealerDb,
  soldCollection,
  userDb,
  vehicleCollection,
} from "../DatabaseConfig/ConnectToDb.js";

import { DeleteFile } from "../Utils/DeleteFile.js";
import { ObjectId } from "mongodb";


export const AddCar = Wrapper(async (req, res) => {
  if (req.header("user_type") !== "dealers") {
    await DeleteFile(req.file);
    return res
      .status(400)
      .json({
        success: 0,
        errorType: "WrongType",
        msg: "Add can be access by dealer only",
      });
  }
  const Errors = validationResult(req);
  if (!Errors.isEmpty()) {
    await DeleteFile(req.file);
    return res
      .status(400)
      .json({ success: 0, errorType: "ClientSide", msg: Errors.mapped() });
  }
  //values are correct
  const { name, type, model } = req.body;
  let info = JSON.parse(req.body.info);
  info = { ...info, path: req.file.path };
  const Entry = {
    type,
    name,
    model,
    car_info: info,
  };
  const session = clientInstance.startSession(); //started a session
  try {
    session.startTransaction();
    const CarRecord = await vehicleCollection.insertOne(Entry);
    const id = ObjectId.createFromHexString(req.user);
    const UpdateUser = await DealerDb.updateOne(
      { _id: id },
      { $push: { cars: CarRecord.insertedId } }
    );
    session.commitTransaction();
    return res
      .status(200)
      .json({ success: 1, data: UpdateUser, msg: "Created car" });
  } catch (error) {
    session.abortTransaction();
    return res
      .status(500)
      .json({ success: 0, errorType: "DatabaseError", msg: "Database is low" });
  }
});

export const getCarsForUser = Wrapper(async (req, res) => {
  const UnSoldCars = await DealCollection.aggregate([
    {
      $lookup: {
        from: "vehicles",
        localField: "car_id",
        foreignField: "_id",
        as: "car_detail",
      },
    },
    {
      $project: {
        car_id: 0,
      },
    },
  ]).toArray();
  return res
    .status(200)
    .json({ success: 1, data: { cars: UnSoldCars }, msg: "Cars are found" });
});

export const getCarsOfDealer = Wrapper(async (req, res) => {
  //Deals
  let DealerId = req.query?.id;
  if (req.header("user_type") === "dealers") {
    DealerId = req.user;
  }
  if (!DealerId) {
    return res
      .status(400)
      .json({ success: 0, errorType: "IdAbsent", msg: "Dealer id not given" });
  }
  //(DealerId);
  //find the dealer cars
  const records = await DealerDb.aggregate([
    { $match: { _id: ObjectId.createFromHexString(DealerId) } },
    { $unwind: "$cars" },
    {
      $lookup: {
        from: "vehicles", //other table name
        localField: "cars", //current table field
        foreignField: "_id", //other table field
        as: "car_details", //project it into new field name
      },
    },
    {
      $group: {
        _id: "$_id",
        DealerCars: { $push: { $arrayElemAt: ["$car_details", 0] } },
      },
    },
  ]).toArray();
  return res
    .status(200)
    .json({ success: 1, data: { records }, msg: "Cars details" });
});
export const getDealsOfDealer = Wrapper(async (req, res) => {
  let DealerId = req.query?.id;
  //(DealerId)

  if (req.header("user_type") === "dealers") {
    DealerId = req.user;
  }
  //(DealerId,req.user)
  if (!DealerId) {
    return res
      .status(400)
      .json({ success: 0, errorType: "IdAbsent", msg: "Dealer id not given" });
  }
  const records = await DealerDb.aggregate([
    { $match: { _id: ObjectId.createFromHexString(DealerId) } }, // Match the specific dealer
    { $unwind: '$deals' }, // Unwind the `deals` array
    {
      $lookup: {
        from: 'deals', // Collection to join
        localField: 'deals', // Local field in the `dealers` collection
        foreignField: '_id', // Field in the `deals` collection
        as: 'deal_details', // Project joined data into `deal_details`
      },
    },
    { $unwind: '$deal_details' }, // Unwind to work with individual deal data
    {
      $lookup: {
        from: 'vehicles', // Collection to join
        localField: 'deal_details.car_id', // Field from `deal_details` to use for the lookup
        foreignField: '_id', // Field in `vehicles` collection
        as: 'car_details', // Project joined data into `car_details`
      },
    },
    {
      $group: {
        _id: '$_id', // Regroup by the original dealer ID
        dealership_name: { $first: '$dealership_name' },
        deals: { $push: '$deal_details' }, // Retain the deals data
        cars: { $push: { $arrayElemAt: ['$car_details', 0] } }, // Get first car details from `car_details`
      },
    }]).toArray()
    
  return res
    .status(200)
    .json({ success: 1, data: { records }, msg: "Cars details" });
});
export const ViewCar = Wrapper(async (req, res) => {
  const carId = req.params?.id;
  const DealId=req.query?.DealId;
  //(DealId,"d")
  if (!carId) {
    return res
      .status(400)
      .json({ success: 0, errorType: "IdAbsent", msg: "Car Id is absent" });
  }
  const CarDetails = await vehicleCollection.findOne({
    _id: ObjectId.createFromHexString(carId),
  });
  let dealInfo=null
  if(DealId){
    const DealRecord=await DealCollection.findOne({_id:ObjectId.createFromHexString(DealId)})
    const DealerRecord=await DealerDb.findOne({deals:{$in:[ObjectId.createFromHexString(DealId)]}},{projection:{"password":0,}})
    dealInfo={Deal:DealRecord,Dealer:DealerRecord}
    
  }
  return res
    .status(200)
    .json({ success: 1, data: { CarDetails,dealInfo }, msg: "Car is found" });
});

export const EditCar = Wrapper(async (req, res) => {
  const file = req?.file;
  const Errors = validationResult(req);
  const carId = req.params.id;
  const dealId=req.query?.DealId
  if (!Errors.isEmpty()) {
    if (file) {
      await DeleteFile(file.path);
    }
    return res
      .status(400)
      .json({ success: 0, errorType: "ClientSide", msg: Errors.mapped() });
  }
  const { name, model, type,pricing,warranty } = req.body;
  let info = JSON.parse(req.body.info);
  const oldData = await vehicleCollection.findOne({
    _id: ObjectId.createFromHexString(carId),
  });
  if (file) {
    info = { ...info, path: file.path };
  } else {
    info = { ...info, path: oldData.car_info.path };
  }
  const Entry = {
    type,
    name,
    model,
    car_info: info,
  };
  //(Entry);
  //update
  const session=clientInstance.startSession()
  session.startTransaction()
  try {
    const updated = await vehicleCollection.updateOne(
      { _id: ObjectId.createFromHexString(carId) },
      { $set: Entry }
    );
    let Deal;
    if(pricing && warranty && dealId){
      Deal=await DealCollection.updateOne({_id:ObjectId.createFromHexString(dealId)},{$set:{deal_info:{pricing,warranty}}})
  
    }
    if (file) {
      //after correct updation
      await DeleteFile({ path: oldData["car_info"].path });
    }
    session.commitTransaction()
    return res
    .status(200)
    .json({ success: 1, data: { updated,Deal }, msg: "Update is done" });

  } catch (error) {
    //(error.message)
    session.abortTransaction()
    return res
      .status(500)
      .json({ success: 0, errorType: "DatabaseError", msg: "Database is low" });
  }
})
  

export const getAllDealers = Wrapper(async (req, res) => {
  const allDealers = await DealerDb.find(
    {},
    { dealership_email: 1, dealership_name: 1, dealership_location: 1 }
  ).toArray();
  return res
    .status(200)
    .json({ success: 1, data: { records: allDealers }, msg: "Dealers list" });
});

//buy
export const BuyCar = Wrapper(async (req, res) => {
  const carId = req.params?.CarId;
  const DealId = req.params?.DealId;
    const DealerId=req.params?.DealerId
  if (!carId || !DealId || !DealerId) {
    return res.status(400).json({
      success: 0,
      errorType: "NoIds",
      msg: "Car,Deal and Dealer Id must be present",
    });
  }
  //how to buy
  // add car id to vehicle_info/users and sold_vehicles/dealership
  //remove deal from deals
  const session=clientInstance.startSession()
  session.startTransaction()
  try {
    const Deal=await DealCollection.findOne({_id:ObjectId.createFromHexString(DealId)})
    const SoldEntry={
        car_id:ObjectId.createFromHexString(carId),
        vehicle_info:{...Deal["deal_info"]} //includes pricing etc
    }
    const SoldRecord=await soldCollection.insertOne(SoldEntry);
    //add soldRecord id to sold_vehicles and vehicle info of dealer and user respectively
    const updateUser=await userDb.updateOne({_id:ObjectId.createFromHexString(req.user)},{$push:{vehicle_info:SoldRecord.insertedId}})
    const updateDealer=await DealerDb.updateOne({_id:ObjectId.createFromHexString(DealerId)},{$push:{sold_vehicles:SoldRecord.insertedId},$pull:{deals:ObjectId.createFromHexString(DealId)}})
    const deleteDeal=await DealCollection.deleteOne({_id:ObjectId.createFromHexString(DealId)})
    session.commitTransaction()
    return res.status(200).json({success:1,data:{updateUser,updateDealer,SoldRecord,deleteDeal},msg:"Buy complete"})
  } catch (error) {
    //(error.message)
    session.abortTransaction()
    return res
      .status(500)
      .json({ success: 0, errorType: "DatabaseError", msg: "Database is low" });
  }
});


//Add a deal
export const AddDeal=Wrapper(async(req,res)=>{
  if(req.header("user_type")!=="dealers"){
    return res.status(400).json({success:0,errorType:"WrongType",msg:"Dealer can only push a deal"})
}
    const CarId=req.params?.CarId
    const DealerId=req.user

    if (!CarId || !DealerId) {
        return res.status(400).json({
          success: 0,
          errorType: "NoId",
          msg: "Car Id must be present",
        })
    }
    //(req.body.pricing,typeof req.body.pricing)
    const Error=validationResult(req)
    if(!Error.isEmpty()){
        return res.status(400).json({success:0,errorType:"ClientSide",msg:Error.mapped()})
    }
    const {pricing,warranty}=req.body
    const Entry={
        car_id:ObjectId.createFromHexString(CarId),
        deal_info:{
            pricing,warranty
        }
    }
    const session=clientInstance.startSession()
    session.startTransaction()
    try {
        const DealRecord=await DealCollection.insertOne({...Entry})
        //(DealerId)
        const find=await DealerDb.findOne({_id:ObjectId.createFromHexString(DealerId)})
        //(find,ObjectId.createFromHexString(DealerId))
        const updateDealer=await DealerDb.updateOne({_id:ObjectId.createFromHexString(DealerId)},{$push:{deals:DealRecord.insertedId}})
        session.commitTransaction()
        return res.status(200).json({success:1,data:{updateDealer,DealRecord},msg:"Deal is added"})
    } catch (error) {
        //(error.message,CarId,DealerId)
        session.abortTransaction()
        return res.status(400).json({success:0,errorType:"DatabaseError",msg:"Database is low"})
    }

})

export const getYourVehicles=Wrapper(async(req,res)=>{
  const id=req.user
  if(req.header("user_type")!=="users"){
    return res.status(400).json({success:0,errorType:"OnlyForClient",msg:"You must be a client to view owned cars"})
  }
  const records=await userDb.aggregate([
    {$match:{_id:ObjectId.createFromHexString(id)}},
    {$project:{password:0}},
    {$unwind:"$vehicle_info"},
    {$lookup:{
      from:"sold_vehicles",
      localField:"vehicle_info",
      foreignField:"_id",
      as:"sold_entry"
    }},
    {
      $addFields: {
        sold_entry: { $arrayElemAt: ["$sold_entry", 0] }
      }
    },
    {$lookup:{
      from:"vehicles",
      localField:"sold_entry.car_id",
      foreignField:"_id",
      as:"car_entry"
    }},
    {$lookup:{
      from:"dealers",
      localField:"vehicle_info",
      foreignField:"sold_vehicles",
      as:"Dealership"
    }}
  ]).toArray()
  return res.status(200).json({success:1,data:{records},msg:"Found"})
})

export const getSoldVehicles=Wrapper(async(req,res)=>{
  const id=req.user;
  if(req.header("user_type")!=="dealers"){
    return res.status(400).json({success:0,errorType:"OnlyForDealer",msg:"You must be a Dealer to view sold cars"})
  }
  const records=await DealerDb.aggregate([
    {$match:{_id:ObjectId.createFromHexString(id)}},
    {$project:{password:0}},
    {$unwind:"$sold_vehicles"},
    {$lookup:{
      from:"sold_vehicles",
      localField:"sold_vehicles",
      foreignField:"_id",
      as:"sold_entry"
    }},
    {
      $addFields: {
        sold_entry: { $arrayElemAt: ["$sold_entry", 0] }
      }
    },
    {$lookup:{
      from:"vehicles",
      localField:"sold_entry.car_id",
      foreignField:"_id",
      as:"car_entry"
    }},
    {$lookup:{
      from:"users",
      localField:"sold_entry._id",
      foreignField:"vehicle_info",
      as:"userInfo"
    }},
    {$project:{"userInfo.password":0}}

  ]).toArray();
  return res.status(200).json({success:1,data:{records},msg:"Found"})

})