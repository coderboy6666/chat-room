import React, { useState } from 'react'
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify'
import { MessageSquare, User, Mail, Lock, EyeOff, Eye, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
/**
 * 1、注册页面
 * 2、{name, email, password}对象用来接收表格数据(使用useState，保证前端页面及时渲染)
 * 3、设置showPassword变量决定密码的展示形式(使用useState，保证前端页面能够根据showpassword进行及时渲染)
 * 4、将全局变量中的isRegister和register函数取出来
 * 5、定义checkForm函数用来判断表单输入数据的合法性
 * 5、定义表单提交函数submitForm
 */
const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false);
    const {isRegister, register} = useAuthStore();
    const checkForm = () => {
        if (!formData.name.trim()) return toast.error("请输入用户名！！");
        if (!formData.email.trim()) return toast.error("请输入邮箱！！");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("email格式不正确！！");
        if (!formData.password) return toast.error("请输入密码！！");
        if (formData.password.length < 6) return toast.error("密码的长度不少于6位！！");
        return true;
    }
    const submitForm = (e) => {
        e.preventDefault(); // 阻止默认事件触发
        if (checkForm()) {
            register(formData);
        }
    }
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* left side */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* LOGO */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div
                                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
                            group-hover:bg-primary/20 transition-colors"
                            >
                                <MessageSquare className="size-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                            <p className="text-base-content/60">Get started with your free account</p>
                        </div>
                    </div>

                    <form onSubmit={submitForm} className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Full Name</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                    <User className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type="text"
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                    <Mail className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type="email"
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                    <Lock className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                    >
                                    {showPassword ? (
                                        <EyeOff className="size-5 text-base-content/40" />
                                    ) : (
                                        <Eye className="size-5 text-base-content/40" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full" disabled={isRegister}>
                            {isRegister ? (
                                <>
                                <Loader2 className="size-5 animate-spin" />
                                Loading...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-base-content/60">
                        Already have an account?{" "}
                        <Link to="/login" className="link link-primary">
                            Sign in
                        </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* right side */}

            <AuthImagePattern
                title="Join our community"
                subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
            />
        </div>
    )
}

export default RegisterPage
