import React, { useEffect, useRef } from 'react'
import useMessageStore from '../store/messageStore'
import MessageSkeleton from './skeletons/MessageSkeleton';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import useAuthStore from '../store/authStore';
import { formatMessageTime } from './../lib/utils';

/**
 * 1、右侧聊天框
 * 2、获取sidebar中的selectedUser变量
 * 3、通过selectedUser变量更新聊天信息框
 * 4、聊天信息利用全局变量中的messages和getMessages获得
 */
const ChatContainer = () => {
    const {selectedUser, messages, getMessages, messagesLoading, subscribeToMessages, unsubscribeFromMessages} = useMessageStore();
    const {auth} = useAuthStore();
    const messageEndRef = useRef();
    useEffect(() => {
        getMessages(selectedUser._id);
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
          messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (messagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                {/* <ChatHeader /> */}
                <MessageSkeleton />
                <MessageInput />
            </div>
        )
    }
    return (
        <div className="flex-1 flex flex-col overflow-auto">
            {/* <ChatHeader /> */}
            <ChatHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`chat ${message.sendUserId === auth._id ? "chat-end" : "chat-start"}`}
                        ref={messageEndRef}
                    >
                        <div className=" chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img
                                    src={
                                        message.sendUserId === auth._id
                                        ? auth.photo || "/avatar.png"
                                        : selectedUser.photo || "/avatar.png"
                                    }
                                    alt="profile pic"
                                />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>
                        <div className="chat-bubble flex flex-col">
                            {message.photo && (
                                <img
                                    src={message.photo}
                                    alt="Attachment"
                                    className="sm:max-w-[200px] rounded-md mb-2"
                                />
                            )}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <MessageInput />
        </div>
    )
}

export default ChatContainer
