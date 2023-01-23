const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcrypt")

//update user

router.put("/:id", async(req,res)=>{
    //Here we will verify , if userid is matched with :id 
    if(req.body.userId === req.params.id || req.body.isAdmin){

        if(req.body.password) { // if user tries to update the password sending new password 
            try{
                const salt = await bcrypt.genSalt(10); 
                req.body.password = await bcrypt.hash(req.body.password, salt)  // hasing the password  Nd update in req.body.password
            }catch(err){
               return res.status(500).json(err)
            }
        }

        //lets update the actual user
        try{
            const user = await User.findByIdAndUpdate(req.params.id, // we find our user here
                {
                    $set:req.body   // it will automatically set all inputs inside body.
                });
            res.status(200).json("Account has been updated")          
        }catch(err){
            return res.status(500).json(err)
        }

    }else{
        return res.status(403).json("You can only update your account")
    }
})

//delete user
router.delete("/:id", async (req,res)=>{
    //Here we will verify , if userid is matched with :id 
    if(req.body.userId === req.params.id || req.body.isAdmin){

        //lets delete the actual user
        try{
            await User.findByIdAndDelete(req.params.id) // delete the user with the id
            return res.status(200).json("Account has been deleted succesfully")          
        }catch(err){
            return res.status(500).json(err)
        }

    }else{
        return res.status(403).json("You can only delete only your account")
    }
})


//get user
router.get("/:id" , async (req,res)=>{
    try{
        const user = await User.findById(req.params.id); // here we will get all te user data , but we want only some data
        const {password,updatedAt,  ...other} = user._doc
        res.status(200).json(other)
    }catch(err){
        res.status(500).json(err)
    }
})


//follow a user
router.put("/:id/follow" , async (req,res)=>{   // :id of the user which i want to follow
    if(req.body.userId !== req.params.id){  // checking wheather the users are same 
        try{   // if both users are not same
            const user = await User.findById(req.params.id) // find the user id , which i want to follow
            const currentUser = await User.findById(req.body.userId) // find the my userid , that is current user , which is trying to make request
            if(!user.followers.includes(req.body.userId)){ // if current user is not following the user
                await user.updateOne({$push:{followers:req.body.userId}}); // update the followers array in user
                await currentUser.updateOne({$push: {followings:req.params.id}}); //update the followings array in currentuser
                res.status(200).json("User has been followed")
            }else{ // if current user already following the user
                res.status(403).json("you already follow this user")
            }

        }catch(err){
            res.status(500).json(err)
        }
    }else{   // if both users are same 
        res.status(403).json("You cannot follow yourself")
    }
})


//unfollow a user
router.put("/:id/unfollow" , async (req,res)=>{   // :id of the user which i want to unfollow
    if(req.body.userId !== req.params.id){  // checking wheather the users are same 
        try{   // if both users are not same
            const user = await User.findById(req.params.id) // find the user id , which i want to unfollow
            const currentUser = await User.findById(req.body.userId) // find the my userid , that is current user , which is trying to make request
            if(user.followers.includes(req.body.userId)){ // if current user is following the user
                await user.updateOne({$pull:{followers:req.body.userId}}); // update the followers array in user
                await currentUser.updateOne({$pull: {followings:req.params.id}}); //update the followings array in currentuser
                res.status(200).json("User has been unfollowed")
            }else{ // if current user not following the user
                res.status(403).json("you ddont follow this user")
            }

        }catch(err){
            res.status(500).json(err)
        }
    }else{   // if both users are same 
        res.status(403).json("You cannot unfollow yourself")
    }
})



module.exports = router;