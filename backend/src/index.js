import express from 'express'
import authRoutes from '../routes/auth.route.js';
import messageRoutes from '../routes/message.route.js'
import dotenv from 'dotenv'
import { connectDB } from '../lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import {app, httpServer} from '../lib/socket.js'
import path from 'path'

dotenv.config();
// 获取当前进程工作的目录：前端（package.json），后端（packege.json）
const __dirname = path.resolve();
const PORT = process.env.PORT
app.use(express.json({ limit: '10mb' }));              // 支持 JSON 数据最大 10MB
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // 支持表单数据最大 10MB
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}))
app.use(cookieParser()); 
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

if (process.env.NODE_ENV === 'production') {
    // 所有的静态资源都从这里加载
    app.use(express.static(path.join(__dirname, '../web/dist')));
    /**
     * 1、配置前端任何路由访问的时候都返回index.html，只响应由react Router接管的请求
     * 2、后端路由逻辑是向后端发送请求，后端返回前端的index.html  
     */ 
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../web/dist/index.html'));
    });
}

httpServer.listen(PORT, () => {
    console.log("server is running: " + PORT);
    connectDB();
})


