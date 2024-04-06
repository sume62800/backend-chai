import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subs.models.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

// this whole routing does not work at all 

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    // this is wrong 

    const subscription=await Subscription.create({
        subscriber:req.user?._id,
        channel:channelId
    })

    // const subscriberDoc=await Subscription.aggregate([
    //     {
    //         $match:{
    //             subscriber: new mongoose.Types.ObjectId(req.user?._id)
    //         }
    //     },
    //     //add feilds code
    // ])

    

    return res.status(200).json(new apiResponse(200,{subscriptionStatus:true},"channel has been subscribed!")) 
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {subscriberId} = req.params
    console.log(subscriberId)
    const subscriberList=await Subscription.aggregate([
        {
            $match:{
                channel: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        // {
        //     $limit:limit
        // },
        // {
        //     $skip:page
        // },
        
    ])

    console.log(subscriberList)
    return res.status(200).json(new apiResponse(200,{subscriberList},"subscriber list")) 
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    const channelList=await Subscription.aggregate([
        {
            $match:{
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        // {
        //     $limit:limit
        // },
        // {
        //     $skip:page
        // },
    ])

    return res.status(200).json(new apiResponse(200,{channelList},"channel list to which user has subscribed")) 

})



export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}