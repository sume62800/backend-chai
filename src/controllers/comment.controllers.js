import mongoose from "mongoose"
import {Comment} from "../models/comment.models.js"
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    // incomplete

    Comment.aggregate([
        {
            $match:{
                video:new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner_data",
                pipeline:[{
                    $project:{
                        username:1,
                        avatar:1
                    }
                }]

            }
        },
        {
            $project:{
                content:1,
                owner:{
                    
                }
            }
        }
    ])

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    const {content, videoId}=req.body

    const comment=Comment.create({
        content,
        video:videoId,
        owner: req.user?._id
    })

    await comment.save()

    return res.status(200).json(new apiResponse(200,{},"comment has sent sent!"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    const {commentId}=req.params
    const {content}=req.body

    const updatedComment=await Comment.findByIdAndUpdate(
        commentId,
        {
            content
        },
        {
            new:true
        }
    ).select("content")

    return res.status(200).json(new apiResponse(200,{updatedComment},"comment updated!"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const {commentId}=req.params

    const result =await findByIdAndDelete(commentId)

    res.status(200).json(new apiResponse(200,{result},"comment deleted!"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }