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

    const getComment=await Comment.aggregate([
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
                pipeline:[
                    {
                      $project:{
                        usernmae:1,
                        avatar:1,
                        createdAt:1
                      }
                    }
                ]
                    
            
            }
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"comment",
                as:"likes_data",
            }
        },
        {
            $project:{
                content:1,
                owner_data:1,
                number_of_likes:{ $size: "$likes_data" }
            }
        }
    ])

    return res.status(200).json(new apiResponse(200,{getComment},"comments has been fetched!"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId}=req.params
    const {content}=req.body

    const comment= await Comment.create({
        content,
        video:videoId,
        owner: req.user?._id
    })

    return res.status(200).json(new apiResponse(200,{comment},"comment has sent sent!"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    const {commentId}=req.params
    const {content}=req.body
    console.log(commentId)

    const updatedComment=await Comment.findByIdAndUpdate(
        commentId,
        {
            content
        },
        {
            new:true
        }
    )

    return res.status(200).json(new apiResponse(200,{updatedComment},"comment updated!"))
})

const deleteComment = asyncHandler(async (req, res) => {
    try {
        const { commentId } = req.params;

        const result = await Comment.findByIdAndDelete(commentId);

        if (!result) {
            return res.status(404).json(new apiResponse(404, null, "Comment not found"));
        }

        res.status(200).json(new apiResponse(200, { result }, "Comment deleted!"));
    } catch (error) {
        console.error(error);
        res.status(500).json(new apiResponse(500, null, "Internal Server Error"));
    }
});


export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }