import { User } from "../../models/userModel.js";
import bcrypt from 'bcryptjs'

const register = async (req,res) => {
    try{
        const {username,email,password} = req.body;
        if(!username || !email || !password){
            return res.status(401).json({
                message: "Something is missing, Please check!",
                success: false
            });
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(401).json({
                message: "Try different email",
                success: false
            });
        };
        const hashPassword = await bcrypt.hash(password,10)
        await User.create({
            username,
            email,
            password:hashPassword
        });
        return res.status(201).json({
            message:"Account created successfully",
            success: true
        })
    }catch(err){
        console.log(err)
    }
}

export default register