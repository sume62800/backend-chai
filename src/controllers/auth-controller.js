import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { uploadfile } from "../utils/uploaderService.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { json } from "express";
import jwt from "jsonwebtoken";

const home = (req, res) => {
  res.json({ msg: "this is working at all" });
};

const register = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;
  console.log(req.files);

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "User with email or username already exists");
  }
  //console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is required");
  }

  const avatar = await uploadfile(avatarLocalPath);
  const coverImage = await uploadfile(coverImageLocalPath);

  if (!avatar) {
    throw new apiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User registered Successfully"));
});

const generateAccessAndRefreshToken = async (userid) => {
  try {
    
    const user = await User.findById(userid); // problem

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    // accessToken=json.stringify(accessToken)
    
    

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false });
 

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      400,
      "something went wrong while generating acces and refresh token "
    );
  }
};

const login = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
//   console.log(password);

  if (!username) {
    throw new apiError(400, "username or email is required");
  }
  const existUser = await User.findOne({ $or: [{ username }, { email }] });
  if (!existUser) {
    throw new apiError(400, "user not found");
  }

//   const checkpassword = await existUser.isPasswordCorrect(password);

//   if (!checkpassword) {
//     throw new apiError(400, "password is incorrect");
//   }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    existUser._id
  );
    

  accessToken
  refreshToken
 
  const loginUser = await User.findById(existUser._id).select("-password -refreshToken")
 

  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
            user:loginUser,
          accessToken,
          refreshToken,
        },
        "user login successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "logout successfully"));
});

const refreshAccessToken=asyncHandler(async (req,res)=>{
  const refreshToken =req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "")
  if (!refreshToken){
    throw new apiError(400,"unable to fetch refresh token")
  }
 
  const decodedToken = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)

  if (!decodedToken){
    throw new apiError(400,"unvalid token or expired")
  }

  const getUser= await User.findById(decodedToken?._id)
  console.log(getUser)
  console.log(refreshToken)
  if (refreshToken !== getUser.refreshToken){
    throw new apiError(400,"refresh token is expired")
  }

  const newAccessToken = await getUser.generateAccessToken()

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res.status(200)
  .cookie("accesstoken",newAccessToken,options)
  .json(new apiResponse(200,{
    accessToken:newAccessToken
  },
  "access token generate successfully"
  ))
})

export { home, register, login, logout, refreshAccessToken };
