import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config();

export const registerController = async (req, res) => {
    // console.log(req.body);
    const {name, email, password} = req.body;
    try {
        if (password.length < 6) {
            return res.status(400).json({ message: "密码长度必须大于6!!"});
        }

        const user = await User.findOne({email});
        if (user !== null) return res.status(400).json({message: "邮箱已存在!!"});

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashPassword
        });
        if (newUser !== null) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                photo: newUser.photo
            })
        } else {
            res.status(400).json({message: "用户创建失败!!"});
        }
    } catch(error) {
        res.status(500).json({
            message: "服务器异常!!"
        })
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({
            message: "邮箱或者密码不能为空!!"
        });
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({ message: "用户名或密码不正确!!" });
        const is_valid = await bcrypt.compare(password, user.password);
        if (!is_valid) return res.status(400).json({ message: "用户名或密码不争取!!" });
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        })
    } catch(error) {
        res.status(500).json({ message: "服务器异常!!" });
    }
    
}

export const logoutController = (req, res) => {
    try {
        res.cookie('jwt', "", {maxAge: 0});
        res.status(200).json({ message: "已退出登录!!" });
    } catch(error) {
        res.status(500).json({ message: "服务器异常!!" });
    }
}

/**
 * 
 * 1、只能更新用户的头像，通过req.body得到用户的头像信息
 * 2、然后通过req.user得到_id
 * 3、将得到的用户头像存入cloudinary中，并生成地址，以便后面显示
 * 4、将生成的用户地址存入mongodb中
 * 
 */
import cloudinary from "../lib/cloudinary.js";
export const updateController = async (req, res) => {
    try {
        const {photo} = req.body;
        const userId = req.user._id;
        if (!photo) return res.status(400).json({
            message: "请上传用户头像!!"
        });
        const uploadResponse = await cloudinary.uploader.upload(photo);
        const updateUser = await User.findByIdAndUpdate(userId, {photo: uploadResponse.secure_url}, {new: true})
        if (!updateUser) res.status(400).json({
            message: "数据更新失败!!"
        })
        res.status(200).json(updateUser)
    } catch(error) {
        res.status(500).json({
            message: "服务器异常!!"
        })
    }    
}

/**
 * 
 * 1、利用req.user属性验证protectRoute是否生效以及当前是否处于登录状态，如果不在登陆状态需要返回到登录注册页面
 * 
 */
export const checkController = async (req, res) => {
    try {
        // console.log("message");
        res.status(200).json(req.user);
    } catch(error) {
        console.log("checkController");
        res.status(500).json({
            message: "服务器异常!!"
        });
    }
}