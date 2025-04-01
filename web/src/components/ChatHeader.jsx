import React from 'react'
import useMessageStore from '../store/messageStore'
import { X } from 'lucide-react';

/**
 * 1、右侧聊天框的头部部分
 * 2、左侧显示用户的头像以及用户的姓名和登录状态
 * 3、右侧关闭窗口按钮
 */
const ChatHeader = () => {
    /**
     * 1、引入全局变量selectedUser
     */
    const { selectedUser, setSelectedUser } = useMessageStore();
    console.log(selectedUser)

    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img src={selectedUser.photo || "/avatar.png"} alt={selectedUser.name} />
                        </div>
                    </div>

                    {/* User info */}
                    <div>
                        <h3 className="font-medium">{selectedUser.name}</h3>
                        {/* <p className="text-sm text-base-content/70">
                            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                        </p> */}
                    </div>
                </div>

                {/* Close button */}
                <button onClick={() => setSelectedUser(null)}>
                    <X />
                </button>
            </div>
        </div>
    )
}

export default ChatHeader
