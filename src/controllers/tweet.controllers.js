import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const {content}=req.body

    const tweet = Tweet.create({
        owner:req.user?._id,
        content
    })

    const tweetData=await tweet.save()

    return res.status(200).json(new apiResponse(200,{tweetData},"tweet"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const userTweet=Tweet.aggregate([
        {
            $match:{
                owner: new  new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $addFields:{
                owner:{
                  $first:"$owner"
                }
            }
        },
    ])

    return res.status(200).json(new apiResponse(200,{userTweet},"user tweet"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    const {tweetID,content}=req.params

    const updatedTweet=await Tweet.findByIdAndUpdate(
        tweetID,
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

    const {tweetID}=req.params
    const resultOfDatabase=await Tweet.findByIdAndDelete(tweetID)

    return res.status(200).json(new apiResponse(200,{resultOfDatabase},"user tweet has been deleted!")) 
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}