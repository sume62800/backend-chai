// routes.js

import express from "express";
import { changeCurrentPassword, getCurrentUser, home, login, logout, refreshAccessToken, register, updateAvatar, updateCoverImage, uploadAccountDetails } from "../controllers/auth-controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"


const router = express.Router();

router.get('/', home);
router.post('/register',
upload.fields([
    {
        name:"avatar",
        maxCount:1
    },
    {
        name:"coverImage",
        maxCount:1
    }
])
,register)
router.post('/login',login)
router.post('/logout',verifyJWT,logout)
router.post('/refreshToken',refreshAccessToken)
router.post('/changePassword',verifyJWT,changeCurrentPassword)
router.get('/getUserInfo',verifyJWT,getCurrentUser)
router.post('/updateaccount',verifyJWT,uploadAccountDetails)
router.post('/updateAvatar',verifyJWT,upload.fields([{name:"avatar",maxCount:1}]),updateAvatar)
router.post('/updateCoverImage',verifyJWT,upload.fields([{name:"coverImage",maxCount:1}]),updateCoverImage)

export {router};
