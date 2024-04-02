import {v2 as cloudinary} from "cloudinary"
import { apiError } from "./apiError";
import { User } from "../models/user.models";
import { apiResponse } from "./apiResponse";

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
        const deleteAsset= await cloudinary.v2.uploader.destroy(assetPath, {resource_type: "auto",invalidate:true})

        console.log(deleteAsset.result)

        return new apiResponse(200,{},"previous avatar image is successfully deleted!")
    } catch (error) {
        console.log("Deletion of Asset failed : ",error)
    }
}

export {deleteAsset}