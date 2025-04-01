import React, { useRef, useState } from 'react'
import { X, Image, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import useMessageStore from '../store/messageStore';
/**
 * 1、发送信息框
 * 2、左侧包括文本输入框和图片预览弹窗，右侧包括发送按钮和图片选择按钮
 */
const MessageInput = () => {
    /**
     * 1、利用useState定义selectPhoto、setSelectPhoto用来展示预览图片
     * 2、定义handlePhoto函数用来处理photo的显示
     */
    const [selectPhoto, setSelectPhoto] = useState(null);
    const [text, setText] = useState("");
    const {sendMessages, selectedUser} = useMessageStore();
    // 使用useRef获取组件对象，方便在其他地方能够模拟该组件的事件
    const fileInputRef = useRef(null);
    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            toast.error("请选择图片格式的文件！！");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectPhoto(reader.result);
        };
        reader.readAsDataURL(file);
    }
    const removePhoto = () => {
        setSelectPhoto(null);
    }
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !selectPhoto) return;
        if (selectedUser === null) return;
        // 当前选择的用户id
        const receiveUserId = selectedUser._id;
        // 上传的图片
        const photo = selectPhoto;
        // 上传的text
        const uploadText = text;
        // 将数据封装成data对象
        const data = {
            text: uploadText,
            photo
        }
        // 向后端上传数据
        await sendMessages(receiveUserId, data);
        // 立刻获取用户的聊天消息
        // await getMesssages(selectedUser._id);
        setSelectPhoto(null);
        setText("");

    }


    return (
        <div className="p-4 w-full">
            {selectPhoto && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img
                            src={selectPhoto}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                            onClick={removePhoto}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
                            flex items-center justify-center"
                            type="button"
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handlePhoto}
                    />

                    <button
                        type="button"
                        className={`hidden sm:flex btn btn-circle
                                ${selectPhoto ? "text-emerald-500" : "text-zinc-400"}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image size={20} />
                    </button>
                </div>
                <button
                    type="submit"
                    className="btn btn-sm btn-circle"
                    disabled={!text.trim() && !selectPhoto}
                >
                    <Send size={22} />
                </button>
            </form>
        </div>
    )
}

export default MessageInput
