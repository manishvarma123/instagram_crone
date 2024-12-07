import { Conversation } from "../../models/conversationModel.js";


const getMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        const conversation = await Conversation.findOne({
            participants: {$all: [senderId,receiverId]}
        }).populate('messages');

        if(!conversation) return res.status(200).json({success:true, messages: []});

        return res.status(200).json({success:true, messages: conversation?.messages})
    } catch (error) {
        res.status(400).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export default getMessage