const router = require("express").Router();
const Post = require("../models/Post");
const { route } = require("./users");

//create a post
router.post("/", async(req,res)=>{
    const newPost = new Post(req.body)
    try{
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    }catch(err){
        res.status(500).json(err)
    }
})

//update a post
router.put("/:id", async(req,res)=>{ 
    try{
        const post = await Post.findById(req.params.id); // Here we are checking post is there or not , with post id 
        if(post.userId === req.body.userId){  //checking owner of the post , (post will have userid === user provided userid )if same we can update this post
            await post.updateOne({$set:req.body});
            res.status(200).json("Post has been updated!!")
        }else{
            res.status(403).json("you can update only your post")
        }
    }catch(err){
        res.status(500).json(err)
    }   
})

//delete a post
router.delete("/:id", async(req,res)=>{ 
    try{
        const post = await Post.findById(req.params.id); // Here we are checking post is there or not , with post id 
        if(post.userId === req.body.userId){  //checking owner of the post , (post will have userid === user provided userid )if same we can delete this post
            await post.deleteOne();
            res.status(200).json("Post has been deleted!!")
        }else{
            res.status(403).json("you can delete only your post")
        }
    }catch(err){
        res.status(500).json(err)
    }   
})

//like and dislike a post
router.put("/:id/like", async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id); // Here we are checking post is there or not , with post id
        if(!post.likes.includes(req.body.userId)){ // checking wheather userid is there is likes array , simply checking for user is previously liked the post or not
            await post.updateOne({$push:{likes:req.body.userId}}); // pushing userid into likes array
            res.status(200).json("post has been liked")
        }else{  // dislike , if userid already there in likes array.. 
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json("post has been disliked")
        }
    }catch(err){
        res.status(500).json(err)
    }
    
})


//get a post
router.get("/:id", async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id); // Here we are checking post is there or not , with post id
        res.status(200).json(post)
    }catch(err){
        res.status(500).json(err)
    }
})


//get timeline posts  (it will get all posts of the users followings like timeline)
router.get("/timeline/all ", async (req,res)=>{
 
    try{
        const currentUser = await User.findById(req.body.userId); // first we will find the current user
        const userPosts = await Post.find({ userId:currentUser._id }); // here we are finding the all posts of the user with userid
        const friendPosts = await Promise.all(  // here we are find all post of the followings
            currentUser.followings.map((friendId)=>{
              return Post.find({ userId : friendId });
            })
        );
        res.json(userPosts.concat(...friendPosts))
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;