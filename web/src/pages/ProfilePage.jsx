import React, { useState } from 'react'
import useAuthStore from '../store/authStore'
import { Camera, User, Mail } from 'lucide-react';

/**
 * 1、个人信息页面
 * 2、从authStore中得到isUpdateProfile变量和updateProfile函数和auth变量
 * 3、使用useState定义selectPhoto用来表示选择的图片
 * 3、定义提交图片的函数submitPhoto，从前端获得图片并将其转化为64base格式，最后将64base格式的图片提交到后端数据库
 */
const ProfilePage = () => {
    const {auth, isUpdateProfile, updateProfile} = useAuthStore();
    const [selectPhoto, setSelectPhoto] = useState(null);
    console.log(auth)
    /**
     * 1、获取photo
     * 2、将photo转化为64base
     * 3、调用updateProfile函数上传图片
     */
    const submitPhoto = async (e) => {
        // 获取图片
        const photo = e.target.files[0];
        // 将图片转化为64base
        if (!photo) return;
        const reader = new FileReader();
        reader.readAsDataURL(photo);
        reader.onload = async () => {
            const base64Photo = reader.result;
            setSelectPhoto(base64Photo);
            await updateProfile({photo: base64Photo});
        }
    }
    return (
        <div className="h-screen pt-20">
            <div className="max-w-2xl mx-auto p-4 py-8">
                <div className="bg-base-300 rounded-xl p-6 space-y-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold ">Profile</h1>
                        <p className="mt-2">Your profile information</p>
                    </div>

                    {/* avatar upload section */}

                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <img
                                src={selectPhoto || auth.photo || "/avatar.png"}
                                alt="Profile"
                                className="size-32 rounded-full object-cover border-4 "
                            />
                            <label
                                htmlFor="avatar-upload"
                                className={`
                                absolute bottom-0 right-0 
                                bg-base-content hover:scale-105
                                p-2 rounded-full cursor-pointer 
                                transition-all duration-200
                                ${isUpdateProfile ? "animate-pulse pointer-events-none" : ""}
                                `}
                            >
                                <Camera className="w-5 h-5 text-base-200" />
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={submitPhoto}
                                    disabled={isUpdateProfile}
                                />
                            </label>
                        </div>
                        <p className="text-sm text-zinc-400">
                            {isUpdateProfile ? "Uploading..." : "Click the camera icon to update your photo"}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Full Name
                            </div>
                            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{auth?.name}</p>
                        </div>

                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email Address
                            </div>
                            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{auth?.email}</p>
                        </div>
                    </div>

                    <div className="mt-6 bg-base-300 rounded-xl p-6">
                        <h2 className="text-lg font-medium  mb-4">Account Information</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                                <span>Member Since</span>
                                <span>{auth.createdAt?.split("T")[0]}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span>Account Status</span>
                                <span className="text-green-500">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
