import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const UserSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:[true,'PLease provide your name'],
        trim:true,
        index:true
    },
    username:{
        type:String,
        required:[true,'username feild can not be empty'],
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    avatar:{
        type:String,
        required:true,
    },
    coverImage:{
        type:String, 
    },
    password:{
        type:String,
        required:true
    },
    watchHistroy:[{
        type:mongoose.Types.ObjectId,
        ref:"Video"
    }],
    refreshToken:{
        type:String
    },
    isVerified:Boolean,
    isForgetPassword:Boolean
},{timestamps:true})

UserSchema.pre("save",async function (next){
    if (!this.isModified("password")) return next();

    this.password=await bcrypt.hash(this.password, 10)
    next()
})

UserSchema.methods.isPasswordCorrect=async function (password){

    return await bcrypt.compare(password,this.password)
}

UserSchema.methods.generateAccessToken= async function (){
    return  jwt.sign(
        {
            _id:this._id,
            fullname : this.fullname,
            username :this.username,
            password : this.password
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
UserSchema.methods.generateRefreshToken= async function (){
    return  jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = new mongoose.model('User',UserSchema)