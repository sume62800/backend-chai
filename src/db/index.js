import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv"

dotenv.config()

const dbcon= async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n MONGO connected!! HOST NAME : ${connectionInstance.connection.host}`)
        
    } catch (error) {
        console.log("error: ",error)
        process.exit(1)
    }
}

export default dbcon