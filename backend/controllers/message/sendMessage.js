import { Conversation } from "../../models/conversationModel.js";
import { Message } from "../../models/messageModel.js";
import { getReceiverSocketId, io } from "../../socket/socket.js";


const sendMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {textMessage :message} = req.body;

        let conversation = await Conversation.findOne({
            participants: {$all : [senderId, receiverId]}
        });

        //establish the conversation if not started yet.
        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId,receiverId]
            })
        };

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        })

        if(newMessage) conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(),newMessage.save()])

        // implement socket io for real time data transfer

        const receiverSocketId = getReceiverSocketId(receiverId);

        if(receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage',newMessage);
        }


        return res.status(201).json({
            success : true,
            newMessage
        })


    } catch (error) {
        res.status(400).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export default sendMessage