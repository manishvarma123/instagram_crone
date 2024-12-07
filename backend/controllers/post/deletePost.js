import {Post} from "../../models/postModel.js";
import { User } from "../../models/userModel.js";
import {Comment} from "../../models/commentModel.js";


const deletePost = async (req,res) => {
    try {
        const authorId = req.id;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if(!post) return res.status(400).json({message:'Post not found', success : false});

        // check if the logged in user is the owner of the post
        if(post.author.toString() !== authorId) return res.status(400).json({message: 'Unauthorized', success : false})
        
        // delete post
        await Post.findByIdAndDelete(postId);

        // remove the post Id fom the user's post
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        // delete associated comments
        await Comment.deleteMany({post:postId});

        return res.status(200).json({
            success : true,
            message: 'Post deleted successfully'
        })

        

    } catch (error) {
        res.status(400).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export default deletePost