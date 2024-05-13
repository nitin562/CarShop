import { validationResult } from "express-validator";
import { Wrapper } from "../Utils/AsyncWrapper.js";
import clientInstance, { DealerDb, userDb } from "../DatabaseConfig/ConnectToDb.js";
import bcrypt from "bcryptjs";
import { GenToken } from "../Utils/GenToken.js";
import { ObjectId } from "mongodb";
import { DeleteFile } from "../Utils/DeleteFile.js";




//USer Schema
// {
//     user_email:string,
//     user_location:string,
//     user_info:json,
//     vehicle_info:[],
//     password:string
// }
//Signup controller
export const signupForUsers = Wrapper(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await DeleteFile(req?.file)
   

    return res
      .status(400)
      .json({ success: 0, errorType: "ClientSide", msg: errors.mapped() });
  }
  //extract field data
  const { email, password, location } = req.body;
  let info=req.body.info
  try {
    info=JSON.parse(info)
  } catch (error) {
    return res
      .status(400)
      .json({ success: 0, errorType: "ClientSide", msg: {info:{msg:"Info must be object"}} });
  }
  
  const file = req?.file;
  if (file) {
    info = { ...info, path: file.path };
  }
  //check the existence of email

  const isExist = await userDb.findOne({ user_email: email });
  if (isExist) {
    await DeleteFile(req?.file)

    return res
      .status(400)
      .json({
        sucess: 0,
        errorType: "ExistedAccount",
        msg: "Account is already present",
      });
  }
  //now hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const Entry = {
    user_email: email,
    user_location: location,
    password: hashPassword,
    vehicle_info: [],
    user_info: info || {},
  };
  const SaveToDb = await userDb.insertOne(Entry);
  const Token = GenToken({ id: SaveToDb.insertedId });
  return res
    .status(200)
    .json({ success: 1, data: { Token,name:info.name }, msg: "AccountCreated" });
});
// Endpoint -2 DealerSignup
// Table dealership {
//     dealership_email varchar [primary key]
//     dealership_id varchar [ note: 'randomly generated']
//     dealership_name varchar
//     dealership_location varchar
//     password password_hash
//     dealership_info json [note: 'dealership private data']
//     cars list_of_id
//     deals list_of_id
//     sold_vehicles list_of_id
//   }

export const signupForDealers = Wrapper(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await DeleteFile(req?.file)
    return res
      .status(400)
      .json({ success: 0, errorType: "ClientSide", msg: errors.mapped() });
  }
  //extract field data
  const { email, password, location, name } = req.body;
  let info=req.body.info
  try {
    info=JSON.parse(info)
  } catch (error) {
    return res
      .status(400)
      .json({ success: 0, errorType: "ClientSide", msg: {info:{msg:"Info must be object"}} });
  }
  const file = req?.file;
  if (file) {
    info = { ...info, path: file.path };
  }
  //check the existence of email

  const isExist = await DealerDb.findOne({ dealership_email: email });
  if (isExist) {
    await DeleteFile(req?.file)

    return res
      .status(400)
      .json({
        sucess: 0,
        errorType: "ExistedAccount",
        msg: "Account is already present",
      });
  }
  //now hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const Entry = {
    dealership_email: email,
    dealership_location: location,
    password: hashPassword,
    dealership_name: name,
    dealership_info: info || {},
    cars: [],
    deals: [],
    sold_vehicles: [],
  };
  const SaveToDb = await DealerDb.insertOne(Entry);
  const Token = GenToken({ id: SaveToDb.insertedId });
  return res
    .status(200)
    .json({ success: 1, data: { Token,name }, msg: "AccountCreated" });
});
//endpoint 3 for login for both client and dealer
export const Login = Wrapper(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: 0, errorType: "ClientSide", msg: errors.mapped() });
  }
  //extract field data
  const { email, password } = req.query;
  const type=req.header("user_type") //users or dealers ==name of collection
  //check the existence of email
  const Db = clientInstance.db("CarShop").collection(type);

  const isExist = await Db.findOne((type==="users"?{user_email:email}:{dealership_email:email}));
  if (!isExist) {
    return res
      .status(400)
      .json({
        sucess: 0,
        errorType: "NoAccount",
        msg: "Account is not present",
      });
  }
  //now check the password

  const isPasswordCorrect = await bcrypt.compare(password, isExist.password);
  if(!isPasswordCorrect){
    return res
      .status(400)
      .json({
        sucess: 0,
        errorType: "WrongPassword",
        msg: "Password is wrong",
      });
  }
  let name=type==="users"?isExist.user_info.name:isExist.dealership_name
  const Token = GenToken({ id: isExist._id });
  return res
    .status(200)
    .json({ success: 1, data: { Token,name }, msg: "AccountFound" });
});

//Get user information endpoint
export const getUser=Wrapper(async(req,res)=>{
    const id= ObjectId.createFromHexString(req.user);
    const type=req.header("user_type")
 
    let data=null
    if(type==="users"){
  
        
        data=await userDb.findOne({_id: id},{projection:{user_email:1,user_location:1,user_info:1}})
    }
    else{
        data=await DealerDb.findOne({_id:id},{projection:{dealership_email:1,dealership_location:1,dealership_info:1,dealership_name:1}})

    }
    return res.status(200).json({success:1,data:{userInfo:data},msg:"Account found"})
})
