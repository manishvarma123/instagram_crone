

const logout = async(req,res) => {
    try{
        return res.cookie("token","",{maxAge:0}).json({
            message: "Logged out successfully",
            success: true,
            error: false
        })
    }catch(error){
        res.status(401).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export default logout