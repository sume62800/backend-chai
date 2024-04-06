import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadfile} from "../utils/uploaderService.js"
import { uploadVideo } from "../utils/uploadVideoService.js"
import { deleteAsset } from "../utils/deleteService.js"
import { deleteVideoAsset } from "../utils/deletevideo.js"



const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    // page is not working and please resolve this issue

    let query="programming is the future"

    const allVideos=await Video.aggregate([
        {
            $match:{
                owner: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $match:{
                title:query
            }
        },
        {
            $sort:{
                title:1
            }
        },
        {
            $limit:limit
        },
        // {
        //     $skip:page
        // },
    ])

    if (!allVideos){
        throw new apiError(400,"no video can be found!")
    }

    return res.status(200).json(new apiResponse(400,{allVideos},"video fetched sucessfully"))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    const videoLocalPath= req.files?.videoFile[0]?.path;
    const thumbnailLocalPath=req.files?.thumbnail[0]?.path;
    if (!videoLocalPath && !thumbnailLocalPath){
        throw new apiError(400,"uploading to the server is failed ")
    }


    const videoPath = await uploadVideo(videoLocalPath)
    const thumbnailPath = await uploadfile(thumbnailLocalPath)

    if(!videoPath && !thumbnailPath){
        throw new apiError(400,"uploading is failed!")
    }


    

    
    const durationInSeconds = videoPath.duration


    const video= await Video.create({
        videoFile:videoPath.url,
        thumbnail:thumbnailPath.url,
        title:title,
        description:description,
        duration:durationInSeconds,
        views:0,
        isPublished:true,
        owner:req.user?._id
    })

    

    return res.status(200).json(new apiResponse(200,{video},"video published succesfully"))

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    const videoSearch=await Video.findById(videoId)
    const videoURL=videoSearch.videoFile

    return res.status(200).json(new apiResponse(200,{videoURL},"video fetch successfully"))

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const {title, description}=req.body
    const thumbnailLocalPath=req.file?.path

    if (!thumbnailLocalPath){
        throw new apiError(200,"uploading to the server is failed")
    }

    const thumbnailPath = await uploadfile(thumbnailLocalPath)

    //TODO: update video details like title, description, thumbnail

    const videoSearch=await Video.findByIdAndUpdate(
        videoId,
        {
            title,
            description,
            thumbnail:thumbnailPath.url
        },
        {
            new:true
        }
    )

    return res.status(200).json(new apiResponse(200,{videoDataUpdate:videoSearch},"updation of video successfully done!"))


})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    //TODO: delete video
    // delete the thumbnail

    const requiredVideo= await Video.findById(videoId)

    if (!requiredVideo){
        throw new apiError(200,"video does not exist")
    }

    console.log(requiredVideo.videoFile,requiredVideo.thumbnail)
    const result= await deleteVideoAsset(requiredVideo.videoFile)
    const resultThumbnail= await deleteAsset(requiredVideo.thumbnail)

    const resultOfDatabase=await Video.findByIdAndDelete(videoId)

    return res.status(200).json(new apiResponse(200, {resultThumbnail,result,resultOfDatabase},"deletion of video successsfully done!"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const requiredVideo= await Video.findById(videoId)

    if (!requiredVideo){
        throw new apiError(200,"video does not exist")
    }

    return res.status(200).json(new apiResponse(200,{PublishStatus:requiredVideo.isPublished},"publish status succcessfully fetched!"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}