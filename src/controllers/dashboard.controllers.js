import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subs.models.js";
import { Like } from "../models/likes.models.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  const subscriberData = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $group: {
        _id: null,
        subscribersCount: {
          $sum: 1
        }
      }
    },
    {
      $project: {
        _id: 0, // Exclude _id from the result
        subscribersCount: 1 // Include only subscribersCount field
      }
    }
  ]);
  


  const videoData = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
        $lookup:{
            from:"likes",
            localField:"_id",
            foreignField:"video",
            as:"likeData",
            pipeline:[
                {
                    $project:{
                        totalLikes: { $sum: "$likedBy" }
                    }
                }
            ]
        }
    },
    {
      $project: {
        videoCount: {
          $size: "$videoFile",
        },
        totalViews: { $sum: "$views" },
      },
    },
  ]);

  return res.json(new apiResponse(200,{videoData,subscriberData},"get histroy is succesfully sent"))
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel

  const uploadedVideo = await Video.aggregate([
    {
      owner: new mongoose.Types.ObjectId(req.user?._id),
    },
    {
      $project: {
        videoFile: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new apiResponse(200, { uploadedVideo }, "list of videos by the user")
    );
});

export { getChannelStats, getChannelVideos };
