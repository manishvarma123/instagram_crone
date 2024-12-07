import { User } from "../../models/userModel.js";


const followOrUnfollow = async (req,res) => {
    try{
        const followKrneWala = req.id;  // my id
        const jiskoFollowKarunga = req.params.id;  // others id

        if(followKrneWala === jiskoFollowKarunga){
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKarunga);

        if(!user || !targetUser){
            return res.status(400).json({
                message: 'User not found',
                success: false
            })
        }

        const isFollowing = user.following.includes(jiskoFollowKarunga);
        if (isFollowing){
            //unfollow logic ayega
            await Promise.all([
                User.updateOne({_id: followKrneWala},{$pull:{following:jiskoFollowKarunga}}),
                User.updateOne({_id: jiskoFollowKarunga},{$pull:{followers:followKrneWala}})
            ])
            return res.status(200).json({
                message: 'Unfollowed successfully',success:true
            })
        } else {
            //follow logic ayega
            await Promise.all([
                User.updateOne({_id: followKrneWala},{$push:{following:jiskoFollowKarunga}}),
                User.updateOne({_id: jiskoFollowKarunga},{$push:{followers:followKrneWala}})
            ])
            return res.status(200).json({
                message: 'followed successfully',
                success: true
            })

        }

    }catch(err){
        res.status(400).json({
            message: err.message || err,
            success: false,
            error : true
        })
    }
}

export default followOrUnfollow