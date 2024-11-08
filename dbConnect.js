const mongoose=require('mongoose')

async function getConnect(){
    try{
         await mongoose.connect(process.env.DB_KEY)
         console.log("database connected successfully")  
    }catch(error){
        console.log(error)
    }
}

getConnect()