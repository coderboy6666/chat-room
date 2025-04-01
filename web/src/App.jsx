import NavBar from './components/NavBar';
import {Routes, Route, Navigate} from 'react-router-dom'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import SettingPage from './pages/SettingPage';
import useAuthStore from './store/authStore';
import { useEffect } from 'react';
import { Loader} from 'lucide-react' // svg图标
import { ToastContainer } from 'react-toastify';
import useThemeStore from './store/themeStore';
function App() {
    // 获取全局函数checkIsLogging，并且在useEffect函数中调用防止阻塞
    const {auth, checkIsLogging, isChecking} = useAuthStore();
    const {theme} = useThemeStore();
    // setTheme(localStorage.getItem('theme'));
    useEffect(() => {
        checkIsLogging();
    }, [checkIsLogging]);

    if (isChecking && !auth) return (
        <div className='flex items-center justify-center h-screen'>
            <Loader className='size-10 animate-spin' />
        </div>
    );
    

    return (
        <div data-theme={theme}>
            <NavBar />
            <Routes>
                {/* 如果不满足都向主页面转移，如果主页面用户不存在就重定向到登陆界面 */}
                <Route path='/' element={auth ? <HomePage /> : <Navigate to={'/login'}/>} />
                <Route path='/login' element={!auth ? <LoginPage /> : <Navigate to={'/'} />} />
                <Route path='/profile' element={auth ? <ProfilePage /> : <Navigate to={'/'} />} />
                <Route path='/register' element={!auth ? <RegisterPage /> : <Navigate to={'/'} />} />
                <Route path='/settings' element={<SettingPage />} />
            </Routes>
            <ToastContainer />
        </div>
        
    )
}

export default App
