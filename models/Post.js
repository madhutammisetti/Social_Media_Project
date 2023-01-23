const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    description:{
        type:String,
        max:500
    },
    img:{
        type:String
    },
    likes:{
        type:Array,
        default:[]
    }
},
{timestamps:true}   //when ever you create a user or update , this help to automatically update the timestamps..

)

module.exports = mongoose.model("Post",PostSchema)