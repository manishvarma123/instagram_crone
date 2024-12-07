import {Comment} from '../../models/commentModel.js';

const getCommentsOfPost = async(req,res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({post:postId}).populate('author','username,profilePicture');

        if(!comments) return res.status(400).json({message:'No comments found for this post',success:false});

        return res.status(200).json({success:true, comments})
    } catch (error) {
        res.status(400).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export default getCommentsOfPost