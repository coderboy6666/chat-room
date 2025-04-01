import { Server } from 'socket.io'
import http from 'http'
import express from 'express'
/**
 * 1、创建socket服务
 */
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:8080']
    }
});

// 将所有的socket请求都使用userId-socketId的键值对保留
const userSocketMap = {};

io.on("connection", (socket) => {
    console.log('socket连接成功：', socket.id);
    // 获取socket传过来的userId
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;
    console.log(userSocketMap)
    socket.on("receiveMessages", (data) => {
        const sendUserSocketId = getReceiverSocketId(data.selectedUser._id);
        io.to(sendUserSocketId).emit('newMessages', data.messages);
    })  
    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit('onlineUsers', Object.keys(userSocketMap));
    });
    io.emit('onlineUsers', Object.keys(userSocketMap))
})

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

export {io, app, httpServer};