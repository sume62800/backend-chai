import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { PLaylist } from "../models/playlist.models.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist

    PLaylist.create({
        name,
        description,
        owner:req.user?._id
    })

    await PLaylist.save()

    return res.status(200).json(new apiResponse(200,{},"playlist has been created successfully!")) 
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

    const {playlistId, videoId} = req.params

    const playlistDoc=await PLaylist.findById(playlistId)

    playlistDoc.video= playlistDoc.video.push(videoId)

    const savedplaylistDoc=await playlistDoc.save().select("video")

    return res.status(200).json(new apiResponse(200,{savedplaylistDoc},"video has been succesully added to playlist!")) 
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    const playlistDoc=await PLaylist.findById(playlistId)

    let data=playlistDoc.video

    data = data.filter(item => item !== videoId);

    playlistDoc.video = data

    const updatedDoc=await playlistDoc.save()
    
    return res.status(200).json(new apiResponse(200,{updatedDoc},"video has been succesully removed from playlist!")) 

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    const playlistDoc=await PLaylist.findByIdAndDelete(playlistId)
    
    return res.status(200).json(new apiResponse(200,{playlistDoc},"playList has been succesully deleted!")) 
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
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