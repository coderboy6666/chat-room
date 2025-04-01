import mongoose from "mongoose";
/**
 * 1、创建message模型
 * 2、定义四个字段，用来确定两个用户以及两个用户发送的信息和图片
 */
const messageSchema = new mongoose.Schema({
    sendUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiveUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String
    },
    photo: {
        type: String
    }
    
}, {timestamps: true})

const Message = mongoose.model("Message", messageSchema);

export default Message;