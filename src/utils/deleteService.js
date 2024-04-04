import {v2 as cloudinary} from "cloudinary"
import { apiError } from "./apiError.js";
import { User } from "../models/user.models.js";
import { apiResponse } from "./apiResponse.js";

cloudinary.config({ 
    cloud_name: 'dm04opwdp', 
    api_key: '989232359868522', 
    api_secret: 'onluR1hIe6e-0a86uPNMOxKy7A4' 
  });

const deleteAsset = async (assetPath)=>{
    try {
        if (!assetPath){
            throw new apiError(400,"Asset Path is not found")
        }
        
        const public_id=assetPath?.split("/")
        const id=public_id[public_id.length-1]
        const cloud_id=id.split(".")
        const a=cloud_id[0]
        

        const deleteAsset= await cloudinary.uploader.destroy(a, {resource_type: "image",invalidate:true})

     

        return new apiResponse(200,{deleteAsset},"previous avatar image is successfully deleted!")
    } catch (error) {
        console.log("Deletion of Asset failed : ",error)
    }
}

export {deleteAsset}