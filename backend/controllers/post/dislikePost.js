import { Post } from "../../models/postModel.js";
import { User } from "../../models/userModel.js";
import { getReceiverSocketId, io } from "../../socket/socket.js";


const dislikePost = async (req,res) => {
    try{
        const dislikeKarneWaleUserKiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({message: 'Post not found', success: false});

        //dislike logic started
        await post.updateOne({$pull: {likes: dislikeKarneWaleUserKiId}});
        await post.save();

        //implement socket io for real time notification
        const user = await User.findById(dislikeKarneWaleUserKiId).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if(postOwnerId !== dislikeKarneWaleUserKiId){
            // emit a notification event
            const notification = {
                type :'dislike',
                userId : dislikeKarneWaleUserKiId,
                userDetails : user,
                postId,
                message : 'Your post was disliked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification);
        }

        return res.status(200).json({message:'Post disliked', success: true});

    }catch(error){
        res.status(400).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export default dislikePost