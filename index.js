const express=require('express')

const app=express()
const dotenv=require('dotenv')
dotenv.config()
const path=require('path')

const cors=require('cors')

var whitelist = ['http://localhost:3000','http://localhost:8000',]
var corsOptions = {
    origin: function (origin, callback) {
        // console.log(origin)
        if (whitelist.includes(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('You Are not authenciated to access this api'))
        }
    }
}

app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: true }));
const connection=require('./dbConnect')
app.use(express.json())

app.use(express.static(path.join(__dirname,"build")))


const userRouter =require('./routes/userRoutes')
const postRouter = require('./routes/postRoutes')
app.use('/api',userRouter)
app.use('/api',postRouter)

app.use(express.static("./public"))
app.use("/public",express.static("./public"))

app.use("*",express.static(path.join(__dirname,"build")))

let PORT=process.env.PORT || 8000
app.listen(PORT,()=>console.log(`server is running on port ${PORT}`))