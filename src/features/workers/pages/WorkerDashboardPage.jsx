import React from 'react';
import { useAuth } from '../../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Briefcase, LogOut, Wrench, CheckCircle2, Clock } from 'lucide-react';

export default function WorkerDashboardPage() {
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Worker Workspace</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Bảng Thợ / Nhân Viên (/worker/dashboard)</h1>
            <p className="text-sm text-slate-400">Chào mừng bạn, {user?.fullName || user?.email || 'Worker'}</p>
          </div>

          <button
            onClick={handleLogout}
            className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-600/20 hover:border-rose-500/40 border border-slate-700 text-slate-300 hover:text-rose-300 text-sm font-medium transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Vai trò hiện tại</h3>
            <p className="text-2xl font-bold text-blue-400">{role || 'WORKER'}</p>
            <p className="text-xs text-slate-500">Nhận và xử trị đơn hàng dịch vụ</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Đơn hàng chờ nhận</h3>
            <p className="text-2xl font-bold text-amber-400">0 đơn mới</p>
            <p className="text-xs text-slate-500">Cập nhật theo thời gian thực</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Trạng thái Phiên</h3>
            <p className="text-2xl font-bold text-emerald-400">Authenticated</p>
            <p className="text-xs text-slate-500">Token sẵn sàng trong Header</p>
          </div>
        </div>
      </div>
    </div>
  );
}
