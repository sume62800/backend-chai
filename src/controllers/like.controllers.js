import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/likes.models.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    const toggleLike=await Like.create({
        video: videoId,
        likedBy: req.user?._id
    })

    return res.status(200).json(new apiResponse(200,{likeId:toggleLike},"video like saved!")) 
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    const toggleCommentLike=await Like.create({
        comment: commentId,
        likedBy: req.user?._id
    })

    return res.status(200).json(new apiResponse(200,{toggleCommentLike},"comment like saved!")) 
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    const toggleTweetLike=await Like.create({
        tweet: tweetId,
        likedBy: req.user?._id
    })



    return res.status(200).json(new apiResponse(200,{toggleTweetLike},"tweet like saved!")) 
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const likedVideos = await Like.aggregate([
        {
            $match:{
                likedBy: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        // {
        //     $match: {
        //       video: { $type: "string", $ne: "" } // Checking if fieldToCheck is of type string and is not an empty string
        //     }
        // },
        // {
        //     $project:{
        //         video:1
        //     }
        // }
    ])

    return res.status(200).json(new apiResponse(200,{likedVideos},"liked videos fetch")) 
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}