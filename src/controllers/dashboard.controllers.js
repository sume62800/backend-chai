import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
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
      $project: {
        subscribersCount: {
          $size: "$channel",
        },
      },
    },
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
