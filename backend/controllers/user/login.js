import { User } from "../../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Post } from "../../models/postModel.js";


const login = async(req,res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }

        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            })
        }

        const token = await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'});

        //populate each post if in the posts array
        const populatePosts = await Promise.all(
            user.posts.map(async(postId) => {
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        )

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatePosts
        }

        return res.cookie('token',token,{httpOnly:true, sameSite:'strict', maxAge: 1*24*60*60*1000}).json({
            message: "Logged In successfully",
            success: true,
            user
        })

    }catch(error){
        res.status(401).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}

export default login