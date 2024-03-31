import mongoose from "mongoose";

const subscribeSchema = mongoose.Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},
{
    timestamps:true
}
)

export const Subscription= new mongoose.model("Subscription",subscribeSchema)