// routes.js

import express from "express";
import { changeCurrentPassword, home, login, logout, refreshAccessToken, register } from "../controllers/auth-controller.js";
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

export {router};
