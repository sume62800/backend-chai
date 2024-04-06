import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subs.models.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription

    const subscription= Subscription.create({
        subscriber:req.user?._id,
        channel:channelId
    },{timestamps:true})

    await subscription.save()

    const subscriberDoc=await Subscription.aggregate([
        {
            $match:{
                subscriber: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        //add feilds code
    ])

    

    return res.status(200).json(new apiResponse(200,{subscriberDoc},"channel has been subscribed!")) 
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId,limit ,page} = req.params

    const subscriberList=await Subscription.aggregate([
        {
            $match:{
                channelId: new mongoose.Types.ObjectId(req.params)
            }
        },
        {
            $limit:limit
        },
        {
            $skip:page
        },
        
    ])
    return res.status(200).json(new apiResponse(200,{subscriberList:subscriberList.subscriber},"subscriber list")) 
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    const channelList=await Subscription.aggregate([
        {
            $match:{
                subscriberId: new mongoose.Types.ObjectId(req.params)
            }
        },
        {
            $limit:limit
        },
        {
            $skip:page
        },
    ])

    return res.status(200).json(new apiResponse(200,{channelList},"channel list to which user has subscribed")) 

})



export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}