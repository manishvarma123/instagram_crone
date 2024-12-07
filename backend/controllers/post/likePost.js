import {Post} from '../../models/postModel.js';
import { User } from '../../models/userModel.js';
import { getReceiverSocketId, io } from '../../socket/socket.js';

const likePost = async (req,res) => {
    try{
        const likeKarneWaleUserKiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({message: 'Post not found', success: false});

        //like logic started
        await post.updateOne({$addToSet: {likes: likeKarneWaleUserKiId}});
        await post.save();

        //implement socket io for real time notification
        const user = await User.findById(likeKarneWaleUserKiId).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if(postOwnerId !== likeKarneWaleUserKiId){
            // emit a notification event
            const notification = {
                type :'like',
                userId : likeKarneWaleUserKiId,
                userDetails : user,
                postId,
                message : 'Your post was liked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification);
        }


        return res.status(200).json({message:'Post liked', success: true});

    }catch(error){
        res.status(400).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export default likePost