import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import {User} from "../models/user.models.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const {content}=req.body

    const tweet =await  Tweet.create({
        owner:req.user?._id,
        content
    })


    return res.status(200).json(new apiResponse(200,{tweet},"tweet"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const userTweet= await Tweet.aggregate([
        {
            $match:{
                owner:  new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $addFields:{
                owner:{
                  $first:"$userTweet"  // need to learn this pipeline
                }
            }
        },
    ])

    return res.status(200).json(new apiResponse(200,{userTweet},"user tweet"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    const {tweetId}= req.params
    const {content}= req.body

    const updatedTweet=await Tweet.findByIdAndUpdate(
        tweetId,
        {
            content
        },
        {
            new:true
        }
    )

    return res.status(200).json(new apiResponse(200,{updatedTweet},"user tweet updated!")) 
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const {tweetId}=req.params
    const resultOfDatabase=await Tweet.findByIdAndDelete(tweetId)

    return res.status(200).json(new apiResponse(200,{resultOfDatabase},"user tweet has been deleted!")) 
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}