import bcrypt from "bcrypt"

const changeHashPassword= async(newPassword,userOldpassword)=>{
    const newHashPassword=await bcrypt.hash(newPassword,10)
    const validify= await bcrypt.compare(newHashPassword,userOldpassword)
    return validify
}


export {changeHashPassword }