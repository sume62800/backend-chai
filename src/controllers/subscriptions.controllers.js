import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subs.models.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

// this whole routing does not work at all 

const toggleSubscription = asyncHandler(async (req, res) => {
    const {subscriberId} = req.params
    // TODO: toggle subscription
    // this is wrong 

    const subscription=await Subscription.create({
        subscriber:req.user?._id,
        channel:subscriberId
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
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"subscriber",
                foreignField:"_id",
                as:"subscriber_profile",
                pipeline:([
                    {
                        $project:{
                            _id:0,
                            fullname:1,
                            avatar:1,
                            username:1
                        }
                    }
                ])
            }
        },
        {
            $project:{
                _id:0,
                createdAt:1,
                subscriber_profile:1,
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
                channel: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"subscriber_profile",
                pipeline:([
                    {
                        $project:{
                            _id:0,
                            fullname:1,
                            avatar:1,
                            username:1
                        }
                    }
                ])
            }
        },
        {
            $project:{
                _id:0,
                createdAt:1,
                subscriber_profile:1,
            }
        }
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