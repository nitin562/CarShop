import {MongoClient, ServerApiVersion} from "mongodb"
import dotenv from "dotenv"
dotenv.config()
const uri=process.env.DB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function connectWithMongo() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    //("Mongodb is connected")
    
  } catch(error) {
    //(error.message)
  }
}
export const DealerDb = client.db("CarShop").collection("dealers");
export const userDb=client.db("CarShop").collection("users")
export const vehicleCollection=client.db("CarShop").collection("vehicles")
export const soldCollection=client.db("CarShop").collection("sold_vehicles")
export const DealCollection=client.db("CarShop").collection("deals")
export default client

