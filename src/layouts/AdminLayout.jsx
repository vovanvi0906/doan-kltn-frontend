import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  LogOut,
  Sparkles,
  ChevronRight,
  User,
  Sun,
  Moon,
} from 'lucide-react';
import { adminMenuConfig } from '../routers/menuConfig';
import { useAuth } from '../store/authStore';
import { useTheme } from '../store/themeStore';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // State quản lý đóng/mở Sidebar trên Mobile/Tablet
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Tìm tiêu đề của trang hiện tại từ menuConfig
  const currentMenuItem = adminMenuConfig.find((item) =>
    location.pathname.startsWith(item.path)
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f0f3f8] dark:bg-[#090d16] flex font-sans text-slate-800 dark:text-slate-100 select-none relative transition-colors duration-200">
      {/* ========================================= */}
      {/* BACKDROP NỀN ĐEN MỜ KHI MỞ MENU TRÊN MOBILE */}
      {/* ========================================= */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity animate-in fade-in duration-200"
        />
      )}

      {/* ========================================= */}
      {/* SIDEBAR (TRÁI - 260px, RESPONSIVE DRAWER) */}
      {/* ========================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] h-full bg-white dark:bg-[#0f172a] border-r border-slate-200/90 dark:border-slate-800/90 flex flex-col shrink-0 shadow-2xl transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 lg:shadow-sm ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 sm:px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                FixGo
              </h1>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                Hệ Thống Dịch Vụ
              </span>
            </div>
          </div>

          {/* Nút đóng Sidebar trên Mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đóng Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Navigation List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Menu Chức Năng
          </div>

          {adminMenuConfig.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/admin/dashboard'
                ? location.pathname === '/admin/dashboard'
                : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-150 group ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold border-r-4 border-blue-600 dark:border-blue-500 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  }`}
                />
                <span className="flex-1 truncate">{item.title}</span>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 opacity-70" />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User Mini Card Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 shrink-0">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {user?.fullName || 'Quản trị viên'}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                  {user?.email || 'admin@fixgo.vn'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================= */}
      {/* KHU VỰC BÊN PHẢI (TOPBAR + MAIN CONTENT) */}
      {/* ========================================= */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* TOPBAR (CAO 56px / h-14) */}
        <header className="h-14 bg-white dark:bg-[#0f172a] border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs z-10 transition-colors duration-200">
          {/* Topbar Left: Hamburger Menu Button & Page Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hamburger Button (Chỉ hiển thị trên Mobile/Tablet < lg) */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Mở Menu Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              <span className="truncate">
                {currentMenuItem?.title || 'Bảng Điều Khiển'}
              </span>
            </div>
          </div>

          {/* Topbar Right: Theme Toggle + Status & User Name */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button (Sáng / Tối) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-amber-400 border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer shadow-2xs active:scale-95"
              title={isDark ? 'Chuyển sang Theme Sáng' : 'Chuyển sang Theme Tối'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 animate-in spin-in-180 duration-300" />
              )}
            </button>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Hệ thống trực tuyến</span>
            </div>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden md:block">
                {user?.fullName || 'Quản trị viên'}
              </span>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA (BỌC BỞI BOX NỀN, TỰ ĐỘNG VỪA KHÍT 1 TRANG KHÔNG CUỘN NGOÀI) */}
        <main className="flex-1 p-2.5 sm:p-3.5 lg:p-4 flex flex-col min-h-0 overflow-hidden">
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-slate-800/90 shadow-2xs dark:shadow-slate-950/50 p-3 sm:p-3.5 flex-1 min-h-0 flex flex-col overflow-hidden transition-colors duration-200">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
