import { User } from "../../models/userModel.js";
import cloudinary from "../../utils/cloudinary.js";
import getDataUri from "../../utils/dataUri.js";


const editProfile = async(req,res) => {
    try{
        const userId = req.id;
        const {bio, gender} = req.body;
        const profilePicture = req.file;

        let cloudResponse;

        if(profilePicture){
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');
        if(!user){
            return res.status(401).json({
                message: 'User not found',
                success : false
            })
        };

        if(bio) user.bio = bio;
        if(gender) user.gender = gender;
        if(profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile Updated.',
            success: true,
            user
        })

    }catch(error){
        res.status(401).json({
            message: error.message || message,
            success : false,
            error : true
        })
    }
}

export default editProfile