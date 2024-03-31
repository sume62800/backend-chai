import express, { urlencoded } from "express";
import cors from 'cors';
import cookiesParser from "cookie-parser"

const app = express()

app.use(express.json({}));
app.use(cors({
    origin:process.env.CORS_ORIGIN
}));
app.use(urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookiesParser())

//routes import
import { router } from './routes/auth-route.js';

//routes declaration
app.use("/api/v1/users",router);


export {app}