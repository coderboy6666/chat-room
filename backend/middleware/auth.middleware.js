/**
 * 1、获取jwttoken，并且通过jwttoken获取userId(传入token和密钥)
 * 2、通过jwttoken得到的userId查询mongodb数据库
 * 
 */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import User from '../models/user.model.js';
dotenv.config();
export const protectRoute = async (req, res, next) => {
    try {
        // 获取cookie时需要使用cookieParse解析cookie中的元素，cookie需要从req中获取，获取时使用cookies
        const jwttoken = req.cookies.jwt;
        // console.log(jwttoken);
        if (!jwttoken) return res.status(400).json({
            message: "无法访问，请登录后访问!!"
        });
        const decode = jwt.verify(jwttoken, process.env.private_pass);
        // console.log(decode)
        if (!decode) return res.status(400).json({
            message: "无法访问，请登陆后访问!!"
        })
        const userId = decode.userId;
        //
        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(400).json({
            message: "无法访问，请登陆后访问!!"
        })
        req.user = user;
        // console.log(user);
        next();
    } catch(error) {
        console.log("protectRoute");
        res.status(500).json({
            message: "服务器异常!!"
        })
    }

}