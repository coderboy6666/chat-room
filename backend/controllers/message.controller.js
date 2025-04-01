/**
 * 
 * 1、得到用户的侧边栏的数据，需要获得除了自己以外的所有人的信息
 * 2、利用req.user得到除了req.user的所有其他user的信息
 * 
 */
import User from "../models/user.model.js";
export const getUserForSidebarController = async (req, res) => {
    try {
        const loggedUserId = req.user._id;
        const sidebarUsers = await User.find({_id: {$ne: loggedUserId}}).select('-password');
        res.status(200).json({sidebarUsers})
    } catch(error) {
        console.log("getUserForSidebarController");
        res.status(500).json({
            message: "服务器异常!!"
        });
    }
}

/**
 * 1、得到两个用户的聊天记录，需要获得两个用户所有的聊天记录，无论当前用户是作为发送方还是接收方，这两种情况的聊天记录都需要获得
 * 2、通过req.user和用户发送的链接数据req.params分别得到sendUserId和receiveUserId
 * 3、通过sendUserId和receiveUserId找到两种聊天记录并返回
 */
import Message from "../models/message.model.js";
export const getRecordController = async (req, res) => {
    try {
        const sendUserId = req.user._id;
        const { id: receiveUserId } = req.params;
        const recordMessage = await Message.find({$or: [
            {sendUserId: sendUserId, receiveUserId: receiveUserId},
            {sendUserId: receiveUserId, receiveUserId: sendUserId}
        ]}).select('-password');
        res.status(200).json({recordMessage});
    } catch(error) {
        console.log('getMessage');
        res.status(500).json({
            message: "服务器异常!!"
        });
    }
}

/**
 * 1、发送信息，并且将发送的信息存储在数据库中
 * 2、通过req.user和req.params中的参数分别获得sendUserId和receiveUserId
 * 3、通过req.body得到用户发送的text和photo链接
 * 3、将photo存储到cloudinary上，同时返回cloudinary安全链接
 * 4、将用户的sendUserId、receiveUserId、text、cloudinary安全链接封装成Message对象存储在数据库中
 */
import {v2 as cloudinary} from 'cloudinary'
export const sendMessageController = async (req, res) => {
    try {
        const sendUserId = req.user._id;
        const {id: receiveUserId} = req.params;
        const {text, photo} = req.body;
        let secureUrl;
        if (photo) {
            const uploadResponse = await cloudinary.uploader.upload(photo);
            secureUrl = uploadResponse.secure_url;
        }

        const newMessage = Message({
            sendUserId,
            receiveUserId,
            text,
            photo: secureUrl
        });

        await newMessage.save();
        

        res.status(201).json(newMessage);

    } catch(error) {
        console.log("sendMessage");
        res.status(500).json({
            message: "服务器异常!!"
        });
    }
}