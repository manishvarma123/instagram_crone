import { User } from "../../models/userModel.js"


const getSuggestedUsers = async(req,res) => {
    try{
        const suggestedUsers = await User.find({_id:{$ne:req.id}}).select("-password");
        if(!suggestedUsers){
            return res.status(400).json({
                message: 'Currently do not have any users',
                success : false
            })
        }
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    }catch(error){
        res.status(401).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export default getSuggestedUsers