const Post=require('../models/Post')

async function createPost(req,res){
    const data=new Post(req.body)
    if(req.file){
        data.pic = req.file.path
    }
    try{
          let result=await data.save()
          res.status(200).json({result:result})
    }catch(error){
        console.log(error)
        const errorMessage = {}
        error.keyValue?.title ? errorMessage.username = "Title Already Exist" : ""
        error.errors?.title ? errorMessage.title = error.errors.title.message : ""
        error.errors?.content ? errorMessage.content = error.errors.content.message : ""
        error.errors?.pic ? errorMessage.pic = error.errors.pic.message : ""
    
        Object.values(errorMessage).filter((x) => x !== "").length === 0 ?
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" }) :
            res.send({ result: "Fail", reason: errorMessage })
    }
}

async function getAllPosts(req, res) {
    try {
        const data = await Post.find().sort({ _id: -1 })
        res.send({ result: "Done", data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}
async function getSinglePost(req, res) {
    try {
        const data = await Post.findOne({ _id: req.params._id })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.send({ result: "Fail", reason: "Invalid ID, Record Not Found" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}


async function updatePost(req,res) {
    console.log('post controller')
    try {
        const data = await Post.findOne({ _id: req.params._id })
        if (data) {
            data.title = req.body.title ?? data.title
            data.content = req.body.content ?? data.content
            if(req.file){
                try {
                    const fs = require("fs")
                    fs.unlinkSync(data.pic)
                } catch (error) {
                    res.json(error)
                }
                data.pic = req.file.path
            }
            await data.save()
            res.send({ result: "Done", message: "Post Updated SuccessFully" })
        }
        else
            res.send({ result: "Fail", reason: "Invalid ID, Post Not Found" })
    } catch (error) {
        console.log(error)
        const errorMessage = {}
        error.keyValue ? errorMessage.title = "Title Already Exist" : ""
        Object.values(errorMessage).find(x => x !== "") ?
            res.status(500).send({ result: "Fail", ...errorMessage }) :
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function deletePost(req, res) {
    try {
        const data = await Post.findOne({ _id: req.params._id })
        if (data) {
            try {
                const fs = require("fs")
                fs.unlinkSync(data.pic)
            } catch (error) {}
            await data.deleteOne()
            res.send({ result: "Done", message: "Post is Deleted" })
        }
        else
            res.send({ result: "Fail", reason: "Invalid ID, Post Not Found" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}


module.exports={createPost,getAllPosts,getSinglePost,updatePost,deletePost}