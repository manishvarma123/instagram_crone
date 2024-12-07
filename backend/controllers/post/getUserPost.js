import { Post } from "../../models/postModel.js";

const getUserPost = async (req,res) => {
    try{
        const authorId = req.id;
        const posts = await Post.find({author:authorId}).sort({createdAt: -1}).populate({
            path: 'author',
            select: 'username profilePicture'
        }).populate({
            path:'comments',
            sort: {createdAt: -1},
            populate: {
                path: 'author',
                select:'username profilePicture'
            }
        });

        return res.status(200).json({
            posts,
            success:true
        })

    }catch(error){
        res.status(400).json({
            message : error.message || error,
            error : true,
            success: false
        })
    }
}

export default getUserPost;

