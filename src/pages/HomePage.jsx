import React from 'react';
import { useAuth } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Sparkles, Home, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase mb-2">
              <Home className="w-3.5 h-3.5" />
              <span>Customer Portal</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Trang Chủ Dịch Vụ (Home - /)</h1>
            <p className="text-sm text-slate-400">Xin chào, {user?.fullName || user?.email || 'Khách hàng'}</p>
          </div>

          <button
            onClick={handleLogout}
            className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-600/20 hover:border-rose-500/40 border border-slate-700 text-slate-300 hover:text-rose-300 text-sm font-medium transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>

        {/* Welcome Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Vai trò tài khoản</h3>
            <p className="text-2xl font-bold text-emerald-400">{role || 'CUSTOMER'}</p>
            <p className="text-xs text-slate-500">Khách hàng sử dụng dịch vụ tiện ích</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Dịch vụ đã đặt</h3>
            <p className="text-2xl font-bold text-blue-400">0 dịch vụ</p>
            <p className="text-xs text-slate-500">Khám phá các gói dọn dẹp & sửa chữa</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Bảo mật tài khoản</h3>
            <p className="text-2xl font-bold text-indigo-400">JWT Verified</p>
            <p className="text-xs text-slate-500">Phiên làm việc an toàn</p>
          </div>
        </div>
      </div>
    </div>
  );
}
