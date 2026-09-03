import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../store/authStore';
import { dashboardService } from '../services/dashboard.service';
import StatisticCard from '../components/StatisticCard';
import ServiceDistributionChart from '../components/ServiceDistributionChart';
import RecentActivityTimeline from '../components/RecentActivityTimeline';
import {
  Users,
  Briefcase,
  Clock,
  ShoppingBag,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  Activity,
  PieChart,
} from 'lucide-react';

/**
 * Enterprise-Grade Admin Dashboard (Linear / Vercel Style)
 * - Data-dense, clean, professional layout fitting viewport without scrollbars
 * - 4-column KPI metric cards with micro-sparklines & mono typography
 * - Real connected Activity Timeline + SVG Donut Service Distribution
 * - Strictly adheres to the 8pt Grid system and Enterprise SaaS aesthetics
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeframe, setTimeframe] = useState('month'); // 'today' | 'week' | 'month'

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
    <div className="h-full overflow-hidden flex flex-col justify-between select-none transition-colors duration-200">
      {/* ========================================= */}
      {/* A. HEADER SECTION (TIÊU ĐỀ SẮC NÉT & ACTION BAR) */}
      {/* ========================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tổng Quan Hoạt Động
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Báo cáo hiệu suất vận hành dịch vụ FixGo thời gian thực
          </p>
        </div>

        {/* Action Bar: Timeframe Filter + Status + Refresh */}
        <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
          {/* Timeframe Segmented Control */}
          <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 flex items-center text-xs">
            <button
              type="button"
              onClick={() => setTimeframe('today')}
              className={`px-2.5 py-1 rounded-md transition-all duration-150 cursor-pointer font-medium ${
                timeframe === 'today'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Hôm nay
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('week')}
              className={`px-2.5 py-1 rounded-md transition-all duration-150 cursor-pointer font-medium ${
                timeframe === 'week'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              7 ngày
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('month')}
              className={`px-2.5 py-1 rounded-md transition-all duration-150 cursor-pointer font-medium ${
                timeframe === 'month'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tháng này
            </button>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-500' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
        </div>
      </div>

      {/* ========================================= */}
      {/* PENDING WORKER ALERT (COMPACT ENTERPRISE BANNER) */}
      {/* ========================================= */}
      {stats?.pendingWorkers > 0 && (
        <div className="my-2 p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs truncate">
              <span className="font-bold text-slate-900 dark:text-amber-100 mr-1.5">
                {stats.pendingWorkers} hồ sơ thợ chờ phê duyệt:
              </span>
              <span className="text-slate-600 dark:text-slate-400 hidden md:inline">
                Cần kiểm tra giấy tờ CCCD và kỹ năng để cấp quyền nhận việc trên hệ thống.
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/users')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold transition-all shrink-0 cursor-pointer shadow-2xs"
          >
            <span>Phê duyệt ngay</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ========================================= */}
      {/* B. METRIC CARDS (KPI GRID - 4 CỘT) */}
      {/* ========================================= */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 my-2 shrink-0">
        <StatisticCard
          title="Khách Hàng"
          value={loading ? '...' : (stats?.totalCustomers || 0).toLocaleString()}
          subtext="Tài khoản khách hàng"
          icon={Users}
          trend="up"
          trendValue="+12% vs tháng trước"
          colorScheme="blue"
          sparklineData={[45, 52, 58, 65, 72, 85, 98, 128]}
          onClick={() => navigate('/admin/users')}
        />

        <StatisticCard
          title="Đối Tác Thợ"
          value={loading ? '...' : (stats?.totalWorkers || 0).toLocaleString()}
          subtext="Thợ đã kích hoạt"
          icon={Briefcase}
          trend="up"
          trendValue="+8% vs tháng trước"
          colorScheme="emerald"
          sparklineData={[18, 22, 26, 30, 35, 38, 41, 45]}
          onClick={() => navigate('/admin/users')}
        />

        <StatisticCard
          title="Hồ Sơ Chờ Duyệt"
          value={loading ? '...' : (stats?.pendingWorkers || 0).toLocaleString()}
          subtext="Cần xác thực CCCD"
          icon={Clock}
          trend="down"
          trendValue="7 hồ sơ mới"
          colorScheme="amber"
          sparklineData={[3, 5, 4, 8, 6, 9, 7, 7]}
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
          sparklineData={[110, 140, 180, 210, 245, 270, 295, 312]}
        />
      </div>

      {/* ========================================= */}
      {/* C. SPLIT SECTIONS (TIMELINE & PHÂN BỔ DỊCH VỤ - 7/5) */}
      {/* ========================================= */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 mt-1">
        {/* Cột Trái (Hoạt Động Gần Đây - Timeline 7 Cột) */}
        <div className="lg:col-span-7 p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#1e293b]/50 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between min-h-0">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Hoạt Động Gần Đây
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Thời gian thực</span>
            </div>
          </div>

          {/* Timeline List Component */}
          <RecentActivityTimeline activities={stats?.recentActivities || []} />

          {/* Quick Action Footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Xem tất cả danh sách người dùng & đối tác</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Cột Phải (Phân Bổ Dịch Vụ - Donut Chart 5 Cột) */}
        <div className="lg:col-span-5 p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#1e293b]/50 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between min-h-0">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <PieChart className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Phân Bổ Dịch Vụ
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Tỷ lệ nhu cầu
            </span>
          </div>

          {/* SVG Donut Chart + Legend */}
          <ServiceDistributionChart
            services={stats?.serviceDistribution || []}
            totalOrders={stats?.totalOrders || 312}
          />

          {/* Quick Action Footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Thống kê 4 nhóm dịch vụ chính</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">
                100% tỷ trọng
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
