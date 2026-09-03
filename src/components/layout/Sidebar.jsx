import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  X,
  LogOut,
  User,
} from 'lucide-react';
import { adminMenuConfig } from '../../routers/menuConfig';
import { useAuth } from '../../store/authStore';

/**
 * Enterprise SaaS Sidebar Navigation (Linear / Vercel Style)
 * - Zero white borders, completely eliminated chevron arrows
 * - Active Pill with subtle gradient and vertical accent indicator (w-1 h-5 bg-blue-500 rounded-full)
 * - Smooth hover micro-interactions (transition-all duration-200 ease-in-out)
 * - Strict 8pt Grid System (space-y-1.5 px-3)
 */
export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity animate-in fade-in duration-200"
        />
      )}

      {/* Main Sidebar Aside */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] h-full bg-[#0b0f19] dark:bg-[#0b0f19] border-r border-slate-800/70 flex flex-col shrink-0 shadow-2xl transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 lg:shadow-none select-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* ========================================= */}
        {/* 1. HEADER SIDEBAR: LOGO & BRAND */}
        {/* ========================================= */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-white tracking-tight leading-none">
                  FixGo
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  PRO
                </span>
              </div>
              <span className="text-[10.5px] font-medium text-slate-400 block mt-0.5">
                Hệ Thống Dịch Vụ
              </span>
            </div>
          </div>

          {/* Close button for Mobile/Tablet */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đóng Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================= */}
        {/* 2. MENU NAVIGATION (8PT GRID SYSTEM) */}
        {/* ========================================= */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 no-scrollbar">
          {/* Group Label */}
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 mb-2">
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
                onMouseMove={handleMouseMove}
                onClick={() => setIsSidebarOpen(false)}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all duration-200 ease-in-out group spotlight-item ${
                  isActive
                    ? 'bg-slate-800/80 dark:bg-slate-800/90 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium'
                }`}
              >
                {/* Active Indicator Bar (Vertical accent pill on active state) */}
                {isActive ? (
                  <span className="w-1 h-5 bg-blue-500 rounded-full shrink-0 shadow-sm shadow-blue-500/50" />
                ) : (
                  <span className="w-1 h-5 opacity-0 shrink-0" />
                )}

                {/* Menu Item Icon */}
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
                    isActive
                      ? 'text-blue-400'
                      : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />

                {/* Title */}
                <span className="flex-1 truncate tracking-tight">{item.title}</span>
              </NavLink>
            );
          })}
        </div>

        {/* ========================================= */}
        {/* 3. USER PROFILE MINI FOOTER */}
        {/* ========================================= */}
        <div className="p-3 border-t border-slate-800/60 bg-[#090d16] shrink-0">
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {user?.fullName || 'Quản trị viên'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user?.email || 'admin@fixgo.vn'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
