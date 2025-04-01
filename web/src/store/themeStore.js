/**
 * 1、将theme保存到localStorage里面，防止刷新之后theme丢失
 * 2、定义全局变量theme用来存储主题，由于在setting中会有选择theme按钮需要theme及时生效
 * 3、定义setTheme函数用来将theme放入localStorage以及更新theme的值
 */

import { create } from "zustand";

const useThemeStore = create((set) => ({
    theme: localStorage.getItem('theme') || 'dart',
    setTheme: (theme) => {
        localStorage.setItem('theme', theme);
        set({theme});
    }
}))

export default useThemeStore;