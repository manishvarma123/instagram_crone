import {Post} from '../../models/postModel.js';
import {Comment} from '../../models/commentModel.js'

const addComment = async(req,res) => {
    try {
        const postId = req.params.id;
        const commentKrneWaleUserKiId = req.id;

        const {text} = req.body;
        const post = await Post.findById(postId);

        if(!text) return res.status(400).json({message:'text is required',success : false});

        const comment = await Comment.create({
            text,
            author: commentKrneWaleUserKiId,
            post:postId
        })
        
        await comment.populate({
            path:'author',
            select: "username profilePicture"
        })

        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message: 'Comment Added',
            comment,
            success: true
        })
        
    } catch (error) {
        res.status(400).json({
            message : error.message || error,
            success: false,
            error : true
        })
    }
}

export default addComment