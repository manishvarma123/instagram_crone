import { User } from "../../models/userModel.js";


const getProfile = async(req,res) => {
    try{
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts',createdAt:-1}).populate('bookmarks');

        return res.status(200).json({
            message: "User get successfully",
            user,
            success:true

        })

    }catch(error){
        res.status(401).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export default getProfile