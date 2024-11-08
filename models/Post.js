const mongoose=require('mongoose');

const PostSchema=new mongoose.Schema({
    title:{
        type:String,
        required: [true, "Title is Mendatory"],
        unique:true
    },
    content:{
        type:String,
        required: [true, "Content is Mendatory"]
    },
    pic:{
        type:String,
        required: [true, "Pic is Mendatory"]
    },
    username:{
        type:mongoose.Schema.Types.ObjectId,
        required: [true, "Username is Mendatory"],
    },
},{
    timestamps:true
})

module.exports=mongoose.model("Post",PostSchema)