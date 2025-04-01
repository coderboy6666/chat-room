import { create } from 'zustand'
import axiosInstance from '../lib/axios'
import { toast } from 'react-toastify';
import { io } from 'socket.io-client'
/**
 * 1、创建全局变量
 * 2、维护变量auth、isLogging、isRegister、isUpdateProfile、isChecking
 * 3、维护函数函数checkIsLogging用来验证当前是否处于登录状态（使用axios进行通信验证）
 */
const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3000' : '/';
const useAuthStore = create((set, get) => ({
    auth: null,
    islogging: false,
    isChecking: true,
    isRegister: false,
    isUpdateProfile: false,
    // 存储当前用户的socket对象
    socket: null,
    // 存储当前在线的用户
    onlineUsers: [],
    checkIsLogging: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({auth: res.data});
            get().connectSocket();
        } catch(error) {
            set({auth: null});
        } finally {
            set({isChecking: false});
        }
    },
    /** 
     * 1、注册函数
     * 2、利用axios通过post请求将数据{name, email, password}带给后端，同时获取从后端返回的数据res.data(json数据)，将auth置为res.data
     * 3、在向后端获取数据之前将isRegister置为true，最终无论获取失败还是成功finally都将isRegister置为false
     */
    register: async (data)=> {
        set({isRegister: true});
        try {
            const res = await axiosInstance.post('/auth/register', data);
            // todo list: 配置成功弹窗
            toast.success("用户注册成功！！");
            set({auth: res.data});
            get().connectSocket();
        } catch(error) {
            //todo list: 配置失败弹窗弹窗
            toast.error("用户注册失败！！");
            set({auth: null});
        } finally {
            set({isRegister: false});
        }
    },

    /**
     * 1、登录函数
     * 2、将islogging置为true
     * 2、利用axios通过post请求将数据{email, password}传到后端，同时从后端返回数据res.data，将auth置为res.data
     * 3、最后将isLogging置为false
     */
    login: async (data) => {
        set({isloggin: true}); // 登录之前一直处于登录状态
        try {
            const res = await axiosInstance.post('/auth/login', data);
            // todo list: 配置成功弹窗
            toast.success("用户登录成功！！");
            set({auth: res.data});
            get().connectSocket();
        } catch(error) {
            // todo list: 配置失败弹窗 
            toast.error("用户登录失败！！");
            set({auth: null});
        } finally {
            set({islogging: false});
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            // 配置成功弹窗
            toast.success("用户已退出！！");
            set({auth: null});
            get().disconnectSocket();
        } catch(error) {
            // 配置失败弹窗
        } finally {

        }
    },

    /**
     * 1、更新用户头像
     * 2、使用axios访问后端接口
     * 3、更新isUpdateProfile
     * 4、将后端返回的数据重新赋值给auth
     */
    updateProfile: async (data) => {
        set({isUpdateProfile: true});
        try {
            const res = await axiosInstance.put('/auth/update', data);
            toast.success("用户头像更新成功！！");
            set({auth: res.data});
        } catch(error) {
            toast.error("更新用户头像失败！！");
        } finally {
            set({isUpdateProfile: false});
        }
    },
    // 定义socket连接函数，需要将auth._id传到后端
    connectSocket: () => {
        const { auth } = get();
        if (!auth || get().socket?.connected) return;
        const socket = io(BASE_URL, {
            query: {
                userId: auth._id
            }
        })
        // 不需要手动连接
        // socket.connect();
        // 获取在线用户，每次在建立socket连接的时候更新
        socket.on('onlineUsers', (data) => {
            set({onlineUsers: data})
        })
        set({socket: socket});
    },
    disconnectSocket: () => {
        if (get().socket.connected) get().socket.disconnect();
    }
}))

export default useAuthStore;