import mongoose, {isValidObjectId} from "mongoose"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { PLaylist } from "../models/playlist.models.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist

    const playlistdata=await PLaylist.create({
        name,
        description,
        owner:req.user?._id
    })

    

    return res.status(200).json(new apiResponse(200,{playlistdata},"playlist has been created successfully!")) 
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    const userPlaylist=await PLaylist.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(userId)
            }
        }
    ])

    return res.status(200).json(new apiResponse(200,{userPlaylist},"playlist has been fetched successfully!")) 
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    const userPlaylist=await PLaylist.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(playlistId)
            }
        }
    ])

    return res.status(200).json(new apiResponse(200,{userPlaylist},"playlist has been fetched successfully!")) 
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    try {
  
        const playlistDoc = await PLaylist.findById(playlistId);

   
        if (!playlistDoc) {
            return res.status(404).json(new apiResponse(404, null, "Playlist not found"));
        }

      
        playlistDoc.videos.push(videoId);


        const savedPlaylistDoc = await playlistDoc.save();


        return res.status(200).json(new apiResponse(200, { savedPlaylistDoc }, "Video has been successfully added to the playlist!"));
    } catch (error) {

        console.error(error);
        return res.status(500).json(new apiResponse(500, null, "Internal Server Error"));
    }
});


const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    try {

        const playlistDoc = await PLaylist.findById(playlistId);

        if (!playlistDoc) {
            return res.status(404).json(new apiResponse(404, null, "Playlist not found"));
        }

        playlistDoc.videos = playlistDoc.videos.filter(item => item.toString() !== videoId);
        console.log(playlistDoc.videos)

 
        const updatedDoc = await playlistDoc.save();
        
  
        return res.status(200).json(new apiResponse(200, { updatedDoc }, "Video has been successfully removed from the playlist!"));
    } catch (error) {

        console.error(error);
        return res.status(500).json(new apiResponse(500, null, "Internal Server Error"));
    }
});


const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    const playlistDoc=await PLaylist.findByIdAndDelete(playlistId)
    
    return res.status(200).json(new apiResponse(200,{msg:"success"},"playList has been succesully deleted!")) 
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body

    const updatedPlayListData=await PLaylist.findByIdAndUpdate(
        playlistId,
        {
            name,
            description
        },
        {
            new:true
        }
        
    )

    return res.status(200).json(new apiResponse(200,{updatedPlayListData},"playList has been succesully updated!")) 

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}