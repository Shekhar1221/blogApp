const {registerUser,login,updateUser,getSingleUser,getAllUsers}=require('../controllers/userController')
const { userUploader } = require('../middleware/fileUploader')

const userRouter=require('express').Router()

// register user
userRouter.post('/register',registerUser)

// login user
userRouter.post('/login',login)

//get all users
userRouter.get('/register',getAllUsers)

// user profile
userRouter.get('/user/:_id',getSingleUser)

//update user profile
userRouter.put('/user/:_id',userUploader.single('pic'),updateUser)

module.exports=userRouter
