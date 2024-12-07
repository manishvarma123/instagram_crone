import {Post} from "../../models/postModel.js"
import { User } from "../../models/userModel.js";

const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found', success:false});

        const user = await User.findById(authorId);
        if(user.bookmarks.includes(post._id)){
            //already bookmarked -> remove from the bookmark
            await user.updateOne({$pull:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({
                type:'unsaved',
                message: 'Post removed from bookmark',
                success : true
            });

        }else{
            // bookmark karna padega
            await user.updateOne({$push:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({
                type: 'saved',
                message: 'Post bookmarked',
                success : true
            })
        }
    } catch (error) {
        res.status(400).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}

export default bookmarkPost