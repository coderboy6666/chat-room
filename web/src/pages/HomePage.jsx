import React from 'react'
import SideBar from '../components/SideBar';
import ChatContainer from '../components/ChatContainer';
import NoChatContainer from '../components/NoChatContainer';
import useMessageStore from '../store/messageStore';

/**
 * 1、创建homepage组件
 * 2、界面由两个大部分构成：左侧SideBar和右侧Messages
 * 
 */
const HomePage = () => {
    const {selectedUser} = useMessageStore();
    return (
        <div className="h-screen bg-base-200">
            <div className="flex items-center justify-center pt-20 px-4">
                <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
                <div className="flex h-full rounded-lg overflow-hidden">
                    <SideBar />
                    {!selectedUser ? <NoChatContainer /> : <ChatContainer />}
                </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage
