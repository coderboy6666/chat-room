import { create } from 'zustand';
import axiosInstance from './../lib/axios';
import { toast } from 'react-toastify';
import useAuthStore from './authStore';
/**
 * 1、message相关的全局信息
 * 2、定义users变量用来存储所有好友信息
 * 3、定义usesLoading变量表示好友列表加载状态
 * 4、定义getUsers函数用来获取好友列表
 * 6、定义setSelectUser函数和selectuser用来存储选中的对象
 * 7、定义messages和getMessages获取用户的聊天记录
 * 8、定义messagesLoading表示聊天记录加载状态
 */
const useMessageStore = create((set, get) => ({
    users: null,
    usersLoading: true,
    onlineUsers: [],
    selectedUser: null,
    messages: [],
    messagesLoading: true,
    sendMessageLoading: true,
    onlineUsers: [],
    /**
     * 1、利用axios调用后端api
     */
    getUsers: async () => {
        try {
            const res = await axiosInstance.get('/message/sidebar');
            // console.log(res.data);
            set({users: res.data.sidebarUsers});
            toast.success("获取用户列表成功！！");
        } catch(error) {
            toast.error("获取用户列表失败！！");
        } finally {
            set({usersLoading: false});
        }
    },
    setSelectedUser: (selectedUser) => {
        set({selectedUser})
    },
    /**
     * 1、获取用户的聊天记录
     * 2、通过axios获取某一个用户的聊天记录
     * 3、将获取的record记录在messages变量中
     */
    getMessages: async (userId) => {
        set({messagesLoading: true});
        try {
            const res = await axiosInstance.get(`/message/getRecord/${userId}`);
            toast.success("用户聊天记录获取成功！！");
            set({messages: res.data.recordMessage});
        } catch(error) {
            toast.error("用户聊天记录获取失败！！");
        } finally {
            set({messagesLoading: false});
        }   
    },
    /**
     * 1、聊天消息发送函数
     * 2、需要传入receiveUserId和data
     */
    sendMessages: async (receiveUserId, data) => {
        set({sendMessageLoading: true});
        // 获取全局变量的值，一定要加，否则访问不到后面的...messages
        const {messages} = get();
        try {
            const res = await axiosInstance.post(`/message/sendMessage/${receiveUserId}`, data);
            const socket = useAuthStore.getState().socket;
            if (res.data) set({messages: [...messages, res.data]});
            socket.emit('receiveMessages', {
                selectedUser: get().selectedUser,
                messages: res.data 
            });
            toast.success("消息发送成功！！");
        } catch(error) {
            toast.error("消息发送失败！！");
        } finally {
            set({sendMessageLoading: false});
        }
    },
    subscribeToMessages: () => {
        const { selectedUser } = get();
        // console.log(messages)
        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket;   
        socket.on('newMessages', (newMessages) => {
            // 这段代码保证每次获取的都是最新的messages，不能写在回调函数外面，否则messages的值为最初的值
            const messages = get().messages;
            if (newMessages.sendUserId !== selectedUser._id) return;
            set({messages: [...messages, newMessages]});
        })
    },
    // 一定要写这个函数每次在socket监听到消息之后都需要将之前的
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessages");
    }
}))

export default useMessageStore;