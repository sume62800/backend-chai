import dotenv from 'dotenv';
import dbcon from './db/index.js';
import {app} from "./app.js"

dotenv.config({
    path:"../.env"
})



dbcon()
.then(()=>{
    app.on("error",(error)=>{
        console.log("mongodb connection failed ! error: ", error)
    })
    app.listen(process.env.PORT_NUMBER || 8000 ,()=>{
        console.log(`app is running on port : ${process.env.PORT_NUMBER}`)
    })

})
.catch((error)=>{
    console.log("MONGODB CONNECTION FAILED !! Error : ",error)
})



