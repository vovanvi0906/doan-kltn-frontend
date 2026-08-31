import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../store/authStore';
import { dashboardService } from '../services/dashboard.service';
import StatisticCard from '../components/StatisticCard';
import {
  Users,
  Briefcase,
  Clock,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Activity,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  return (
    <div className="h-full flex flex-col justify-between space-y-3 sm:space-y-3.5 select-none transition-colors duration-200">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" />
              <span>Bảng Điều Khiển</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Tổng Quan Hoạt Động Hệ Thống
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Xin chào, <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.fullName || user?.email || 'Quản trị viên'}</span>. Dưới đây là tình hình hoạt động của FixGo hôm nay.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 border border-slate-200/60 dark:border-slate-700/60"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-600 dark:text-blue-400' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>

          <button
            onClick={() => navigate('/admin/users')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Quản Lý Người Dùng</span>
          </button>
        </div>
      </div>

      {/* Pending Worker Alert Banner (Compact) */}
      {stats?.pendingWorkers > 0 && (
        <div className="p-2.5 sm:p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3 shadow-2xs shrink-0 animate-in fade-in">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="text-xs truncate">
              <span className="font-bold text-slate-900 dark:text-amber-100 mr-1.5">
                {stats.pendingWorkers} hồ sơ thợ chờ phê duyệt:
              </span>
              <span className="text-slate-600 dark:text-slate-400 hidden sm:inline">
                Cần kiểm tra CCCD và kỹ năng để cấp quyền nhận việc.
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/users')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold transition-all shrink-0 cursor-pointer shadow-2xs"
          >
            <span>Xem xét</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Statistic Cards Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3.5 shrink-0">
        <StatisticCard
          title="Khách Hàng"
          value={loading ? '...' : (stats?.totalCustomers || 0).toLocaleString()}
          subtext="Tài khoản khách hàng"
          icon={Users}
          trend="up"
          trendValue="+12% tháng này"
          colorScheme="blue"
          onClick={() => navigate('/admin/users')}
        />

        <StatisticCard
          title="Thợ Đối Tác"
          value={loading ? '...' : (stats?.totalWorkers || 0).toLocaleString()}
          subtext="Đối tác thợ dịch vụ"
          icon={Briefcase}
          trend="up"
          trendValue="+8% tháng này"
          colorScheme="emerald"
          onClick={() => navigate('/admin/users')}
        />

        <StatisticCard
          title="Hồ Sơ Chờ Duyệt"
          value={loading ? '...' : (stats?.pendingWorkers || 0).toLocaleString()}
          subtext="Hồ sơ thợ cần xác thực"
          icon={Clock}
          trend="down"
          trendValue="Cần xử lý sớm"
          colorScheme="amber"
          onClick={() => navigate('/admin/users')}
        />

        <StatisticCard
          title="Tổng Đơn Đặt"
          value={loading ? '...' : (stats?.totalOrders || 0).toLocaleString()}
          subtext="Đơn đặt dịch vụ"
          icon={ShoppingBag}
          trend="up"
          trendValue="+15% tuần này"
          colorScheme="purple"
        />
      </div>

      {/* Middle Section: Recent Activity & Service Category Distribution */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3.5">
        {/* Recent Activity (7 cols trên desktop) */}
        <div className="lg:col-span-7 p-3.5 sm:p-4 rounded-xl bg-slate-50/60 dark:bg-[#1e293b]/40 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex flex-col justify-between min-h-0">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/70 dark:border-slate-800/70 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Hoạt Động Gần Đây</h3>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Cập nhật tự động</span>
          </div>

          <div className="space-y-2 my-auto py-1">
            {stats?.recentActivities?.slice(0, 3).map((act) => (
              <div
                key={act.id}
                className="p-2 sm:p-2.5 rounded-lg bg-white dark:bg-[#0f172a]/80 border border-slate-200/70 dark:border-slate-800/70 flex items-start justify-between gap-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-2xs"
              >
                <div className="flex items-start gap-2 min-w-0">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <div className="min-w-0">
                    <h5 className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-snug truncate">
                      {act.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{act.description}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 mt-0.5">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Service Category Breakdown (5 cols trên desktop) */}
        <div className="lg:col-span-5 p-3.5 sm:p-4 rounded-xl bg-slate-50/60 dark:bg-[#1e293b]/40 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex flex-col justify-between min-h-0">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/70 dark:border-slate-800/70 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Phân Bổ Dịch Vụ</h3>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Tỷ lệ nhu cầu</span>
          </div>

          <div className="space-y-2 my-auto py-1">
            {stats?.serviceDistribution?.map((service, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{service.name}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">
                    {service.percentage}% ({service.count} đơn)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${service.percentage}%`,
                      backgroundColor: service.color || '#3b82f6',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800/70 shrink-0">
            <button
              onClick={() => navigate('/admin/users')}
              className="w-full py-1.5 px-3 rounded-lg bg-white dark:bg-[#0f172a] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer group shadow-2xs"
            >
              <span>Đi đến Quản trị Người Dùng</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
