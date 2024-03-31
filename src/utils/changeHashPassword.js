import bcrypt from "bcrypt"

const changeHashPassword= async(newPassword,userOldpassword)=>{
    const newHashPassword=await bcrypt.hash(newPassword,10)
    console.log(newHashPassword)
    console.log(userOldpassword)
    const validify= await bcrypt.compare(newHashPassword,userOldpassword)
    return validify
}


export {changeHashPassword }