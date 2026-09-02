import React from 'react';
import {
  Search,
  MapPin,
  Wallet,
  Bell,
  User,
  Menu,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../../store/authStore';

export default function CustomerNavbar({ isCollapsed, setIsCollapsed, setActiveTab }) {
  const { user } = useAuth();
  const userDisplayName = user?.fullName || user?.name || user?.email?.split('@')[0] || 'Khách hàng';

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Sidebar Toggle & Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-xl bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          title="Thu gọn / Mở rộng menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm kiếm thợ sửa điện, sửa nước, vệ sinh máy lạnh..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Right: Location, Wallet, Notifications & User */}
      <div className="flex items-center gap-3">
        {/* Location badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-rose-400" />
          <span>TP. Hồ Chí Minh</span>
        </div>

        {/* Quick Wallet */}
        <button
          onClick={() => setActiveTab('wallet')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all cursor-pointer"
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>0 đ</span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => setActiveTab('notifications')}
          className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          title="Thông báo"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-slate-900" />
        </button>

        {/* User Mini Avatar */}
        <button
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs">
            {userDisplayName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:inline text-xs font-bold truncate max-w-[100px]">
            {userDisplayName}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      </div>
    </header>
  );
}
