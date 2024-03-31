import mongoose from "mongoose";

const videoSchema= mongoose.Schema({
    videoFile:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:String
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        deafult:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})



export const Video =mongoose.model("Video",videoSchema)