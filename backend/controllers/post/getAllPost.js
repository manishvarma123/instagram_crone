import { Post } from "../../models/postModel.js";


const getAllPost = async(req,res) => {
    try{
        const posts = await Post.find().sort({createdAt: -1})
        .populate({path:'author',select:'username profilePicture'})
        .populate({
            path:'comments',
            sort:{createdAt: -1},
            populate:{
                path:'author',
                select:'username profilePicture'
            }
        });

        return res.status(200).json({
            posts,
            success:true
        })
    }catch(error){
        res.status(400).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}

export default getAllPost