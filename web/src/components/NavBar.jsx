import React from "react";
import { MessageSquare, Settings, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

/**
 * 1、定义导航栏
 * 2、导航栏的左侧是消息点击，右侧是设置和退出登录按键
 * 3、需要引入islogging来判断是否是登录状态
 * 4、引入logout实现退出登录状态功能
 */
const NavBar = () => {
    const {auth, logout} = useAuthStore();

    return (
        <div>
            <header
                className="border-b border-base-300 fixed w-full top-0 z-40 
            backdrop-blur-lg bg-base-100/80"
            >
                <div className="container mx-auto px-4 h-16">
                    <div className="flex items-center justify-between h-full">
                        <div className="flex items-center gap-8">
                            <Link
                                to="/"
                                className="flex items-center gap-2.5 hover:opacity-80 transition-all"
                            >
                                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-primary" />
                                </div>
                                <h1 className="text-lg font-bold">Chatty</h1>
                            </Link>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                to={"/settings"}
                                className={`
                            btn btn-sm gap-2 transition-colors
                            
                            `}
                            >
                                <Settings className="w-4 h-4" />
                                <span className="hidden sm:inline">Settings</span>
                            </Link>

                            {auth && (
                                <>
                                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                                    <User className="size-5" />
                                    <span className="hidden sm:inline">Profile</span>
                                </Link>

                                <button className="flex gap-2 items-center btn btn-sm" onClick={logout}>
                                    <LogOut className="size-5" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default NavBar;
