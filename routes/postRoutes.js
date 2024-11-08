const {createPost, getAllPosts, getSinglePost, updatePost, deletePost}=require('../controllers/postController')
const verifyAuthenticatedUser=require('../middleware/auth')
const {postUploader}=require('../middleware/fileUploader')

const postRouter=require('express').Router()

// create post
postRouter.post('/posts',verifyAuthenticatedUser,postUploader.single('pic'),createPost)
// get all posts
postRouter.get('/posts',getAllPosts)
// get single post
postRouter.get('/posts/:_id',getSinglePost)
// update a post
postRouter.put('/posts/:_id',postUploader.single('pic'),updatePost)
//delete a post
postRouter.delete('/posts/:_id',verifyAuthenticatedUser,deletePost)


module.exports=postRouter
